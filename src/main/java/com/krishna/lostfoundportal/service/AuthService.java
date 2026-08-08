package com.krishna.lostfoundportal.service;

import com.krishna.lostfoundportal.entity.User;
import com.krishna.lostfoundportal.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository repository;

    public AuthService(UserRepository repository) {
        this.repository = repository;
    }

    public User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return repository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}