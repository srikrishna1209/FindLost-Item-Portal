package com.krishna.lostfoundportal.controller;

import com.krishna.lostfoundportal.dto.AdminDashboardDTO;
import com.krishna.lostfoundportal.service.AdminDashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    public AdminDashboardController(
            AdminDashboardService adminDashboardService) {

        this.adminDashboardService = adminDashboardService;
    }

    @GetMapping("/stats")
    public AdminDashboardDTO getDashboardStats() {

        return adminDashboardService.getDashboardStats();
    }
}