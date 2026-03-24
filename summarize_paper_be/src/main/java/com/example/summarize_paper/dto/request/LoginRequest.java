package com.example.summarize_paper.dto.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
