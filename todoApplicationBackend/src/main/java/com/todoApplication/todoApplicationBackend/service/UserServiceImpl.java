package com.todoApplication.todoApplicationBackend.service;

import com.todoApplication.todoApplicationBackend.dto.AuthResponse;
import com.todoApplication.todoApplicationBackend.dto.LoginRequest;
import com.todoApplication.todoApplicationBackend.dto.RegisterRequest;
import com.todoApplication.todoApplicationBackend.dto.UpdateUserRequest;
import com.todoApplication.todoApplicationBackend.exception.EmailAlreadyExistsException;
import com.todoApplication.todoApplicationBackend.exception.InvalidCredentialsException;
import com.todoApplication.todoApplicationBackend.exception.ValidationException;
import com.todoApplication.todoApplicationBackend.model.User;
import com.todoApplication.todoApplicationBackend.repository.UserRepository;
import com.todoApplication.todoApplicationBackend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public AuthResponse register(RegisterRequest request) {

        if(request.getUserName()==null || request.getUserName().isEmpty())
            throw new ValidationException("Name is required");

        if(request.getEmail()==null || request.getEmail().isEmpty())
            throw new ValidationException("Email is required");

        if(!request.getPassword().equals(request.getConfirmPassword()))
            throw new ValidationException("Passwords do not match");

        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

        if(existingUser.isPresent())
            throw new EmailAlreadyExistsException("User already exists with this email");

        String token = jwtUtil.generateToken(request.getEmail());

        User user = new User();
        user.setUserName(request.getUserName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setCountry(request.getCountry());
        user.setGender(request.getGender());
        user.setJwtToken(token);

        User savedUser = userRepository.save(user);

        return new AuthResponse(token, savedUser.getUserId());
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email"));

        if(!user.getPassword().equals(request.getPassword()))
            throw new InvalidCredentialsException("Invalid password");

        String newToken = jwtUtil.generateToken(user.getEmail());
        user.setJwtToken(newToken);
        userRepository.save(user);

        return new AuthResponse(newToken, user.getUserId());
    }

    @Override
    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ValidationException("User not found"));
    }

    @Override
    public User updateUser(Long id, UpdateUserRequest request){

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ValidationException("User not found"));

        if(request.getUserName()!=null)
            user.setUserName(request.getUserName());

        if(request.getCountry()!=null)
            user.setCountry(request.getCountry());

        if(request.getGender()!=null)
            user.setGender(request.getGender());

        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id){

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ValidationException("User not found"));

        userRepository.delete(user);
    }
}