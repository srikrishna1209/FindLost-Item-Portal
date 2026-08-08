package com.krishna.lostfoundportal.controller;

import com.krishna.lostfoundportal.dto.AdminClaimDTO;
import com.krishna.lostfoundportal.service.AdminClaimService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/claims")
public class AdminClaimController {

    private final AdminClaimService adminClaimService;

    public AdminClaimController(AdminClaimService adminClaimService) {
        this.adminClaimService = adminClaimService;
    }

    @GetMapping
    public List<AdminClaimDTO> getAllClaims() {
        return adminClaimService.getAllClaims();
    }

    @PutMapping("/{id}/approve")
    public AdminClaimDTO approveClaim(@PathVariable Long id) {
        return adminClaimService.approveClaim(id);
    }

    @PutMapping("/{id}/reject")
    public AdminClaimDTO rejectClaim(@PathVariable Long id) {
        return adminClaimService.rejectClaim(id);
    }
}