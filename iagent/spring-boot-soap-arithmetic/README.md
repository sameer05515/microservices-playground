# Spring Boot SOAP Arithmetic Web Service

A simple SOAP Web Service built using Spring Boot and Spring Web Services.

## Operations

- add
- subtract
- multiply
- divide

## Tech Stack

- Java 17
- Spring Boot 3.5.6
- Spring Web Services
- Maven
- JAXB
- XML Schema (XSD)

## Project Structure

```text
arithmetic-soap-service/
├── pom.xml
├── README.md
└── src/
    └── main/
        ├── java/
        │   └── com/example/arithmetic/
        │       ├── ArithmeticSoapApplication.java
        │       ├── config/
        │       │   └── WebServiceConfig.java
        │       └── endpoint/
        │           └── ArithmeticEndpoint.java
        └── resources/
            ├── application.properties
            └── xsd/
                └── arithmetic.xsd
```

## Run

```bash
mvn clean spring-boot:run
```

Or:

```bash
mvn clean package
java -jar target/arithmetic-soap-service-0.0.1-SNAPSHOT.jar
```

## WSDL

After starting the application:

```text
http://localhost:8080/ws/arithmetic.wsdl
```

## SOAP Endpoint

```text
http://localhost:8080/ws
```

## Example SOAP Request - Add

```xml
<soapenv:Envelope
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:arr="http://example.com/arithmetic">

    <soapenv:Header/>

    <soapenv:Body>
        <arr:addRequest>
            <arr:a>10</arr:a>
            <arr:b>20</arr:b>
        </arr:addRequest>
    </soapenv:Body>

</soapenv:Envelope>
```

Expected response:

```xml
<SOAP-ENV:Envelope
    xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">

    <SOAP-ENV:Body>
        <ns2:addResponse
            xmlns:ns2="http://example.com/arithmetic">
            <ns2:result>30.0</ns2:result>
        </ns2:addResponse>
    </SOAP-ENV:Body>

</SOAP-ENV:Envelope>
```

## Example SOAP Request - Divide

```xml
<soapenv:Envelope
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:arr="http://example.com/arithmetic">

    <soapenv:Header/>

    <soapenv:Body>
        <arr:divideRequest>
            <arr:a>100</arr:a>
            <arr:b>4</arr:b>
        </arr:divideRequest>
    </soapenv:Body>

</soapenv:Envelope>
```

Expected result:

```xml
<result>25.0</result>
```

## Test using curl

### Add

```bash
curl --header "Content-Type: text/xml;charset=UTF-8"      --data @add-request.xml      http://localhost:8080/ws
```

### Subtract

```bash
curl --header "Content-Type: text/xml;charset=UTF-8"      --data @subtract-request.xml      http://localhost:8080/ws
```

## Generated Java Classes

The JAXB classes are generated from:

```text
src/main/resources/xsd/arithmetic.xsd
```

Run:

```bash
mvn clean generate-sources
```

Generated classes will be under:

```text
target/generated-sources/xjc/
```

## Important SOAP Flow

```text
SOAP Client
    |
    | HTTP POST + SOAP XML
    v
MessageDispatcherServlet
    |
    v
@PayloadRoot
    |
    v
ArithmeticEndpoint
    |
    v
Business Operation
    |
    v
SOAP XML Response
```
