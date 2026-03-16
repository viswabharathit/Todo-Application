package com.todoApplication.todoApplicationBackend.controller;

import com.todoApplication.todoApplicationBackend.ApiResponse;
import com.todoApplication.todoApplicationBackend.model.Task;
import com.todoApplication.todoApplicationBackend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tasks")
public class TaskController {


    @Autowired
    private TaskService taskService;

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task){

        Task savedTask = taskService.createTask(task);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse("Task created with id "+savedTask.getTaskId(),201));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getTasksOfUser(@PathVariable Long userId){

        List<Task> tasks = taskService.getTasksByUserId(userId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(tasks);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id,@RequestBody Task task){
        return taskService.updateTask(id,task);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> patchTask(@PathVariable Long id, @RequestBody Map<String,Object> updates){
        try{
            Task updatedTask = taskService.patchTask(id,updates);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(new ApiResponse("Task updated successfully",200));

        }catch(RuntimeException e){
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(e.getMessage(),404));

        }catch(Exception e){
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Task cannot be added",500));
        }
    }


    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id){
        taskService.deleteTask(id);
    }
}
