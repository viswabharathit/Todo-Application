package com.todoApplication.todoApplicationBackend.service;


import com.todoApplication.todoApplicationBackend.exception.ProjectNotFoundException;
import com.todoApplication.todoApplicationBackend.model.Project;
import com.todoApplication.todoApplicationBackend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class ProjectServiceImpl implements ProjectService{

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public Project addProject(Project project) {
        return projectRepository.save(project);
    }

    @Override
    public List<Project> getProjectsByUserId(Long userId) {
        return projectRepository.findByUserUserId(userId);
    }

    @Override
    public Project updateProject(Long id, Project project) {

        Project existingProject = projectRepository
                .findById(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found"));

        existingProject.setProjectName(project.getProjectName());
        existingProject.setDescription(project.getDescription());
        existingProject.setDueDate(project.getDueDate());

        return projectRepository.save(existingProject);
    }

    @Override
    public Project patchProject(Long id, Map<String, Object> updates) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found"));

        if(updates.containsKey("projectName")){
            project.setProjectName((String) updates.get("projectName"));
        }

        if(updates.containsKey("description")){
            project.setDescription((String) updates.get("description"));
        }

        if(updates.containsKey("dueDate")){
            project.setDueDate(LocalDate.parse((String) updates.get("dueDate")));
        }

        return projectRepository.save(project);
    }

    @Override
    public void deleteProject(Long id) {

        Project existingProject = projectRepository
                .findById(id)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found"));

        projectRepository.delete(existingProject);
    }


}
