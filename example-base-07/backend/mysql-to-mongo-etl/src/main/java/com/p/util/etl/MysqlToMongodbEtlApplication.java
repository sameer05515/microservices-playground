package com.p.util.etl;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@SpringBootApplication
public class MysqlToMongodbEtlApplication {

    public static void main(String[] args) {
        SpringApplication.run(MysqlToMongodbEtlApplication.class, args);
    }

}

//@Configuration
//class AppConfig {
//
//	@Bean
//	public CommandLineRunner schemaTransformationRunner(SchemaTransformationRunner runner) {
//		return args -> {
//			// Manually trigger the execution of SchemaTransformationRunner
//			runner.run(args);
//		};
//	}
//}

@Component
class SchemaTransformationRunner implements CommandLineRunner {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private CategoryRepository categoryRepository; // Assume CategoryRepository extends MongoRepository<Category, String>

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        loadCategoryData();
        addQuestions();
        addAnswers();
        renameFieldsAndAddUniqueId();
        System.out.println("Transformation completed successfully!");
    }

    private void loadCategoryData() {
        System.out.println("loadCategoryData ======================>>>");
        List<Category> categories = jdbcTemplate.query("SELECT * FROM t_category", (rs, rowNum) -> {
            return Category.builder()
                    .uniqueId(UUID.randomUUID().toString())
                    .categoryId(rs.getInt("cat_id"))
                    .categoryName(rs.getString("cat_name"))
                    .rating(rs.getInt("rating"))
                    .questions(new ArrayList<>()) // Initialize questions list
                    .build();
        });
        List<Integer> catIds = categories != null ?
                categories.stream().map(
                                cat -> cat.getCategoryId()
                        )
                        .collect(Collectors.toList())
                : Collections.emptyList();

        System.out.println(catIds);

        categoryRepository.saveAll(categories);
    }

    private void addQuestions() {
        System.out.println("addQuestions ======================>>>");
        List<Category.Question> questions = jdbcTemplate.query("SELECT * FROM t_catg_ques", (rs, rowNum) -> {
            return Category.Question.builder()
                    .uniqueId(UUID.randomUUID().toString())
                    .quesId(rs.getInt("ques_id"))
                    .linkedCatId(rs.getInt("linked_cat_id"))
                    .ques(rs.getString("ques"))
                    .rating(rs.getInt("rating"))
                    .hidden(rs.getBoolean("hidden"))
                    .answers(new ArrayList<>()) // Initialize answers list
                    .build();
        });
        List<Category> categories = categoryRepository.findAll();
        for (Category category : categories) {
            int catId= category.getCategoryId();
            System.out.println("\n==============\nStart adding questions in category "+category.getCategoryId());
            List<Category.Question> qList= new ArrayList<>();
            for (Category.Question question : questions) {
                if (question.getLinkedCatId().equals(catId)) {
                    qList.add(question);
                }
            }
//            System.out.println(qList+"\n===================================");
            category.setQuestions(qList);
            categoryRepository.save(category);
        }
//        System.out.println(questions);
//        categoryRepository.saveAll(categories);
    }

    private void addAnswers() {
        System.out.println("addAnswers ======================>>>");
        List<Category.Question.Answer> answers = jdbcTemplate.query("SELECT * FROM t_catg_ques_ans", (rs, rowNum) -> {
            return Category.Question.Answer.builder()
                    .uniqueId(UUID.randomUUID().toString())
                    .ansId(rs.getInt("ans_id"))
                    .linkedQuesId(rs.getInt("linked_ques_id"))
                    .linkedCatId(rs.getInt("linked_cat_id"))
                    .answer(rs.getString("answer"))
                    .rating(rs.getInt("rating"))
                    .build();
        });
        List<Category> categories = categoryRepository.findAll();
        for (Category category : categories) {
            for (Category.Question question : category.getQuestions()) {
                for (Category.Question.Answer answer : answers) {
                    if (answer.getLinkedQuesId().equals(question.getQuesId()) && answer.getLinkedCatId().equals(question.getLinkedCatId())) {
                        question.getAnswers().add(answer);
                    }
                }
            }
        }
        categoryRepository.saveAll(categories);
    }

    private void renameFieldsAndAddUniqueId() {
        System.out.println("renameFieldsAndAddUniqueId ======================>>>");
        List<Category> categories = categoryRepository.findAll();
        categories.forEach(category -> {
            category.setUniqueId(UUID.randomUUID().toString());
            category.setCategoryId(category.getCategoryId());
            category.setCategoryName(category.getCategoryName());
            category.getQuestions().forEach(question -> {
                question.setUniqueId(UUID.randomUUID().toString());
                question.setQuesId(question.getQuesId());
                question.setLinkedCatId(question.getLinkedCatId());
                question.setQues(question.getQues());
                question.setRating(question.getRating());
                question.setHidden(question.getHidden());
                question.getAnswers().forEach(answer -> {
                    answer.setUniqueId(UUID.randomUUID().toString());
                    answer.setAnsId(answer.getAnsId());
                    answer.setAnswer(answer.getAnswer());
                    answer.setRating(answer.getRating());
                });
            });
        });
        categoryRepository.saveAll(categories);
    }
}

@Document("Categories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class Category {
    @Id
    private String id;

    @Field("uniqueId")
    private String uniqueId;

    @Field("categoryId")
    private Integer categoryId;

    @Field("categoryName")
    private String categoryName;

//    @Field("catId")
//    private Integer catId;

//    @Field("catName")
//    private String catName;

    @Field("rating")
    private Integer rating;

    @Field("questions")
    private List<Question> questions = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Question {
        @Id
        private String id;

        @Field("uniqueId")
        private String uniqueId;

        @Field("quesId")
        private Integer quesId;

        @Field("linkedCatId")
        private Integer linkedCatId;

        @Field("ques")
        private String ques;

        @Field("rating")
        private Integer rating;

        @Field("hidden")
        private Boolean hidden;

        @Field("answers")
        private List<Answer> answers = new ArrayList<>();

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class Answer {
            @Id
            private String id;

            @Field("uniqueId")
            private String uniqueId;

            @Field("ansId")
            private Integer ansId;

            @Field("linkedQuesId")
            private Integer linkedQuesId;

            @Field("linkedCatId")
            private Integer linkedCatId;

            @Field("answer")
            private String answer;

            @Field("rating")
            private Integer rating;
        }
    }
}

//@Document


//@Document


interface CategoryRepository extends MongoRepository<Category, String> {
    List<Category> findByCategoryId(Integer catId);
}
