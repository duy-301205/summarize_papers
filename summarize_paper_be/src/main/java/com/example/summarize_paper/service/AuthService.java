package com.example.summarize_paper.service;

import com.example.summarize_paper.dto.request.LoginRequest;
import com.example.summarize_paper.dto.request.RefreshTokenRequest;
import com.example.summarize_paper.dto.request.RegisterRequest;
import com.example.summarize_paper.dto.response.AuthenticationResponse;
import com.example.summarize_paper.dto.response.RegisterResponse;
import com.example.summarize_paper.entity.InvalidatedToken;
import com.example.summarize_paper.entity.User;
import com.example.summarize_paper.enums.Role;
import com.example.summarize_paper.exception.AppException;
import com.example.summarize_paper.exception.ErrorCode;
import com.example.summarize_paper.mapper.UserMapper;
import com.example.summarize_paper.repository.InvalidedTokenRepository;
import com.example.summarize_paper.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserMapper userMapper;
    private final InvalidedTokenRepository invalidedTokenRepository;

    public RegisterResponse register(RegisterRequest registerRequest) {
        if(userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        User user = userMapper.toEntity(registerRequest);
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(Role.ROLE_USER);

        userRepository.save(user);
        return userMapper.toRegisterResponse(user);
    }

    public AuthenticationResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        return AuthenticationResponse.builder()
                .accessToken(jwtService.generateAccessToken(user))
                .refreshToken(jwtService.generateRefreshToken(user))
                .build();
    }

    public AuthenticationResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        // 1. Kiểm tra token đã bị vô hiệu hóa (logout) chưa bằng JTI
        String tokenId = jwtService.extractId(refreshToken);
        if (invalidedTokenRepository.existsById(tokenId)) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        // 2. Kiểm tra hết hạn
        if(jwtService.isTokenExpired(refreshToken)) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        // 3. Lấy email và tạo cặp token mới
        String email = jwtService.extractEmail(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 4. Vô hiệu hóa token cũ sau khi dùng (Rotation)
        logout(request);

        return AuthenticationResponse.builder()
                .accessToken(jwtService.generateAccessToken(user))
                .refreshToken(jwtService.generateRefreshToken(user))
                .build();
    }

    public void logout(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        try {
            String tokenId = jwtService.extractId(token);
            Date expiryDate = jwtService.extractExpiration(token);

            LocalDateTime expiryTime = expiryDate.toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();

            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .id(tokenId)
                    .expiryTime(expiryTime)
                    .build();

            invalidedTokenRepository.save(invalidatedToken);
            log.info("Token {} has been invalidated", tokenId);
        } catch (Exception e) {
            log.warn("Logout failed: {}", e.getMessage());
        }
    }
}
