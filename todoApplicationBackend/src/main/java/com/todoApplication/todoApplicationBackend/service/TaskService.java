package com.todoApplication.todoApplicationBackend.service;

import com.todoApplication.todoApplicationBackend.model.Task;
import java.util.List;
import java.util.Map;

public interface TaskService {
    Task createTask(Task task);

    List<Task> getTasksByUserId(Long userId);

    Task updateTask(Long id, Task task);

    Task patchTask(Long id, Map<String, Object> updates);

    void deleteTask(Long id);
}