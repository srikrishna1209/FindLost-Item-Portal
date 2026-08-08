package com.krishna.lostfoundportal.controller;

import com.krishna.lostfoundportal.dto.UserDTO;
import com.krishna.lostfoundportal.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.krishna.lostfoundportal.dto.LoginRequest;
import com.krishna.lostfoundportal.dto.LoginResponse;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public UserDTO registerUser(@Valid @RequestBody UserDTO dto) {
        return service.registerUser(dto);
    }
    @PostMapping("/login")
public LoginResponse login(@RequestBody LoginRequest request) {
    return service.loginUser(request);
}
}