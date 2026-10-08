package com.example.minigmail.service;

import com.example.minigmail.model.Email;
import com.example.minigmail.model.User;
import com.example.minigmail.repository.EmailRepository;
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

@Service
public class MailService {
    private final EmailRepository emailRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final MongoTemplate mongoTemplate;

    public MailService(EmailRepository emailRepository, UserRepository userRepository,
                       UserService userService, MongoTemplate mongoTemplate) {
        this.emailRepository = emailRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.mongoTemplate = mongoTemplate;
    }

    public Page<Email> mailbox(User user, String box, int page, String q) {
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), 10, Sort.by(Sort.Direction.DESC, "createdAt"));
        String uid = user.getId();

        if (q != null && !q.isBlank()) {
            return emailRepository.searchVisible(uid, q.trim(), pageable);
        }

        return switch (box) {
            case "sent" -> emailRepository.findByFromUserIdAndLabelsContainingAndDraftFalse(uid, "SENT", pageable);
            case "drafts" -> emailRepository.findByFromUserIdAndDraftTrue(pageable);
            case "trash" -> emailRepository.findVisibleByLabel(uid, "TRASH", pageable);
            case "starred" -> starred(uid, pageable);
            case "important" -> emailRepository.findVisibleByLabel(uid, "IMPORTANT", pageable);
            default -> emailRepository.findByToUserIdsContainingAndLabelsContainingAndDraftFalse(uid, "INBOX", pageable);
        };
    }

    private Page<Email> starred(String uid, Pageable pageable) {
        Query query = new Query(new Criteria().orOperator(
                Criteria.where("fromUserId").is(uid),
                Criteria.where("toUserIds").is(uid)
        ).and("starred").is(true).and("draft").is(false).and("labels").ne("TRASH"));
        long total = mongoTemplate.count(query, Email.class);
        query.with(pageable);
        List<Email> list = mongoTemplate.find(query, Email.class);
        return new PageImpl<>(list, pageable, total);
    }

    public Map<String, Long> stats(User user) {
        String uid = user.getId();
        Map<String, Long> m = new HashMap<>();
        m.put("unread", emailRepository.countByToUserIdsContainingAndLabelsContainingAndDraftFalseAndReadFalse(uid, "INBOX"));
        m.put("drafts", emailRepository.countByFromUserIdAndDraftTrue(uid));
        m.put("starred",
                emailRepository.countByFromUserIdAndStarredTrueAndDraftFalse(uid)
                        + emailRepository.countByToUserIdsContainingAndStarredTrueAndDraftFalse(uid));
        return m;
    }

    public Email send(User sender, String to, String cc, String bcc, String subject, String body,
                      MultipartFile[] files, String draftId, Path uploadDir) throws IOException {
        List<User> tos = resolveRecipients(to);
        List<User> ccs = resolveRecipients(cc);
        List<User> bccs = resolveRecipients(bcc);

        Email email;
        if (draftId != null && !draftId.isBlank()) {
            email = emailRepository.findByIdAndFromUserId(draftId, sender.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Draft not found"));
        } else {
            email = new Email();
            email.setThreadId(UUID.randomUUID().toString());
        }

        email.setFromUserId(sender.getId());
        email.setToUserIds(ids(tos));
        email.setCcUserIds(ids(ccs));
        email.setBccUserIds(ids(bccs));
        email.setSubject(subject == null ? "" : subject);
        email.setBody(body == null ? "" : body);
        email.setAttachments(saveAttachments(files, uploadDir));
        email.setLabels(new ArrayList<>(List.of("SENT", "INBOX")));
        email.setRead(true);
        email.setDraft(false);
        email.setCreatedAt(email.getCreatedAt() == null ? Instant.now() : email.getCreatedAt());

        return emailRepository.save(email);
    }

    public Email saveDraft(User sender, String to, String cc, String bcc, String subject, String body,
                           MultipartFile[] files, String draftId, Path uploadDir) throws IOException {
        Email email = (draftId != null && !draftId.isBlank())
                ? emailRepository.findByIdAndFromUserId(draftId, sender.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Draft not found"))
                : new Email();

        if (email.getThreadId() == null) email.setThreadId(UUID.randomUUID().toString());
        if (email.getCreatedAt() == null) email.setCreatedAt(Instant.now());
        email.setFromUserId(sender.getId());
        email.setToUserIds(ids(resolveRecipients(to)));
        email.setCcUserIds(ids(resolveRecipients(cc)));
        email.setBccUserIds(ids(resolveRecipients(bcc)));
        email.setSubject(subject == null ? "" : subject);
        email.setBody(body == null ? "" : body);
        if (files != null && files.length > 0) email.setAttachments(saveAttachments(files, uploadDir));
        email.setLabels(new ArrayList<>(List.of("DRAFT")));
        email.setDraft(true);
        return emailRepository.save(email);
    }

    public Email getVisible(String id, User user) {
        return emailRepository.findVisibleById(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Email not found"));
    }

    public void markRead(String id, User user, boolean read) {
        Email e = getVisible(id, user);
        if (e.getToUserIds().contains(user.getId()) || e.getCcUserIds().contains(user.getId())) {
            e.setRead(read);
            emailRepository.save(e);
        }
    }

    public void star(String id, User user, boolean value) {
        Email e = getVisible(id, user);
        e.setStarred(value);
        emailRepository.save(e);
    }

    public void important(String id, User user, boolean value) {
        Email e = getVisible(id, user);
        e.setImportant(value);
        if (value && !e.getLabels().contains("IMPORTANT")) e.getLabels().add("IMPORTANT");
        if (!value) e.getLabels().remove("IMPORTANT");
        emailRepository.save(e);
    }

    public void trash(String id, User user) {
        Email e = getVisible(id, user);
        if (!e.getLabels().contains("TRASH")) e.getLabels().add("TRASH");
        e.setDeletedAt(Instant.now());
        emailRepository.save(e);
    }

    public void restore(String id, User user) {
        Email e = getVisible(id, user);
        e.getLabels().remove("TRASH");
        e.setDeletedAt(null);
        emailRepository.save(e);
    }

    public void deleteForever(String id, User user) {
        Email e = emailRepository.findByIdAndFromUserId(id, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Email not found"));
        emailRepository.delete(e);
    }

    public List<Email> thread(String threadId) {
        return emailRepository.findByThreadIdOrderByCreatedAtAsc(threadId);
    }

    public List<User> contacts(User current) {
        return userRepository.findAll().stream()
                .filter(u -> !u.getId().equals(current.getId()))
                .sorted(Comparator.comparing(User::getName, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }

    private List<User> resolveRecipients(String value) {
        if (value == null || value.isBlank()) return List.of();
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(userService::byEmail)
                .toList();
    }


    private List<String> ids(List<User> users) {
        return users.stream().map(User::getId).toList();
    }

    private List<Email.Attachment> saveAttachments(MultipartFile[] files, Path uploadDir) throws IOException {
        List<Email.Attachment> result = new ArrayList<>();
        if (files == null) return result;
        Files.createDirectories(uploadDir);

        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) continue;
            String safe = Optional.ofNullable(file.getOriginalFilename()).orElse("file")
                    .replaceAll("[^a-zA-Z0-9._-]", "_");
            String filename = System.currentTimeMillis() + "-" + UUID.randomUUID() + "-" + safe;
            Path target = uploadDir.resolve(filename).normalize();
            if (!target.startsWith(uploadDir.normalize())) throw new IOException("Invalid filename");
            file.transferTo(target);
            result.add(new Email.Attachment(
                    safe, filename, "/uploads/" + filename,
                    file.getContentType(), file.getSize()
            ));
        }
        return result;
    }
}
