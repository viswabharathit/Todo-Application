package com.todoApplication.todoApplicationBackend.service;

import com.todoApplication.todoApplicationBackend.model.Task;
import com.todoApplication.todoApplicationBackend.model.Priority;
import com.todoApplication.todoApplicationBackend.model.Project;
import com.todoApplication.todoApplicationBackend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Override
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public List<Task> getTasksByUserId(Long userId) {
        return taskRepository.findByProjectUserUserId(userId);
    }

    @Override
    public Task updateTask(Long id, Task task) {

        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        existingTask.setTaskName(task.getTaskName());
        existingTask.setDescription(task.getDescription());
        existingTask.setDueDate(task.getDueDate());
        existingTask.setStatus(task.getStatus());

        return taskRepository.save(existingTask);
    }

    @Override
    public Task patchTask(Long id, Map<String, Object> updates) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (updates.containsKey("taskName")) {
            task.setTaskName((String) updates.get("taskName"));
        }

        if (updates.containsKey("description")) {
            task.setDescription((String) updates.get("description"));
        }

        if (updates.containsKey("dueDate")) {
            task.setDueDate(LocalDate.parse((String) updates.get("dueDate")));
        }

        if (updates.containsKey("status")) {
            task.setStatus((String) updates.get("status"));
        }

        if (updates.containsKey("project")) {
            Map<String, Object> projectMap = (Map<String, Object>) updates.get("project");
            Project project = new Project();
            project.setProjectId(Long.valueOf(projectMap.get("projectId").toString()));
            task.setProject(project);
        }

        if (updates.containsKey("priority")) {
            Map<String, Object> priorityMap = (Map<String, Object>) updates.get("priority");
            Priority priority = new Priority();
            priority.setPriorityId(Long.valueOf(priorityMap.get("priorityId").toString()));
            task.setPriority(priority);
        }

        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}