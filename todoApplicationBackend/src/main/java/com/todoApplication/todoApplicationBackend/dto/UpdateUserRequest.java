package com.todoApplication.todoApplicationBackend.dto;

import lombok.Data;

@Data
public class UpdateUserRequest {

    private String userName;
    private String country;
    private String gender;
}