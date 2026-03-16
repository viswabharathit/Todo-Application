package com.todoApplication.todoApplicationBackend.controller;

import com.todoApplication.todoApplicationBackend.ApiResponse;
import com.todoApplication.todoApplicationBackend.model.Project;
import com.todoApplication.todoApplicationBackend.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;


    @PostMapping
    public ResponseEntity<?> addProject(@RequestBody Project project){


        Project savedProject = projectService.addProject(project);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse(
                        "Project with id "+savedProject.getProjectId()+" added successfully",
                        201));


    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getProjectsByUser(@PathVariable Long userId){

        List<Project> projects = projectService.getProjectsByUserId(userId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(projects);


    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> patchProject(@PathVariable Long id,
                                          @RequestBody Map<String, Object> updates) {

        Project updatedProject = projectService.patchProject(id, updates);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ApiResponse(
                        "Project with id " + updatedProject.getProjectId() + " updated successfully",
                        200));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id){
        projectService.deleteProject(id);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ApiResponse("Project deleted successfully",200));


    }


}
