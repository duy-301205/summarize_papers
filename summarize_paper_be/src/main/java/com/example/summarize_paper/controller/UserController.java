package com.example.summarize_paper.controller;

import com.example.summarize_paper.dto.request.ChangePasswordRequest;
import com.example.summarize_paper.dto.request.UserUpdateRequest;
import com.example.summarize_paper.dto.response.ApiResponse;
import com.example.summarize_paper.dto.response.UserResponse;
import com.example.summarize_paper.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ApiResponse<UserResponse> getMe() {
        return ApiResponse.<UserResponse>builder()
                .data(userService.getMyProfile())
                .build();
    }

    @PutMapping("/me")
    public ApiResponse<UserResponse> updateMe(@RequestBody UserUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .data(userService.updateProfile(request))
                .build();
    }

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<UserResponse> updateAvatar(@RequestParam("file") MultipartFile file) {
        return ApiResponse.<UserResponse>builder()
                .data(userService.updateAvatar(file))
                .build();
    }

    @PutMapping("/change-password")
    public ApiResponse<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);

        return ApiResponse.<Void>builder()
                .message("Password changed")
                .build();
    }
}
