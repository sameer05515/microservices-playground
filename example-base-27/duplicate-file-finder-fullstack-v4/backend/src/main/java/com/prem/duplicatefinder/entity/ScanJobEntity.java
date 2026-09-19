package com.prem.duplicatefinder.entity;
import jakarta.persistence.*; import java.time.Instant; import java.util.UUID;
@Entity @Table(name="scan_jobs") public class ScanJobEntity {
 @Id String id; @Column(nullable=false,length=2000) String rootPath;
 @Column(nullable=false,length=1000) String ignoredFoldersCsv="";
 @Enumerated(EnumType.STRING) @Column(nullable=false) ScanJobStatus status=ScanJobStatus.QUEUED;
 int percent; long filesDiscovered,filesProcessed,ignoredDirectoryCount,skippedFileCount,duplicateGroups,duplicateFiles,wastedBytes;
 @Column(length=2000) String message; @Column(nullable=false,updatable=false) Instant createdAt; Instant startedAt,finishedAt;
 public ScanJobEntity(){} public ScanJobEntity(String root,String ignored){id=UUID.randomUUID().toString();rootPath=root;ignoredFoldersCsv=ignored;createdAt=Instant.now();message="Scan queued";}
 public String getId(){return id;} public String getRootPath(){return rootPath;} public String getIgnoredFoldersCsv(){return ignoredFoldersCsv;}
 public ScanJobStatus getStatus(){return status;} public int getPercent(){return percent;} public long getFilesDiscovered(){return filesDiscovered;}
 public long getFilesProcessed(){return filesProcessed;} public long getIgnoredDirectoryCount(){return ignoredDirectoryCount;} public long getSkippedFileCount(){return skippedFileCount;}
 public long getDuplicateGroups(){return duplicateGroups;} public long getDuplicateFiles(){return duplicateFiles;} public long getWastedBytes(){return wastedBytes;}
 public String getMessage(){return message;} public Instant getCreatedAt(){return createdAt;} public Instant getStartedAt(){return startedAt;} public Instant getFinishedAt(){return finishedAt;}
 public void setStatus(ScanJobStatus x){status=x;} public void setPercent(int x){percent=x;} public void setFilesDiscovered(long x){filesDiscovered=x;}
 public void setFilesProcessed(long x){filesProcessed=x;} public void setIgnoredDirectoryCount(long x){ignoredDirectoryCount=x;} public void setSkippedFileCount(long x){skippedFileCount=x;}
 public void setDuplicateGroups(long x){duplicateGroups=x;} public void setDuplicateFiles(long x){duplicateFiles=x;} public void setWastedBytes(long x){wastedBytes=x;}
 public void setMessage(String x){message=x;} public void setStartedAt(Instant x){startedAt=x;} public void setFinishedAt(Instant x){finishedAt=x;}
}
