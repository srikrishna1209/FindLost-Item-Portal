package com.krishna.lostfoundportal.controller;

import com.krishna.lostfoundportal.entity.ClaimRequest;
import com.krishna.lostfoundportal.service.ClaimRequestService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ClaimRequestService claimRequestService;

    public AdminController(ClaimRequestService claimRequestService) {
        this.claimRequestService = claimRequestService;
    }

    // Test admin access
    @GetMapping("/dashboard")
    public String dashboard() {
        return "Welcome Admin!";
    }

    // View all claim requests
    
}