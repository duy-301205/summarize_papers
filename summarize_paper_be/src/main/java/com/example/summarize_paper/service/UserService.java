package com.example.summarize_paper.service;

import com.cloudinary.Cloudinary;
import com.example.summarize_paper.dto.request.UserUpdateRequest;
import com.example.summarize_paper.dto.response.UserResponse;
import com.example.summarize_paper.entity.User;
import com.example.summarize_paper.exception.AppException;
import com.example.summarize_paper.exception.ErrorCode;
import com.example.summarize_paper.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getActualUsername(),
                user.getInstitution(),
                user.getAvatarUrl()
        );
    }

    public UserResponse getMyProfile() {
        User user = getCurrentUser();
        return toResponse(user);
    }

    public UserResponse updateProfile(UserUpdateRequest request) {
        User user = getCurrentUser();

        if(request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }
        if(request.getInstitution() != null) {
            user.setInstitution(request.getInstitution());
        }

        User savedUser = userRepository.save(user);
        return toResponse(savedUser);
    }

    @Transactional
    public UserResponse updateAvatar(MultipartFile file) {
        User user = getCurrentUser();

        Map<?, ?> uploadResult = cloudinaryService.upload(file);

        String newUrl = uploadResult.get("secure_url") != null
                ? uploadResult.get("secure_url").toString()
                : uploadResult.get("url").toString();

        user.setAvatarUrl(newUrl);
        User savedUser = userRepository.save(user);

        return toResponse(savedUser);
    }
}
