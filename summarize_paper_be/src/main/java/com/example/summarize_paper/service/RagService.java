package com.example.summarize_paper.service;

import com.example.summarize_paper.dto.event.ChatRequest;
import com.example.summarize_paper.dto.event.ChatResponse;
import com.example.summarize_paper.dto.response.ConversationResponse;
import com.example.summarize_paper.dto.response.MessageResponse;
import com.example.summarize_paper.entity.ChatMessage;
import com.example.summarize_paper.entity.Conversation;
import com.example.summarize_paper.entity.Paper;
import com.example.summarize_paper.entity.User;
import com.example.summarize_paper.repository.ChatMessageRepository;
import com.example.summarize_paper.repository.ConversationRepository;
import com.example.summarize_paper.repository.PaperRepository;
import com.example.summarize_paper.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class RagService {

    @Value("${app.fastapi.url}")
    private String fastapiUrl;

    private final RestTemplate restTemplate;
    private final ConversationRepository conversationRepository;
    private final PaperRepository paperRepository;
    private final UserService userService;
    private final ChatMessageRepository chatMessageRepository;

    public ChatResponse askQuestion(ChatRequest chatRequest) {
        log.info("💬 RagService: Processing query for Paper ID {}", chatRequest.paperId());

        Long conversationId = chatRequest.conversationId();
        if (conversationId == null || conversationId == 0) {
            conversationId = createNewConversation(chatRequest.paperId());
        }

        String url = fastapiUrl + "/api/chat/ask";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("paper_id", chatRequest.paperId());
        body.put("conversation_id", conversationId);
        body.put("message", chatRequest.message());

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<ChatResponse> response = restTemplate.postForEntity(url, entity, ChatResponse.class);
            return response.getBody();
        } catch (Exception e) {
            log.error(" RagService Error: {}", e.getMessage());
            throw new RuntimeException("Lỗi kết nối AI Service");
        }
    }

    private Long createNewConversation(Long paperId) {
        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài báo"));

        User currentUser = userService.getCurrentUser();

        Conversation conversation = new Conversation();
        conversation.setPaper(paper);
        conversation.setUser(currentUser); // Set trực tiếp object User vừa lấy được

        conversation = conversationRepository.save(conversation);
        return conversation.getId();
    }

    public List<MessageResponse> getChatHistory(Long conversationId) {
        User currentUser = userService.getCurrentUser();

        List<ChatMessage> messages = chatMessageRepository
                .findByConversationIdAndConversationUserIdOrderByCreatedAtAsc(conversationId, currentUser.getId());

        return messages.stream()
                .map(msg -> MessageResponse.builder()
                        .role(msg.getRole().name().toLowerCase())
                        .content(msg.getContent())
                        .sourceNodes(msg.getSourceNodes())
                        .createdAt(msg.getCreatedAt())
                        .build())
                .toList();
    }

    public List<ConversationResponse> getConversations(Long paperId) {
        User currentUser = userService.getCurrentUser();

        List<Conversation> conversations = conversationRepository
                .findByUserIdAndPaperIdOrderByCreatedAtDesc(currentUser.getId(), paperId);

        return conversations.stream()
                .map(conv -> ConversationResponse.builder()
                        .id(conv.getId())
                        .createdAt(conv.getCreatedAt())
                        .build())
                .toList();
    }

}
