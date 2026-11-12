package com.example.taskmanager.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/config")
public class ConfigController {
    private final String welcomeMessage;

    public ConfigController(@Value("${app.welcome-message}") String welcomeMessage) {
        this.welcomeMessage = welcomeMessage;
    }

    @GetMapping
    public Map<String, String> config() {
        return Map.of("welcomeMessage", welcomeMessage);
    }
}
