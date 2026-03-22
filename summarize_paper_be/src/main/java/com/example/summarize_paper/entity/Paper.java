package com.example.summarize_paper.entity;

import com.example.summarize_paper.enums.PaperStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "papers")
@Data
public class Paper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private PaperStatus status = PaperStatus.UPLOADED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "paper", cascade = CascadeType.ALL)
    private List<Summary> summaries;

    @CreationTimestamp
    @Column(name = "upload_at", updatable = false)
    private LocalDateTime uploadAt;
}
