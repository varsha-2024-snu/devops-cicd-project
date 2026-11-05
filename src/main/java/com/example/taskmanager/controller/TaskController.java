package com.example.taskmanager.controller;

import com.example.taskmanager.entity.Task;
import com.example.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService service;
    public TaskController(TaskService service) { this.service = service; }
    @GetMapping public List<Task> getAll() { return service.findAll(); }
    @GetMapping("/{id}") public Task getById(@PathVariable Long id) { return service.findById(id); }
    @PostMapping
    public ResponseEntity<Task> create(@Valid @RequestBody Task task) {
        Task created = service.create(task);
        return ResponseEntity.created(URI.create("/api/tasks/" + created.getId())).body(created);
    }
    @PutMapping("/{id}") public Task update(@PathVariable Long id, @Valid @RequestBody Task task) { return service.update(id, task); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
