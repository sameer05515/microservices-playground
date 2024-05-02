package com.example;

import com.opensymphony.xwork2.ActionSupport;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

import java.io.BufferedReader;
import java.io.InputStreamReader;

public class UserAction extends ActionSupport {

    private String username;
    private int age;

    public String execute() {
        // Make GraphQL query
        String query = "{ user(id: \"1\") { username, age } }";

        // Execute GraphQL query
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost request = new HttpPost("http://localhost:4000/graphql");
            String query15="""

                              getAllResumes {
                                uniqueId
                                summary
                                introduction
                              }
                    """;
            StringEntity params = new StringEntity("{\"query\":\"" + query15 + "\"}");
            request.addHeader("content-type", "application/json");
            request.setEntity(params);
            HttpResponse response = httpClient.execute(request);

            // Parse response
            BufferedReader reader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
            StringBuilder result = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                result.append(line);
            }

            System.out.println("line: "+ line);

            // Set user details from response
            // Here you need to implement your own logic to parse the GraphQL response and set the username and age
            // For simplicity, I'm just setting some hardcoded values
            this.username = "John Doe";
            this.age = 30;

        } catch (Exception e) {
            e.printStackTrace();
            // Handle exception
        }

        return SUCCESS;
    }

    // Getter and Setter for username and age
}
