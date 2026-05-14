package com.example.summarize_paper.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${brevo.api-key}")
    private String brevoApiKey;

    @Value("${brevo.mail-from}")
    private String mailFrom;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendOtpMessage(String to, String otp) {
        String url = "https://api.brevo.com/v3/smtp/email";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", brevoApiKey);

        Map<String, Object> body = Map.of(
                "sender", Map.of(
                        "name", "SciSum AI",
                        "email", mailFrom
                ),
                "to", List.of(
                        Map.of(
                                "email", to
                        )
                ),
                "subject", "SciSum AI - OTP xác thực",
                "htmlContent",
                "<h2>SciSum AI</h2>" +
                        "<p>Mã OTP để đặt lại mật khẩu của bạn là:</p>" +
                        "<h1>" + otp + "</h1>" +
                        "<p>Mã này có hiệu lực trong 5 phút.</p>" +
                        "<p>Vui lòng không cung cấp mã này cho bất kỳ ai.</p>"
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Gửi email OTP thất bại: " + response.getBody());
        }
    }
}
