package com.example.summarize_paper.controller;

import com.example.summarize_paper.dto.request.ResetPasswordRequest;
import com.example.summarize_paper.dto.request.SendOtpRequest;
import com.example.summarize_paper.dto.request.VerifyOtpRequest;
import com.example.summarize_paper.dto.response.ApiResponse;
import com.example.summarize_paper.dto.response.VerifyOtpResponse;
import com.example.summarize_paper.service.ForgotPasswordService;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/forgot-password")
@RequiredArgsConstructor
public class ForgotPasswordController {

    private final ForgotPasswordService forgotPasswordService;

    @PostMapping("/send-otp")
    public ApiResponse<Void> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        forgotPasswordService.sendOTP(request);
        return ApiResponse.<Void>builder()
                .message("OTP sent")
                .build();
    }

    // Nhập 6 số xong gọi
    @PostMapping("/verify-otp")
    public ApiResponse<VerifyOtpResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        return ApiResponse.<VerifyOtpResponse>builder()
                .data(forgotPasswordService.verifyOtp(request))
                .build();
    }

    // 3. Nhập pass mới xong gọi kèm resetToken
    @PostMapping("/reset")
    public ApiResponse<Void> reset(@RequestBody @Valid ResetPasswordRequest request) {
        forgotPasswordService.resetPassword(request);
        return ApiResponse.<Void>builder()
                .message("Password reset successful")
                .build();
    }
}
