package com.example.summarize_paper.configuration;

import com.example.summarize_paper.entity.User;
import com.example.summarize_paper.enums.Role;
import com.example.summarize_paper.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminSetupRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("hduy9863@gmail.com").isEmpty()
        && userRepository.findByUsername("duy").isEmpty()) {
            User admin = User.builder()
                    .username("duy")
                    .password(passwordEncoder.encode("12345678"))
                    .email("hduy9863@gmail.com")
                    .institution("VNU HUS")
                    .role(Role.ROLE_ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println(">>> Admin account created: admin / admin123");
        }
    }
}
