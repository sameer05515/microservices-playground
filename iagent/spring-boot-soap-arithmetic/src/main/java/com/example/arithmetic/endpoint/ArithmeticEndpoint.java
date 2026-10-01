package com.example.arithmetic.endpoint;

import com.example.arithmetic.ws.AddRequest;
import com.example.arithmetic.ws.AddResponse;
import com.example.arithmetic.ws.DivideRequest;
import com.example.arithmetic.ws.DivideResponse;
import com.example.arithmetic.ws.MultiplyRequest;
import com.example.arithmetic.ws.MultiplyResponse;
import com.example.arithmetic.ws.SubtractRequest;
import com.example.arithmetic.ws.SubtractResponse;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

@Endpoint
public class ArithmeticEndpoint {

    private static final String NAMESPACE_URI = "http://example.com/arithmetic";

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "addRequest")
    @ResponsePayload
    public AddResponse add(@RequestPayload AddRequest request) {
        AddResponse response = new AddResponse();
        response.setResult(request.getA() + request.getB());
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "subtractRequest")
    @ResponsePayload
    public SubtractResponse subtract(@RequestPayload SubtractRequest request) {
        SubtractResponse response = new SubtractResponse();
        response.setResult(request.getA() - request.getB());
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "multiplyRequest")
    @ResponsePayload
    public MultiplyResponse multiply(@RequestPayload MultiplyRequest request) {
        MultiplyResponse response = new MultiplyResponse();
        response.setResult(request.getA() * request.getB());
        return response;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "divideRequest")
    @ResponsePayload
    public DivideResponse divide(@RequestPayload DivideRequest request) {

        if (request.getB() == 0) {
            throw new IllegalArgumentException("Cannot divide by zero");
        }

        DivideResponse response = new DivideResponse();
        response.setResult(request.getA() / request.getB());
        return response;
    }
}
