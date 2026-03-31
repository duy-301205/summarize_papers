package com.example.summarize_paper.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResetPasswordRequest {

    @NotBlank(message = "EMAIL_REQUIRED")
    private String email;

    @NotBlank(message = "TOKEN_REQUIRED")
    private String resetToken; // Token nhận được từ bước 2

    @Size(min = 8, message = "PASSWORD_INVALID")
    private String newPassword;

    private String confirmPassword;
}
