package com.example.taskmanager.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {
    @Value("${spring.application.name}") private String applicationName;
    @Value("${app.version}") private String version;
    @GetMapping public Map<String, String> health() {
        return Map.of("application", applicationName, "version", version, "status", "UP");
    }
}
