package com.prem.duplicatefinder.service;
import com.prem.duplicatefinder.entity.*; import com.prem.duplicatefinder.model.*; import com.prem.duplicatefinder.repository.ScanJobRepository;
import org.springframework.scheduling.annotation.Async; import org.springframework.stereotype.Service;
import java.io.*; import java.nio.file.*; import java.nio.file.attribute.BasicFileAttributes; import java.security.*; import java.time.Instant; import java.util.*; import java.util.concurrent.*;

@Service public class DuplicateScanService{
 private final ScanJobRepository repo; private final ScanResultStore store; private final Map<String,Thread> running=new ConcurrentHashMap<>();
 public DuplicateScanService(ScanJobRepository r,ScanResultStore s){repo=r;store=s;}
 public String start(String root,List<String> ignored){
  Path p=Paths.get(root).toAbsolutePath().normalize(); if(!Files.isDirectory(p))throw new IllegalArgumentException("Not a directory: "+p);
  ScanJobEntity j=new ScanJobEntity(p.toString(),String.join(",",ignored==null?List.of():ignored));repo.save(j);run(j.getId());return j.getId();
 }
 public ScanJobEntity getJob(String id){return repo.findById(id).orElseThrow(()->new IllegalArgumentException("Unknown job: "+id));}
 @Async("scanExecutor") public void run(String id){
  running.put(id,Thread.currentThread()); ScanJobEntity j=getJob(id);
  try{
   j.setStatus(ScanJobStatus.DISCOVERING);j.setStartedAt(Instant.now());j.setMessage("Discovering files");repo.save(j);
   Path root=Paths.get(j.getRootPath());Set<String> ignored=parse(j.getIgnoredFoldersCsv());List<Path> all=new ArrayList<>();
   Files.walkFileTree(root,new SimpleFileVisitor<>(){
    public FileVisitResult preVisitDirectory(Path d,BasicFileAttributes a){if(stop(id))return FileVisitResult.TERMINATE;
     if(!d.equals(root)&&ignored.contains(d.getFileName().toString().toLowerCase())){j.setIgnoredDirectoryCount(j.getIgnoredDirectoryCount()+1);return FileVisitResult.SKIP_SUBTREE;}return FileVisitResult.CONTINUE;}
    public FileVisitResult visitFile(Path f,BasicFileAttributes a){if(stop(id))return FileVisitResult.TERMINATE;if(a.isRegularFile()){all.add(f);j.setFilesDiscovered(all.size());}return FileVisitResult.CONTINUE;}
    public FileVisitResult visitFileFailed(Path f,IOException e){j.setSkippedFileCount(j.getSkippedFileCount()+1);return FileVisitResult.CONTINUE;}
   });
   if(stop(id)){cancel(j);return;} j.setStatus(ScanJobStatus.HASHING);j.setMessage("Hashing candidate files");repo.save(j);
   Map<Long,List<Path>> by=new HashMap<>();for(Path p:all)try{by.computeIfAbsent(Files.size(p),x->new ArrayList<>()).add(p);}catch(Exception e){j.setSkippedFileCount(j.getSkippedFileCount()+1);}
   List<Path> candidates=new ArrayList<>();by.values().stream().filter(x->x.size()>1).forEach(candidates::addAll);Map<String,List<Path>> groups=new HashMap<>();
   for(Path p:candidates){if(stop(id)){cancel(j);return;}try{long z=Files.size(p);String k=z+":"+sha(p);groups.computeIfAbsent(k,x->new ArrayList<>()).add(p);}catch(Exception e){j.setSkippedFileCount(j.getSkippedFileCount()+1);}
    j.setFilesProcessed(j.getFilesProcessed()+1);j.setPercent(candidates.isEmpty()?100:Math.min(99,(int)(j.getFilesProcessed()*100.0/candidates.size())));if(j.getFilesProcessed()%25==0)repo.save(j);}
   List<DuplicateGroup> out=new ArrayList<>();int n=1;
   for(var e:groups.entrySet())if(e.getValue().size()>1){long z=Files.size(e.getValue().get(0));List<DuplicateFile> fs=new ArrayList<>();
    for(Path p:e.getValue()){BasicFileAttributes a=Files.readAttributes(p,BasicFileAttributes.class);fs.add(new DuplicateFile(p.toString(),p.getFileName().toString(),a.size(),Instant.ofEpochMilli(a.lastModifiedTime().toMillis()).toString()));}
    out.add(new DuplicateGroup(n++,z,e.getKey().substring(e.getKey().indexOf(':')+1),z*(e.getValue().size()-1L),fs));}
   out.sort(Comparator.comparingLong(DuplicateGroup::wastedBytes).reversed());store.put(id,out);
   j.setDuplicateGroups(out.size());j.setDuplicateFiles(out.stream().mapToLong(x->x.files().size()).sum());j.setWastedBytes(out.stream().mapToLong(DuplicateGroup::wastedBytes).sum());
   j.setPercent(100);j.setStatus(ScanJobStatus.COMPLETED);j.setMessage("Scan completed");j.setFinishedAt(Instant.now());repo.save(j);
  }catch(Exception e){if(stop(id))cancel(j);else{j.setStatus(ScanJobStatus.FAILED);j.setMessage(e.getMessage()==null?"Scan failed":e.getMessage());j.setFinishedAt(Instant.now());repo.save(j);}}finally{running.remove(id);}
 }
 public void cancel(String id){ScanJobEntity j=getJob(id);if(j.getStatus()==ScanJobStatus.COMPLETED||j.getStatus()==ScanJobStatus.CANCELLED||j.getStatus()==ScanJobStatus.FAILED)return;j.setStatus(ScanJobStatus.CANCEL_REQUESTED);j.setMessage("Cancellation requested");repo.save(j);Thread t=running.get(id);if(t!=null)t.interrupt();}
 private boolean stop(String id){return Thread.currentThread().isInterrupted()||repo.findById(id).map(x->x.getStatus()==ScanJobStatus.CANCEL_REQUESTED).orElse(true);}
 private void cancel(ScanJobEntity j){j.setStatus(ScanJobStatus.CANCELLED);j.setMessage("Scan cancelled");j.setFinishedAt(Instant.now());repo.save(j);}
 public DuplicatePage page(String id,int page,int size,String sort,String dir){
  if(size<1||size>100)throw new IllegalArgumentException("size must be 1..100");List<DuplicateGroup> g=store.get(id);
  Comparator<DuplicateGroup> c=switch(sort){case "fileSize"->Comparator.comparingLong(DuplicateGroup::fileSize);case "groupNumber"->Comparator.comparingInt(DuplicateGroup::groupNumber);default->Comparator.comparingLong(DuplicateGroup::wastedBytes);};
  if("desc".equalsIgnoreCase(dir))c=c.reversed();List<DuplicateGroup>s=g.stream().sorted(c).toList();int total=s.size(),pages=total==0?0:(int)Math.ceil(total/(double)size),p=Math.max(0,Math.min(page,Math.max(0,pages-1))),from=p*size,to=Math.min(from+size,total);
  return new DuplicatePage(s.subList(from,to),p,size,total,pages,sort,dir);
 }
 private Set<String> parse(String x){if(x==null||x.isBlank())return Set.of();Set<String>s=new HashSet<>();for(String v:x.split(","))if(!v.isBlank())s.add(v.trim().toLowerCase());return s;}
 private String sha(Path p)throws Exception{MessageDigest m=MessageDigest.getInstance("SHA-256");try(InputStream in=Files.newInputStream(p)){byte[]b=new byte[8192];int r;while((r=in.read(b))!=-1)m.update(b,0,r);}StringBuilder s=new StringBuilder();for(byte b:m.digest())s.append(String.format("%02x",b));return s.toString();}
}
