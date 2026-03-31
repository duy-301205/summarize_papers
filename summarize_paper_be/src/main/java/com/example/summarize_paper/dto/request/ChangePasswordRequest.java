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
public class ChangePasswordRequest {

    @NotBlank(message = "PASSWORD_INVALID")
    private String oldPassword;

    @NotBlank(message = "PASSWORD_REQUIRED")
    @Size(min = 8, message = "PASSWORD_INVALID")
    private String newPassword;

    @NotBlank(message = "PASSWORD_REQUIRED")
    private String confirmPassword;
}
