package com.krishna.lostfoundportal.controller;
import java.util.Map;
import org.springframework.security.core.Authentication;
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
@GetMapping("/profile")
public UserDTO getProfile(
        Authentication authentication
) {

    return service.getProfile(
            authentication.getName()
    );
}


@PutMapping("/profile")
public UserDTO updateProfile(
        Authentication authentication,
        @RequestBody Map<String, String> request
) {

    String name = request.get("name");

    return service.updateProfile(
            authentication.getName(),
            name
    );
}
@PutMapping("/password")
public Map<String, String> changePassword(
        Authentication authentication,
        @RequestBody Map<String, String> request
) {

    service.changePassword(
            authentication.getName(),
            request.get("currentPassword"),
            request.get("newPassword")
    );

    return Map.of(
            "message",
            "Password changed successfully."
    );
}
}