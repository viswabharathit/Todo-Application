package com.todoApplication.todoApplicationBackend.controller;

import com.todoApplication.todoApplicationBackend.ApiResponse;
import com.todoApplication.todoApplicationBackend.dto.AuthResponse;
import com.todoApplication.todoApplicationBackend.dto.LoginRequest;
import com.todoApplication.todoApplicationBackend.dto.RegisterRequest;
import com.todoApplication.todoApplicationBackend.dto.UpdateUserRequest;
import com.todoApplication.todoApplicationBackend.model.User;
import com.todoApplication.todoApplicationBackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request){
        AuthResponse response = userService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request){
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.getUser(id);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request){

        User updatedUser = userService.updateUser(id,request);

        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id){

        userService.deleteUser(id);

        return ResponseEntity.ok(
                new ApiResponse("User deleted successfully",200)
        );
    }
}