package com.interviewgym.questions;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;
@Service
public class QuestionService {
 private final ObjectMapper mapper; private final Path file;
 private List<Question> questions;
 public QuestionService(ObjectMapper mapper,@Value("${app.questions-file:}") String configured) throws IOException {
   this.mapper=mapper;
   file=(configured!=null && !configured.isBlank()) ? Path.of(configured).toAbsolutePath() : Path.of("data","questions.json").toAbsolutePath();
   load();
 }
 private synchronized void load() throws IOException {
   if(Files.exists(file)) {
     try(InputStream in=Files.newInputStream(file)){questions=mapper.readValue(in,new TypeReference<List<Question>>(){});}
   } else {
     try(InputStream in=new ClassPathResource("questions/questions.json").getInputStream()){
       questions=mapper.readValue(in,new TypeReference<List<Question>>(){});
     }
     persist();
   }
 }
 public synchronized List<Question> list(String category,String search) {
   String c=category==null?"":category.trim().toLowerCase(), s=search==null?"":search.trim().toLowerCase();
   return questions.stream().filter(q->c.isEmpty()||q.category().toLowerCase().equals(c))
    .filter(q->s.isEmpty()||(q.question()+" "+q.answer()+" "+q.topic()+" "+String.join(" ",q.tags())).toLowerCase().contains(s))
    .collect(Collectors.toList());
 }
 public synchronized Optional<Question> get(String id){return questions.stream().filter(q->q.id().equals(id)).findFirst();}
 public synchronized Question save(Question input) {
   validate(input);
   String id=(input.id()==null||input.id().isBlank())?"q-"+UUID.randomUUID():input.id();
   Question q=new Question(id,input.category().trim(),input.topic().trim(),input.difficulty()==null?"INTERMEDIATE":input.difficulty(),input.question().trim(),input.answer().trim(),input.tags()==null?List.of():input.tags());
   questions.removeIf(x->x.id().equals(id)); questions.add(0,q); persistUnchecked(); return q;
 }
 public synchronized boolean delete(String id){boolean changed=questions.removeIf(q->q.id().equals(id));if(changed)persistUnchecked();return changed;}
 public synchronized List<Question> replace(List<Question> incoming) {
   if(incoming==null||incoming.isEmpty()) throw new IllegalArgumentException("Question list cannot be empty.");
   Set<String> ids=new HashSet<>(); for(Question q:incoming){validate(q);if(q.id()==null||q.id().isBlank()||!ids.add(q.id()))throw new IllegalArgumentException("Each imported question needs a unique id.");}
   List<Question> old=questions;
   questions=new ArrayList<>(incoming);
   try {
     persist();
   } catch (IOException e) {
     questions=old;
     throw new UncheckedIOException("Failed to persist question bank", e);
   } catch (RuntimeException e) {
     questions=old;
     throw e;
   }
   return List.copyOf(questions);
 }
 public synchronized List<Question> all(){return List.copyOf(questions);}
 private void validate(Question q){
   if(q==null||q.category()==null||q.category().isBlank()||q.topic()==null||q.topic().isBlank()||q.question()==null||q.question().isBlank()||q.answer()==null||q.answer().isBlank())
     throw new IllegalArgumentException("Category, topic, question, and answer are required.");
 }
 private void persistUnchecked(){try{persist();}catch(IOException e){throw new UncheckedIOException(e);}}
 private void persist() throws IOException {
   Path parent=file.getParent(); if(parent!=null)Files.createDirectories(parent);
   Path temp=Files.createTempFile(parent==null?Path.of("."):parent,"questions-",".tmp");
   try { mapper.writerWithDefaultPrettyPrinter().writeValue(temp.toFile(),questions);
     try{Files.move(temp,file,StandardCopyOption.REPLACE_EXISTING,StandardCopyOption.ATOMIC_MOVE);}
     catch(AtomicMoveNotSupportedException e){Files.move(temp,file,StandardCopyOption.REPLACE_EXISTING);}
   } finally {Files.deleteIfExists(temp);}
 }
}
