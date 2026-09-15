package com.krishna.lostfoundportal.controller;

import com.krishna.lostfoundportal.dto.ClaimRequestDTO;
import com.krishna.lostfoundportal.service.ClaimRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimRequestController {

    private final ClaimRequestService service;

    public ClaimRequestController(
            ClaimRequestService service
    ) {
        this.service = service;
    }


    // =========================================================
    // CREATE CLAIM
    // POST /api/claims
    // =========================================================

    @PostMapping
    public ClaimRequestDTO createClaim(
            @RequestBody ClaimRequestDTO dto
    ) {

        return service.createClaim(dto);
    }


    // =========================================================
    // MY CLAIMS
    // GET /api/claims/my-claims
    // =========================================================

    @GetMapping("/my-claims")
    public List<ClaimRequestDTO> getMyClaims() {

        return service.getMyClaims();
    }


    // =========================================================
    // CLAIMS FOR MY ITEM
    // GET /api/claims/item/{itemId}
    // =========================================================

    @GetMapping("/item/{itemId}")
    public List<ClaimRequestDTO> getClaimsForItem(
            @PathVariable Long itemId
    ) {

        return service.getClaimsForItem(
                itemId
        );
    }


    // =========================================================
    // APPROVE / REJECT
    // PUT /api/claims/{claimId}/status?status=APPROVED
    // =========================================================

    @PutMapping("/{claimId}/status")
    public ClaimRequestDTO updateClaimStatus(
            @PathVariable Long claimId,
            @RequestParam String status
    ) {

        return service.updateClaimStatus(
                claimId,
                status
        );
    }


    // =========================================================
    // COMPLETE HANDOVER
    // PUT /api/claims/{claimId}/handover-complete
    // =========================================================

    @PutMapping("/{claimId}/handover-complete")
    public ClaimRequestDTO completeHandover(
            @PathVariable Long claimId
    ) {

        return service.completeHandover(
                claimId
        );
    }


    // =========================================================
    // MY RETURNED ITEMS / COMPLETED HANDOVERS
    // GET /api/claims/my-completed
    // =========================================================

    @GetMapping("/my-completed")
    public List<ClaimRequestDTO> getMyCompletedHandovers() {

        return service.getAllCompletedHandovers();
    }
}