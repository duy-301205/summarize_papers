package com.example.summarize_paper.service;

import com.example.summarize_paper.dto.request.ResetPasswordRequest;
import com.example.summarize_paper.dto.request.SendOtpRequest;
import com.example.summarize_paper.dto.request.VerifyOtpRequest;
import com.example.summarize_paper.dto.response.VerifyOtpResponse;
import com.example.summarize_paper.entity.User;
import com.example.summarize_paper.exception.AppException;
import com.example.summarize_paper.exception.ErrorCode;
import com.example.summarize_paper.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class ForgotPasswordService {
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final StringRedisTemplate redisTemplate;

    private static final String OTP_PREFIX = "otp:";
    private static final String RESET_TOKEN_PREFIX = "reset_token:";

    // Gửi OTP
    public void sendOTP(SendOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String otp = String.format("%06d", new Random().nextInt(1000000));

        redisTemplate.opsForValue().set(OTP_PREFIX + request.getEmail(), otp, 5, TimeUnit.MINUTES);

        emailService.sendOtpMessage(request.getEmail(), otp);

        log.info("Đã gửi OTP tới email: {}", request.getEmail());
    }

    // Xác thực OTP và cấp reset token
    public VerifyOtpResponse verifyOtp(VerifyOtpRequest request) {
        String storedOtp = redisTemplate.opsForValue().get(OTP_PREFIX + request.getEmail());

        if(storedOtp == null) throw new AppException(ErrorCode.OTP_EXPIRED);
        if(!storedOtp.equals(request.getOtp())) throw new AppException(ErrorCode.INVALID_OTP);

        redisTemplate.delete(OTP_PREFIX + request.getEmail());

        String resetToken = UUID.randomUUID().toString();

        redisTemplate.opsForValue().set(RESET_TOKEN_PREFIX + request.getEmail(), resetToken, 10, TimeUnit.MINUTES);

        return VerifyOtpResponse.builder()
                .resetToken(resetToken)
                .build();
    }

    // Đặt lại mật khẩu mới
    public void resetPassword(ResetPasswordRequest request) {
        String storedToken = redisTemplate.opsForValue().get(RESET_TOKEN_PREFIX + request.getEmail());

        if(storedToken == null || !storedToken.equals(request.getResetToken())) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }

        if(!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCH);
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        redisTemplate.delete(RESET_TOKEN_PREFIX + request.getEmail());
    }

}
