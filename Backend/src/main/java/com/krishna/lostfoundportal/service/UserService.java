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
}