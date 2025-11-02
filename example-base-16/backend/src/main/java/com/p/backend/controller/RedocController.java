package com.p.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/redoc")
@Tag(name = "Documentation", description = "API documentation endpoints")
public class RedocController {

    private static final String REDOC_HTML = """
            <!DOCTYPE html>
            <html>
            <head>
                <title>API Documentation - Redoc</title>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                    }
                </style>
            </head>
            <body>
                <redoc spec-url='/v3/api-docs'></redoc>
                <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
            </body>
            </html>
            """;

    @Operation(
            summary = "Redoc Documentation",
            description = "Returns Redoc-based API documentation interface"
    )
    @GetMapping(produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> redoc() {
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(REDOC_HTML);
    }
}

