package com.example.summarize_paper.mapper;

import com.example.summarize_paper.dto.request.RegisterRequest;
import com.example.summarize_paper.dto.response.RegisterResponse;
import com.example.summarize_paper.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "password", ignore = true)
    User toEntity(RegisterRequest request);

    RegisterResponse toRegisterResponse(User user);
}
