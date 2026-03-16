package com.todoApplication.todoApplicationBackend.service;

import com.todoApplication.todoApplicationBackend.dto.AuthResponse;
import com.todoApplication.todoApplicationBackend.dto.LoginRequest;
import com.todoApplication.todoApplicationBackend.dto.RegisterRequest;
import com.todoApplication.todoApplicationBackend.dto.UpdateUserRequest;
import com.todoApplication.todoApplicationBackend.model.User;

public interface UserService {


    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    User getUser(Long id);

    User updateUser(Long id, UpdateUserRequest request);

    void deleteUser(Long id);
}
