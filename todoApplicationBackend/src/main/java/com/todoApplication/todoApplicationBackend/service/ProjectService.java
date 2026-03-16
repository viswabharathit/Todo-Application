package com.todoApplication.todoApplicationBackend.service;

import com.todoApplication.todoApplicationBackend.model.Project;

import java.util.List;
import java.util.Map;

public interface ProjectService {

    Project addProject(Project project);

    List<Project> getProjectsByUserId(Long userId);

    Project updateProject(Long id, Project project);

    void deleteProject(Long id);

    Project patchProject(Long id, Map<String, Object> updates);

}
