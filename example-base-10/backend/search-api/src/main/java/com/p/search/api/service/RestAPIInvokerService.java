package com.p.search.api.service;

import com.p.search.api.pojo.AnswerV2;
import com.p.search.api.pojo.CategoryV1;
import com.p.search.api.pojo.CategoryV2;
import com.p.search.api.pojo.QuestionV2;
import com.p.search.api.pojo.V1ToV2Mapper;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class RestAPIInvokerService {

    private final RestTemplate restTemplate;
    private final V1ToV2Mapper v1ToV2Mapper;

    public RestAPIInvokerService(RestTemplate restTemplate, V1ToV2Mapper v1ToV2Mapper) {
        this.restTemplate = restTemplate;
        this.v1ToV2Mapper = v1ToV2Mapper;
    }

    public String getExample() {
        String url = "https://jsonplaceholder.typicode.com/posts/1";
        return restTemplate.getForObject(url, String.class);
    }

    public String getAllTags() {
        String url = "http://127.0.0.1:3003/tags";
        return restTemplate.getForObject(url, String.class);
    }

     /**
      *      1. Get all category ids
      *      2. fetch category data for a given category id (oldCatUID)
      *      3. transform category data in v2 format
      *      4. save the category data in v2 format
      *      5. get the category unique id (newCatUID) for saved one
      *      6. fetch all questions id for an oldCatUID
      *      7. transform questions and its answers in new format and save in v2
      *      8. collect errors, during
      *      */
    public List<CategoryV2> getAllCategory() {
        // 1. Get all category ids
        String url = "http://127.0.0.1:3003/categories";

        ResponseEntity<List<CategoryV1>> catV1ListResponse =
                restTemplate.exchange(url,
                        HttpMethod.GET, null, new ParameterizedTypeReference<>() {
                        });
        List<CategoryV1> categories = catV1ListResponse.getBody();

        // 2. fetch category data for a given category id (oldCatUID)
        List<CategoryV2> categoryV2s= new ArrayList<>();
        for (CategoryV1 cat : categories) {
            String oldCatUID= cat.getUniqueId();
            CategoryV1 categoryV1 = fetchCategory(oldCatUID);

            // 3. transform category data in v2 format
            CategoryV2 categoryV2 = v1ToV2Mapper.convertToCategory(categoryV1);
            //System.out.println(categoryV2);
            // 4. save the category data in v2 format
            categoryV2= createCategoryV2(categoryV2);
            // 5. get the category unique id (newCatUID) for saved one
            String newCatUID= categoryV2.getUniqueId();
            // 6. fetch all questions id for an oldCatUID
            for(CategoryV1.QuestionV1 questionV1: categoryV1.getQuestions()){
                CategoryV1.QuestionV1 qV1= fetchQuestion(oldCatUID, questionV1.getUniqueId());
                QuestionV2 questionV2= v1ToV2Mapper.convertToQuestion(qV1, newCatUID);
                questionV2= createQuestionV2(questionV2);
                String newQuesUID= questionV2.getUniqueId();

                for(CategoryV1.QuestionV1.AnswerV1 answerV1: qV1.getAnswers()){
                    AnswerV2 answerV2= v1ToV2Mapper.convertToAnswer(answerV1, newQuesUID);
                    answerV2= createAnswerV2(answerV2);
                }
            }
            categoryV2s.add(categoryV2);

        }
        return categoryV2s;
    }

    private CategoryV1 fetchCategory(String uniqueId) {
        String url = "http://127.0.0.1:3003/categories/" + uniqueId;
        ResponseEntity<CategoryV1> catV1ListResponse =
                restTemplate.exchange(url,
                        HttpMethod.GET, null, new ParameterizedTypeReference<>() {
                        });
        return catV1ListResponse.getBody();
    }

    private CategoryV1.QuestionV1 fetchQuestion(String oldCatUID, String uniqueId){

            String url = "http://127.0.0.1:3003/categories/" + oldCatUID+"/questions/"+uniqueId;
            ResponseEntity<CategoryV1.QuestionV1> catV1ListResponse =
                    restTemplate.exchange(url,
                            HttpMethod.GET, null, new ParameterizedTypeReference<>() {
                            });
            return catV1ListResponse.getBody();

    }

    private CategoryV2 createCategoryV2(CategoryV2 categoryV2) {
        String url = "http://127.0.0.1:3003/intvw-mgmt/categories";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        HttpEntity<CategoryV2> requestEntity = new HttpEntity<>(categoryV2, headers);
        ResponseEntity<CategoryV2> response
                = restTemplate.exchange(url, HttpMethod.POST, requestEntity, CategoryV2.class);
        return response.getBody();
    }

    private QuestionV2 createQuestionV2(QuestionV2 questionV2) {
        String url = "http://127.0.0.1:3003/intvw-mgmt/questions";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        HttpEntity<QuestionV2> requestEntity = new HttpEntity<>(questionV2, headers);
        ResponseEntity<QuestionV2> response
                = restTemplate.exchange(url, HttpMethod.POST, requestEntity, QuestionV2.class);
        return response.getBody();
    }

    private AnswerV2 createAnswerV2(AnswerV2 answerV2) {
        String url = "http://127.0.0.1:3003/intvw-mgmt/answers";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        HttpEntity<AnswerV2> requestEntity = new HttpEntity<>(answerV2, headers);
        ResponseEntity<AnswerV2> response
                = restTemplate.exchange(url, HttpMethod.POST, requestEntity, AnswerV2.class);
        return response.getBody();
    }
}
