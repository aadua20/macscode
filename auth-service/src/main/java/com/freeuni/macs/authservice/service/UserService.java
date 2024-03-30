package com.freeuni.macs.authservice.service;

import com.freeuni.macs.authservice.exception.UserAuthException;
import com.freeuni.macs.authservice.model.db.User;
import com.freeuni.macs.authservice.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.h2.security.auth.AuthConfigException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
@Slf4j
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public User validateUser(String username, String password) {
        return null;
    }

    public User registerUser(User user) {
        Optional<User> userDB = userRepository.findByEmail(user.getEmail());
        if (userDB.isPresent()) {
            throw new UserAuthException("Account with email {} already exists.", user.getEmail());
        }
        return userRepository.save(user);
    }

}
