package com.krishna.lostfoundportal.controller;

import com.krishna.lostfoundportal.dto.ClaimRequestDTO;
import com.krishna.lostfoundportal.service.ClaimRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimRequestController {

    private final ClaimRequestService service;

    public ClaimRequestController(ClaimRequestService service) {
        this.service = service;
    }

    // Create a Claim Request
    @PostMapping
    public ClaimRequestDTO createClaim(@RequestBody ClaimRequestDTO dto) {
        return service.createClaim(dto);
    }

    // Get Logged-in User Claims
    @GetMapping("/my-claims")
    public List<ClaimRequestDTO> getMyClaims() {
        return service.getMyClaims();
    }
}