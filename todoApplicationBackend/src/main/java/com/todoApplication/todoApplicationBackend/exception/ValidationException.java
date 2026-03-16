package com.todoApplication.todoApplicationBackend.exception;

public class ValidationException extends RuntimeException{

    public ValidationException(String message){
        super(message);
    }

}