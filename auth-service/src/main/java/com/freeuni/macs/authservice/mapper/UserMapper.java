package com.freeuni.macs.authservice.mapper;

import com.freeuni.macs.authservice.model.api.SignUpRequest;
import com.freeuni.macs.authservice.model.api.UserDTO;
import com.freeuni.macs.authservice.model.db.User;
import org.springframework.stereotype.Service;

@Service
public class UserMapper {

    public UserDTO entityToDTO(User user) {
        if (user == null) {
            return null;
        }
        return UserDTO.builder()
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .password(user.getPassword())
                .build();
    }

    public User fromDTOToEntity(UserDTO user) {
        if (user == null) {
            return null;
        }
        return User.builder()
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .password(user.getPassword())
                .build();
    }

    public User registerDTOToEntity(SignUpRequest signUpRequest) {
        if (signUpRequest == null) {
            return null;
        }
        return User.builder()
                .name(signUpRequest.getName())
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(signUpRequest.getPassword())
                .build();
    }
}
