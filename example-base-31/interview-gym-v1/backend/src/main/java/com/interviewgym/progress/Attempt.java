package com.interviewgym.progress;
import com.interviewgym.security.AppUser;
import jakarta.persistence.*;
import java.time.Instant;
@Entity @Table(name="practice_attempts")
public class Attempt {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false,fetch=FetchType.LAZY) private AppUser user;
 @Column(nullable=false,length=120) private String questionId;
 @Column(nullable=false,length=30) private String rating;
 @Column(nullable=false) private Instant attemptedAt=Instant.now();
 protected Attempt(){}
 public Attempt(AppUser user,String questionId,String rating){this.user=user;this.questionId=questionId;this.rating=rating;}
 public Long getId(){return id;} public String getQuestionId(){return questionId;} public String getRating(){return rating;} public Instant getAttemptedAt(){return attemptedAt;}
}
