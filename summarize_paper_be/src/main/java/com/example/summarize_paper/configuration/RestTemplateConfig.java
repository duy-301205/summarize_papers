package com.example.summarize_paper.configuration;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Configuration
public class RestTemplateConfig {
    @Bean
    public RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        // Thời gian kết nối (ms)
        factory.setConnectTimeout(30000);
        // Thời gian chờ phản hồi (ms) - Đặt 5 phút (300,000ms)
        factory.setReadTimeout(300000);

        return new RestTemplate(factory);
    }
}
