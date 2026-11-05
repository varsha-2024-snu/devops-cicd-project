package com.example.taskmanager.service;

import com.example.taskmanager.entity.*;
import com.example.taskmanager.exception.TaskNotFoundException;
import com.example.taskmanager.repository.TaskRepository;
import org.junit.jupiter.api.*;
import org.mockito.*;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskServiceTest {
    @Mock TaskRepository repository;
    @InjectMocks TaskService service;

    @BeforeEach void setUp() { MockitoAnnotations.openMocks(this); }

    @Test void findAllReturnsRepositoryResults() {
        List<Task> tasks = List.of(new Task("Study", null, TaskStatus.TODO));
        when(repository.findAll()).thenReturn(tasks);
        assertSame(tasks, service.findAll());
    }

    @Test void findByIdReturnsTask() {
        Task task = new Task("Study", null, TaskStatus.TODO);
        when(repository.findById(1L)).thenReturn(Optional.of(task));
        assertSame(task, service.findById(1L));
    }

    @Test void findByIdThrowsWhenMissing() {
        when(repository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(TaskNotFoundException.class, () -> service.findById(99L));
    }

    @Test void createClearsClientProvidedId() {
        Task task = new Task("Study", "Notes", TaskStatus.IN_PROGRESS);
        task.setId(42L);
        when(repository.save(task)).thenReturn(task);
        service.create(task);
        assertNull(task.getId());
        verify(repository).save(task);
    }

    @Test void updateChangesEditableFieldsButKeepsIdAndCreatedAt() {
        Task existing = new Task("Old", "Old details", TaskStatus.TODO);
        existing.setId(7L);
        Task input = new Task("New", "New details", TaskStatus.COMPLETED);
        when(repository.findById(7L)).thenReturn(Optional.of(existing));
        when(repository.save(existing)).thenReturn(existing);
        Task result = service.update(7L, input);
        assertAll(() -> assertSame(existing, result), () -> assertEquals("New", existing.getTitle()),
                () -> assertEquals(TaskStatus.COMPLETED, existing.getStatus()), () -> assertEquals(7L, existing.getId()));
    }

    @Test void updateMissingTaskThrows() {
        when(repository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(TaskNotFoundException.class, () -> service.update(1L, new Task()));
        verify(repository, never()).save(any());
    }

    @Test void deleteFindsAndDeletesTask() {
        Task task = new Task("Study", null, TaskStatus.TODO);
        when(repository.findById(2L)).thenReturn(Optional.of(task));
        service.delete(2L);
        verify(repository).delete(task);
    }

    @Test void deleteMissingTaskThrowsAndDoesNotDelete() {
        when(repository.findById(2L)).thenReturn(Optional.empty());
        assertThrows(TaskNotFoundException.class, () -> service.delete(2L));
        verify(repository, never()).delete(any());
    }
}
