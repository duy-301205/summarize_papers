package com.example.summarize_paper.service;

import io.jsonwebtoken.io.IOException;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SseService {
    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter createEmitter(Long paperId) {
        SseEmitter emitter = new SseEmitter(600_000L); // Timeout 10 phút
        emitters.put(paperId, emitter);

        emitter.onCompletion(() -> emitters.remove(paperId));
        emitter.onTimeout(() -> emitters.remove(paperId));
        emitter.onError((e) -> emitters.remove(paperId));

        return emitter;
    }

    public void sendStatus(Long paperId, String status, int progress) {
        SseEmitter emitter = emitters.get(paperId);
        if (emitter != null) {
            try {
                Map<String, Object> data = Map.of(
                        "status", status,
                        "progress", progress
                );
                emitter.send(SseEmitter.event().name("PROGRESS").data(data));

                // Nếu hoàn thành 100% thì kết thúc luồng
                if (progress >= 100) {
                    emitter.complete();
                    emitters.remove(paperId);
                }
            } catch (IOException e) {
                emitters.remove(paperId);
            } catch (java.io.IOException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
