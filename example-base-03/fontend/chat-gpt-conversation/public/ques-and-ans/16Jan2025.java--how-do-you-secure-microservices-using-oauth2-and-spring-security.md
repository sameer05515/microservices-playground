Securing microservices using **OAuth2** and **Spring Security** is a common approach to ensure that only authorized clients can access your microservices. OAuth2 is an authorization framework that allows secure authorization in a simple, standardized manner. By integrating **Spring Security** with **OAuth2**, you can handle authentication and authorization in a robust and flexible way for your microservices.

### Key Concepts

- **OAuth2 Authorization Server**: The component responsible for authenticating users and issuing access tokens.
- **OAuth2 Resource Server**: The microservices or APIs that protect resources and validate the access tokens provided by clients.
- **Spring Security**: A framework that provides comprehensive security services for Java applications, including authentication, authorization, and protection against common security threats.

### Overview of the Workflow

1. **Authentication**: The client sends an authorization request to the **Authorization Server** (OAuth2 server). If the request is approved, the **Authorization Server** provides an **access token**.
2. **Authorization**: The client sends the access token to the **Resource Server** (microservice) to access protected resources. The **Resource Server** validates the token using the OAuth2 authorization server.
3. **Access Control**: Based on the user's roles or permissions in the access token, Spring Security authorizes the client to access specific resources.

### Steps to Secure Microservices Using OAuth2 and Spring Security

#### 1. **Set Up OAuth2 Authorization Server**
This will be the service that issues tokens (OAuth2 Authorization Server). You can use **Spring Authorization Server** or a third-party OAuth2 provider like **Keycloak** or **Okta**.

**Example: OAuth2 Authorization Server** (using Spring Authorization Server)

Add dependencies for Spring Security OAuth2 and Spring Authorization Server:

```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-oauth2-authorization-server</artifactId>
    <version>0.3.0</version>
</dependency>
```

Create an `AuthorizationServerConfig` to configure the authorization server:

```java
@Configuration
public class AuthorizationServerConfig {

    @Bean
    public ClientRegistrationRepository clientRegistrationRepository() {
        return new InMemoryClientRegistrationRepository(
                ClientRegistration.withRegistrationId("client")
                        .clientId("client-id")
                        .clientSecret("client-secret")
                        .redirectUri("http://localhost:8080/login/oauth2/code/clients")
                        .scope("read", "write")
                        .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                        .tokenUri("http://localhost:9000/oauth/token")
                        .build()
        );
    }

    @Bean
    public AuthorizationServerTokenServices tokenServices() {
        return new DefaultAuthorizationServerTokenServices();
    }
}
```

#### 2. **Set Up OAuth2 Resource Server**

The microservices that you want to secure will act as **OAuth2 Resource Servers**, which will validate the tokens sent by the clients.

For example, you can configure a microservice (`microservice-api`) to accept and validate OAuth2 tokens.

**Add dependencies for OAuth2 Resource Server**:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-oauth2-jose</artifactId>
</dependency>
```

**Configure the Resource Server** to validate tokens:

```java
@Configuration
@EnableWebSecurity
public class ResourceServerConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .oauth2ResourceServer()
                .jwt() // Use JWT as token format
                .and()
            .authorizeRequests()
                .antMatchers("/api/**").authenticated(); // Secure endpoints
    }
}
```

In this example, the `ResourceServerConfig` class configures the resource server to validate JWT tokens. The `oauth2ResourceServer().jwt()` part indicates that the server expects JWT tokens for authentication.

#### 3. **Configure the Resource Server to Validate Tokens**

In the case of JWT tokens, the resource server needs to validate the token using the public key (or JWK endpoint) provided by the authorization server.

```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:9000/oauth2/default  # Authorization Server's public key URI
```

For **JWT tokens**, you can configure Spring Security to trust the public key of the Authorization Server. Alternatively, you could manually configure the `JwtDecoder` with the public key or JWK URL to decode the JWT.

#### 4. **Secure Microservices Using OAuth2 Scopes and Roles**

You can define roles and scopes within the token and use them for fine-grained access control. You can restrict access to specific endpoints based on roles and scopes in the JWT.

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        .oauth2ResourceServer()
            .jwt()
            .and()
        .authorizeRequests()
            .antMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
            .antMatchers("/api/user/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
            .anyRequest().authenticated();
}
```

In this example, the `/api/admin/**` endpoints are accessible only to users with the `ROLE_ADMIN` authority, while `/api/user/**` endpoints are accessible to both `ROLE_USER` and `ROLE_ADMIN`.

#### 5. **OAuth2 Client for Microservices**

If your microservice needs to call another microservice (e.g., an internal API), you can use OAuth2 to authenticate and authorize those calls as well.

Here’s an example of an `OAuth2RestTemplate` that acts as a client for making requests to other OAuth2-protected services:

```java
@Bean
public OAuth2RestTemplate oAuth2RestTemplate(ClientCredentialsResourceDetails details) {
    return new OAuth2RestTemplate(details);
}
```

`ClientCredentialsResourceDetails` is configured with the client credentials, including `clientId`, `clientSecret`, `accessTokenUri`, etc.

#### 6. **Handle Authentication in Client Application**

For client applications (e.g., front-end or mobile apps), you typically use **Authorization Code Flow** or **Implicit Flow** to authenticate users and obtain an access token from the authorization server.

Once the client application receives the access token, it sends it to the microservices in the `Authorization` header of HTTP requests like this:

```
Authorization: Bearer <access_token>
```

### Summary

By integrating **OAuth2** with **Spring Security** in a microservices environment, you can:
- Protect your services from unauthorized access.
- Enable fine-grained access control using **scopes** and **roles**.
- Ensure secure communication between microservices by validating OAuth2 tokens.
- Utilize Spring Security's built-in support for token validation, making it easy to implement OAuth2-based security.

This architecture provides a scalable and flexible way to secure microservices, allowing you to centralize authentication and handle authorization with fine-grained control across different services.