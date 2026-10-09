package com.example.minigmail.service;

import com.example.minigmail.model.Email;
import com.example.minigmail.model.MailboxEntry;
import com.example.minigmail.model.User;
import com.example.minigmail.repository.EmailRepository;
import com.example.minigmail.repository.MailboxEntryRepository;
import com.example.minigmail.repository.UserRepository;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MailService {
    private final EmailRepository emailRepository;
    private final MailboxEntryRepository mailboxRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final MongoTemplate mongoTemplate;

    public MailService(EmailRepository emailRepository, MailboxEntryRepository mailboxRepository,
                       UserRepository userRepository, UserService userService, MongoTemplate mongoTemplate) {
        this.emailRepository=emailRepository; this.mailboxRepository=mailboxRepository;
        this.userRepository=userRepository; this.userService=userService; this.mongoTemplate=mongoTemplate;
    }

    public Page<Email> mailbox(User user, String box, int page, String q) {
        Pageable pageable=PageRequest.of(Math.max(0,page-1),10,Sort.by(Sort.Direction.DESC,"createdAt"));
        String uid=user.getId();
        List<MailboxEntry> entries;

        if (q != null && !q.isBlank()) {
            Criteria c = new Criteria().orOperator(
                    Criteria.where("subject").regex(q.trim(),"i"),
                    Criteria.where("body").regex(q.trim(),"i"));
            Set<String> ids=mongoTemplate.find(new Query(c),Email.class).stream()
                    .map(Email::getId).collect(Collectors.toSet());
            entries=mailboxRepository.findAll().stream()
                    .filter(e -> uid.equals(e.getUserId()) && ids.contains(e.getEmailId()) && !"TRASH".equals(e.getFolder()))
                    .sorted(entryComparator()).toList();
        } else {
            switch (box) {
                case "starred" -> entries=mailboxRepository.findAll().stream()
                        .filter(e->uid.equals(e.getUserId()) && e.isStarred() && !"TRASH".equals(e.getFolder()))
                        .sorted(entryComparator()).toList();
                case "important" -> entries=mailboxRepository.findAll().stream()
                        .filter(e->uid.equals(e.getUserId()) && e.isImportant() && !"TRASH".equals(e.getFolder()))
                        .sorted(entryComparator()).toList();
                default -> {
                    String folder=switch(box){case "sent"->"SENT"; case "drafts"->"DRAFT"; case "trash"->"TRASH"; default->"INBOX";};
                    if ("DRAFT".equals(folder)) {
                        List<Email> drafts=emailRepository.findAll().stream()
                                .filter(e->uid.equals(e.getFromUserId()) && e.isDraft())
                                .sorted(Comparator.comparing(Email::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                                .toList();
                        return pageEmails(drafts,page,pageable);
                    }
                    entries=mailboxRepository.findByUserIdAndFolder(uid,folder,
                            PageRequest.of(0,Integer.MAX_VALUE,Sort.by(Sort.Direction.DESC,"createdAt"))).getContent();
                }
            }
        }

        List<Email> all=new ArrayList<>();
        for(MailboxEntry entry:entries){
            emailRepository.findById(entry.getEmailId()).ifPresent(e->{
                e.setRead(entry.isRead()); e.setStarred(entry.isStarred()); e.setImportant(entry.isImportant());
                all.add(e);
            });
        }
        return pageEmails(all,page,pageable);
    }

    private Comparator<MailboxEntry> entryComparator(){
        return Comparator.comparing(MailboxEntry::getCreatedAt,Comparator.nullsLast(Comparator.naturalOrder())).reversed();
    }

    private Page<Email> pageEmails(List<Email> all,int page,Pageable pageable){
        int from=Math.min(Math.max(0,page-1)*10,all.size());
        int to=Math.min(from+10,all.size());
        return new PageImpl<>(all.subList(from,to),pageable,all.size());
    }

    public Map<String,Long> stats(User user){
        String uid=user.getId(); Map<String,Long> m=new HashMap<>();
        m.put("unread",mailboxRepository.countByUserIdAndFolderAndReadFalse(uid,"INBOX"));
        m.put("drafts",emailRepository.countByFromUserIdAndDraftTrue(uid));
        m.put("starred",mailboxRepository.countByUserIdAndStarredTrue(uid));
        return m;
    }

    public Email send(User sender,String to,String cc,String bcc,String subject,String body,
                      MultipartFile[] files,String draftId,Path uploadDir)throws IOException {
        List<User> tos=resolveRecipients(to), ccs=resolveRecipients(cc), bccs=resolveRecipients(bcc);
        Email email;
        if(draftId!=null&&!draftId.isBlank())
            email=emailRepository.findByIdAndFromUserId(draftId,sender.getId()).orElseThrow(()->new IllegalArgumentException("Draft not found"));
        else { email=new Email(); email.setThreadId(UUID.randomUUID().toString()); }

        email.setFromUserId(sender.getId()); email.setToUserIds(ids(tos)); email.setCcUserIds(ids(ccs)); email.setBccUserIds(ids(bccs));
        email.setSubject(subject==null?"":subject); email.setBody(body==null?"":body);
        if(files!=null&&files.length>0) email.setAttachments(saveAttachments(files,uploadDir));
        email.setLabels(new ArrayList<>(List.of("SENT"))); email.setRead(true); email.setDraft(false);
        email.setCreatedAt(email.getCreatedAt()==null?Instant.now():email.getCreatedAt());

        Email saved=emailRepository.save(email);
        if(draftId!=null&&!draftId.isBlank()) mailboxRepository.deleteByEmailId(saved.getId());

        createEntry(saved.getId(),sender.getId(),"SENT",true,saved.getCreatedAt());
        for(User u:concat(tos,ccs,bccs)) createEntry(saved.getId(),u.getId(),"INBOX",false,saved.getCreatedAt());
        return saved;
    }

    private List<User> concat(List<User> a,List<User> b,List<User> c){
        Map<String,User> m=new LinkedHashMap<>();
        for(User u:a)m.put(u.getId(),u); for(User u:b)m.put(u.getId(),u); for(User u:c)m.put(u.getId(),u);
        return new ArrayList<>(m.values());
    }

    private void createEntry(String emailId,String userId,String folder,boolean read,Instant created){
        if(!mailboxRepository.existsByEmailIdAndUserId(emailId,userId))
            mailboxRepository.save(new MailboxEntry(emailId,userId,folder,read,created));
    }

    public Email saveDraft(User sender,String to,String cc,String bcc,String subject,String body,
                           MultipartFile[] files,String draftId,Path uploadDir)throws IOException {
        Email email=(draftId!=null&&!draftId.isBlank())
                ? emailRepository.findByIdAndFromUserId(draftId,sender.getId()).orElseThrow(()->new IllegalArgumentException("Draft not found"))
                : new Email();
        if(email.getThreadId()==null)email.setThreadId(UUID.randomUUID().toString());
        if(email.getCreatedAt()==null)email.setCreatedAt(Instant.now());
        email.setFromUserId(sender.getId()); email.setToUserIds(ids(resolveRecipients(to))); email.setCcUserIds(ids(resolveRecipients(cc))); email.setBccUserIds(ids(resolveRecipients(bcc)));
        email.setSubject(subject==null?"":subject); email.setBody(body==null?"":body);
        if(files!=null&&files.length>0)email.setAttachments(saveAttachments(files,uploadDir));
        email.setLabels(new ArrayList<>(List.of("DRAFT"))); email.setDraft(true);
        return emailRepository.save(email);
    }

    public Email getVisible(String id,User user){
        Email email=emailRepository.findById(id).orElseThrow(()->new IllegalArgumentException("Email not found"));
        if(email.isDraft() && user.getId().equals(email.getFromUserId())) return email;
        MailboxEntry entry=mailboxRepository.findByEmailIdAndUserId(id,user.getId())
                .orElseThrow(()->new IllegalArgumentException("Email not found"));
        email.setRead(entry.isRead()); email.setStarred(entry.isStarred()); email.setImportant(entry.isImportant());
        return email;
    }

    public void markRead(String id,User user,boolean read){MailboxEntry e=entry(id,user);e.setRead(read);mailboxRepository.save(e);}
    public void star(String id,User user,boolean value){MailboxEntry e=entry(id,user);e.setStarred(value);mailboxRepository.save(e);}
    public void important(String id,User user,boolean value){MailboxEntry e=entry(id,user);e.setImportant(value);mailboxRepository.save(e);}
    public void trash(String id,User user){MailboxEntry e=entry(id,user);e.setFolder("TRASH");e.setDeletedAt(Instant.now());mailboxRepository.save(e);}
    public void restore(String id,User user){
        MailboxEntry e=entry(id,user); Email email=emailRepository.findById(id).orElseThrow();
        e.setFolder(user.getId().equals(email.getFromUserId())?"SENT":"INBOX"); e.setDeletedAt(null); mailboxRepository.save(e);
    }
    public void deleteForever(String id,User user){
        MailboxEntry e=entry(id,user);
        if(user.getId().equals(emailRepository.findById(id).orElseThrow().getFromUserId())){
            mailboxRepository.deleteByEmailId(id); emailRepository.deleteById(id);
        } else mailboxRepository.delete(e);
    }

    private MailboxEntry entry(String id,User user){
        return mailboxRepository.findByEmailIdAndUserId(id,user.getId()).orElseThrow(()->new IllegalArgumentException("Email not found"));
    }

    public List<Email> thread(String threadId){return emailRepository.findByThreadIdOrderByCreatedAtAsc(threadId);}
    public List<User> contacts(User current){
        return userRepository.findAll().stream().filter(u->!u.getId().equals(current.getId()))
                .sorted(Comparator.comparing(User::getName,String.CASE_INSENSITIVE_ORDER)).toList();
    }

    public void migrateLegacyMailboxes(){
        for(Email e:emailRepository.findAll()){
            if(e.isDraft()) continue;
            Instant created=e.getCreatedAt()==null?Instant.now():e.getCreatedAt();
            createEntry(e.getId(),e.getFromUserId(),"SENT",true,created);
            List<String> recipients=new ArrayList<>();
            recipients.addAll(e.getToUserIds()); recipients.addAll(e.getCcUserIds()); recipients.addAll(e.getBccUserIds());
            for(String uid:recipients) createEntry(e.getId(),uid,"INBOX",e.isRead(),created);
        }
    }

    private List<User> resolveRecipients(String value){
        if(value==null||value.isBlank())return List.of();
        return Arrays.stream(value.split(",")).map(String::trim).filter(s->!s.isBlank()).map(userService::byEmail).toList();
    }
    private List<String> ids(List<User> users){return users.stream().map(User::getId).toList();}

    private List<Email.Attachment> saveAttachments(MultipartFile[] files,Path uploadDir)throws IOException{
        List<Email.Attachment> result=new ArrayList<>(); if(files==null)return result;
        Files.createDirectories(uploadDir);
        for(MultipartFile file:files){
            if(file==null||file.isEmpty())continue;
            String safe=Optional.ofNullable(file.getOriginalFilename()).orElse("file").replaceAll("[^a-zA-Z0-9._-]","_");
            String filename=System.currentTimeMillis()+"-"+UUID.randomUUID()+"-"+safe;
            Path target=uploadDir.resolve(filename).normalize();
            if(!target.startsWith(uploadDir.normalize()))throw new IOException("Invalid filename");
            file.transferTo(target);
            result.add(new Email.Attachment(safe,filename,"/uploads/"+filename,file.getContentType(),file.getSize()));
        }
        return result;
    }
}
