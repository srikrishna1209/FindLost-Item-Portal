package com.krishna.lostfoundportal.controller;

import com.krishna.lostfoundportal.dto.AdminUserDTO;
import com.krishna.lostfoundportal.service.AdminUserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AdminUserService service;


    public AdminUserController(
            AdminUserService service
    ) {
        this.service = service;
    }


    @GetMapping
    public List<AdminUserDTO> getAllUsers() {

        return service.getAllUsers();
    }


    @GetMapping("/stats")
    public Map<String, Long> getStats() {

        return Map.of(
                "total",
                service.getTotalUsers(),

                "admins",
                service.getAdminCount(),

                "users",
                service.getUserCount()
        );
    }
}