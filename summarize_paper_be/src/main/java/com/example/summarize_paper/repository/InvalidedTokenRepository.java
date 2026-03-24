package com.example.summarize_paper.repository;

import com.example.summarize_paper.entity.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvalidedTokenRepository extends JpaRepository<InvalidatedToken, String> {
}
