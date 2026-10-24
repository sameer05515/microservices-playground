package com.interviewgym.progress;
import com.interviewgym.questions.QuestionService;
import com.interviewgym.security.AppUserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;
@RestController @RequestMapping("/api/progress")
public class ProgressController {
 private final AttemptRepository attempts; private final AppUserRepository users; private final QuestionService questions;
 public ProgressController(AttemptRepository attempts,AppUserRepository users,QuestionService questions){this.attempts=attempts;this.users=users;this.questions=questions;}
 public record RecordRequest(@NotBlank String questionId,@NotBlank String rating) {}
 @PostMapping public ResponseEntity<?> record(@Valid @RequestBody RecordRequest r,Authentication auth){
   if(!Set.of("GOT_IT","NEEDS_REVIEW").contains(r.rating()))return ResponseEntity.badRequest().body(Map.of("message","Rating must be GOT_IT or NEEDS_REVIEW."));
   if(questions.get(r.questionId()).isEmpty())return ResponseEntity.badRequest().body(Map.of("message","Unknown questionId."));
   var u=users.findByEmail(auth.getName()).orElseThrow(); var saved=attempts.save(new Attempt(u,r.questionId(),r.rating()));
   return ResponseEntity.status(201).body(Map.of("id",saved.getId(),"questionId",saved.getQuestionId(),"rating",saved.getRating(),"attemptedAt",saved.getAttemptedAt().toString()));
 }
 @GetMapping public Map<String,Object> summary(Authentication auth){
   var u=users.findByEmail(auth.getName()).orElseThrow(); var list=attempts.findByUserIdOrderByAttemptedAtDesc(u.getId());
   long got=list.stream().filter(a->a.getRating().equals("GOT_IT")).count();
   Map<String,Long> byCategory=new TreeMap<>();
   for(var a:list){questions.get(a.getQuestionId()).ifPresent(q->byCategory.merge(q.category(),1L,Long::sum));}
   List<Map<String,Object>> recent=list.stream().limit(10).map(a->{
     var m=new LinkedHashMap<String,Object>();m.put("id",a.getId());m.put("questionId",a.getQuestionId());m.put("rating",a.getRating());m.put("attemptedAt",a.getAttemptedAt().toString());
     questions.get(a.getQuestionId()).ifPresent(q->{m.put("question",q.question());m.put("category",q.category());});return m;
   }).collect(Collectors.toList());
   Map<String,Object> result=new LinkedHashMap<>();result.put("totalAttempts",list.size());result.put("gotIt",got);result.put("needsReview",list.size()-got);
   result.put("accuracy",list.isEmpty()?0:Math.round(got*1000.0/list.size())/10.0);result.put("byCategory",byCategory);result.put("recentAttempts",recent);return result;
 }
}
