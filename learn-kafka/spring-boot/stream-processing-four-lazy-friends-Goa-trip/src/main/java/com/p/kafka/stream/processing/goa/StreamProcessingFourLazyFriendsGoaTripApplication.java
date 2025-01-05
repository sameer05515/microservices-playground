package com.p.kafka.stream.processing.goa;

import com.p.kafka.stream.processing.goa.common.PlanIdeaProducer;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StreamProcessingFourLazyFriendsGoaTripApplication implements CommandLineRunner {

//	private final PlanIdeaProducer planIdeaProducer;
//
//	public StreamProcessingFourLazyFriendsGoaTripApplication(PlanIdeaProducer planIdeaProducer) {
//		this.planIdeaProducer = planIdeaProducer;
//	}


	public static void main(String[] args) {
		SpringApplication.run(StreamProcessingFourLazyFriendsGoaTripApplication.class, args);
	}

	@Override
	public void run(String... args) {
//		planIdeaProducer.sendIdea("Let's go to Goa!");
	}

}
