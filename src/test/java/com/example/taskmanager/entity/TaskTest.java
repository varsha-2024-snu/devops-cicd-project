package com.example.taskmanager.entity;

import jakarta.validation.*;
import org.junit.jupiter.api.*;
import java.util.Set;
import static org.junit.jupiter.api.Assertions.*;

class TaskTest {
    private Validator validator;

    @BeforeEach void setUp() { validator = Validation.buildDefaultValidatorFactory().getValidator(); }

    @Test void blankTitleIsInvalid() {
        Task task = new Task(" ", null, TaskStatus.TODO);
        assertFalse(validator.validate(task).isEmpty());
    }

    @Test void titleAtMaximumLengthIsValid() {
        Task task = new Task("a".repeat(200), null, TaskStatus.TODO);
        Set<ConstraintViolation<Task>> violations = validator.validate(task);
        assertTrue(violations.isEmpty());
    }

    @Test void titleOverMaximumLengthIsInvalid() {
        Task task = new Task("a".repeat(201), null, TaskStatus.TODO);
        assertFalse(validator.validate(task).isEmpty());
    }

    @Test void prePersistDefaultsStatusAndCreatedAt() {
        Task task = new Task("Study", null, null);
        task.setCreatedAt(null);
        task.setStatus(null);
        task.setCreatedAt(null);
        try {
            var method = Task.class.getDeclaredMethod("setCreatedAt");
            method.setAccessible(true);
            method.invoke(task);
        } catch (ReflectiveOperationException ex) {
            fail(ex);
        }
        assertAll(() -> assertEquals(TaskStatus.TODO, task.getStatus()), () -> assertNotNull(task.getCreatedAt()));
    }
}
