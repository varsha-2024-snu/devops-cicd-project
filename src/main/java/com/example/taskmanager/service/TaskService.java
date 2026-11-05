package com.example.taskmanager.service;

import com.example.taskmanager.entity.Task;
import com.example.taskmanager.exception.TaskNotFoundException;
import com.example.taskmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskService {
    private final TaskRepository repository;
    public TaskService(TaskRepository repository) { this.repository = repository; }
    public List<Task> findAll() { return repository.findAll(); }
    public Task findById(Long id) { return repository.findById(id).orElseThrow(() -> new TaskNotFoundException(id)); }
    public Task create(Task task) { task.setId(null); return repository.save(task); }
    public Task update(Long id, Task input) {
        Task task = findById(id);
        task.setTitle(input.getTitle());
        task.setDescription(input.getDescription());
        task.setStatus(input.getStatus());
        return repository.save(task);
    }
    public void delete(Long id) { repository.delete(findById(id)); }
}
