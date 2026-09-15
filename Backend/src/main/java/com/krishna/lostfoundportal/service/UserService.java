package com.krishna.lostfoundportal.service;

import com.krishna.lostfoundportal.dto.UserDTO;
import com.krishna.lostfoundportal.entity.User;
import com.krishna.lostfoundportal.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.krishna.lostfoundportal.dto.LoginRequest;
import com.krishna.lostfoundportal.dto.LoginResponse;
import com.krishna.lostfoundportal.service.JwtService;

@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    public UserService(UserRepository repository,
                   PasswordEncoder passwordEncoder,
                   JwtService jwtService) {

    this.repository = repository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
}
    public UserDTO registerUser(UserDTO dto) {

        if (repository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already registered.");
        }

        User user = new User();

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());

        // Encrypt the password before saving
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        user.setRole(dto.getRole());

        User savedUser = repository.save(user);

        UserDTO response = new UserDTO();
        response.setId(savedUser.getId());
        response.setName(savedUser.getName());
        response.setEmail(savedUser.getEmail());
        response.setRole(savedUser.getRole());

        // Don't return the password
        response.setPassword(null);

        return response;
    }

    public LoginResponse loginUser(LoginRequest request) {

    User user = repository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password."));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new RuntimeException("Invalid email or password.");
    }

    String token = jwtService.generateToken(user.getEmail());

    return new LoginResponse(
            token,
            "Login Successful",
            user.getRole()
    );
}
public UserDTO getProfile(String email) {

    User user = repository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User not found.")
            );

    UserDTO response = new UserDTO();

    response.setId(user.getId());
    response.setName(user.getName());
    response.setEmail(user.getEmail());
    response.setRole(user.getRole());

    response.setPassword(null);

    return response;
}


public UserDTO updateProfile(
        String email,
        String name
) {

    User user = repository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User not found.")
            );

    if (name == null || name.trim().isEmpty()) {
        throw new RuntimeException("Name cannot be empty.");
    }

    user.setName(name.trim());

    User savedUser = repository.save(user);

    UserDTO response = new UserDTO();

    response.setId(savedUser.getId());
    response.setName(savedUser.getName());
    response.setEmail(savedUser.getEmail());
    response.setRole(savedUser.getRole());

    response.setPassword(null);

    return response;
}
public void changePassword(
        String email,
        String currentPassword,
        String newPassword
) {

    User user = repository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("User not found.")
            );

    if (currentPassword == null ||
            currentPassword.trim().isEmpty()) {
        throw new RuntimeException(
                "Current password is required."
        );
    }

    if (newPassword == null ||
            newPassword.trim().isEmpty()) {
        throw new RuntimeException(
                "New password is required."
        );
    }

    if (newPassword.length() < 6) {
        throw new RuntimeException(
                "New password must contain at least 6 characters."
        );
    }

    if (!passwordEncoder.matches(
            currentPassword,
            user.getPassword()
    )) {
        throw new RuntimeException(
                "Current password is incorrect."
        );
    }

    if (passwordEncoder.matches(
            newPassword,
            user.getPassword()
    )) {
        throw new RuntimeException(
                "New password must be different from your current password."
        );
    }

    user.setPassword(
            passwordEncoder.encode(newPassword)
    );

    repository.save(user);
}
}