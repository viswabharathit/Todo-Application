package com.todoApplication.todoApplicationBackend.exception;

public class ProjectNotFoundException extends RuntimeException {

    public ProjectNotFoundException(String message){
        super(message);
    }

}
