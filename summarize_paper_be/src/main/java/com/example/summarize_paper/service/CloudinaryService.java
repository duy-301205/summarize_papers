package com.example.summarize_paper.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.summarize_paper.exception.AppException;
import com.example.summarize_paper.exception.ErrorCode;
import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public Map upload(MultipartFile file) {
        try{
            return cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", "summarize_paper/avatars"));
        } catch (IOException e) {
            throw new AppException(ErrorCode.ERROR_UPLOAD_FILE);
        } catch (java.io.IOException e) {
            throw new RuntimeException(e);
        }
    }

    public Map uploadPaper(MultipartFile file) {
        try {
            return cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "summarize_paper/papers",
                            "resource_type", "raw"
                    )
            );
        } catch (java.io.IOException e) {
            throw new AppException(ErrorCode.ERROR_UPLOAD_FILE);
        }
    }

    // Delete PDF/paper
    public void deletePaper(String publicId) {
        if (publicId == null || publicId.isBlank()) {
            return;
        }

        try {
            cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.asMap("resource_type", "raw")
            );
        } catch (java.io.IOException e) {
            throw new AppException(ErrorCode.ERROR_UPLOAD_FILE);
        }
    }
}
