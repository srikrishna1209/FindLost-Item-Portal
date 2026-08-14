package com.krishna.lostfoundportal.service;

import com.krishna.lostfoundportal.dto.ClaimRequestDTO;
import com.krishna.lostfoundportal.entity.ClaimRequest;
import com.krishna.lostfoundportal.entity.LostItem;
import com.krishna.lostfoundportal.entity.User;
import com.krishna.lostfoundportal.exception.ResourceNotFoundException;
import com.krishna.lostfoundportal.repository.ClaimRequestRepository;
import com.krishna.lostfoundportal.repository.LostItemRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClaimRequestService {

    private final ClaimRequestRepository claimRepository;
    private final LostItemRepository itemRepository;
    private final AuthService authService;

    public ClaimRequestService(
            ClaimRequestRepository claimRepository,
            LostItemRepository itemRepository,
            AuthService authService
    ) {
        this.claimRepository = claimRepository;
        this.itemRepository = itemRepository;
        this.authService = authService;
    }


    // =========================================================
    // CREATE CLAIM
    // =========================================================

    public ClaimRequestDTO createClaim(ClaimRequestDTO dto) {

        User currentUser =
                authService.getCurrentUser();

        LostItem item =
                itemRepository.findById(dto.getItemId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Item not found"
                                )
                        );

        ClaimRequest claim =
                new ClaimRequest();

        claim.setUser(currentUser);

        claim.setItem(item);

        claim.setMessage(dto.getMessage());

        claim.setStatus("PENDING");

        claim.setCreatedAt(
                LocalDateTime.now()
        );

        ClaimRequest saved =
                claimRepository.save(claim);

        return convertToDTO(saved);
    }


    // =========================================================
    // GET MY CLAIMS
    // =========================================================

    public List<ClaimRequestDTO> getMyClaims() {

        User currentUser =
                authService.getCurrentUser();

        return claimRepository
                .findByUser(currentUser)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET CLAIMS FOR MY ITEM
    // =========================================================

    public List<ClaimRequestDTO> getClaimsForItem(
            Long itemId
    ) {

        User currentUser =
                authService.getCurrentUser();

        LostItem item =
                itemRepository.findById(itemId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Item not found"
                                )
                        );


        // SECURITY:
        // Only the person who reported this item
        // can see the claims for it.

        if (
                item.getUser() == null
                || !item.getUser()
                        .getId()
                        .equals(currentUser.getId())
        ) {

            throw new RuntimeException(
                    "You can only view claims for your own items."
            );
        }


        return claimRepository
                .findByItem(item)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // APPROVE / REJECT CLAIM
    // =========================================================

    public ClaimRequestDTO updateClaimStatus(
            Long claimId,
            String status
    ) {

        User currentUser =
                authService.getCurrentUser();

        ClaimRequest claim =
                claimRepository.findById(claimId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Claim request not found"
                                )
                        );


        LostItem item =
                claim.getItem();


        // SECURITY:
        // Only the reporter/owner of the item
        // can approve or reject its claim.

        if (
                item == null
                || item.getUser() == null
                || !item.getUser()
                        .getId()
                        .equals(currentUser.getId())
        ) {

            throw new RuntimeException(
                    "Only the item reporter can review this claim."
            );
        }


        String normalizedStatus =
                status == null
                        ? ""
                        : status.trim().toUpperCase();


        if (
                !normalizedStatus.equals("APPROVED")
                && !normalizedStatus.equals("REJECTED")
        ) {

            throw new RuntimeException(
                    "Status must be APPROVED or REJECTED."
            );
        }


        // Don't allow changing an already completed claim.

        if (!"PENDING".equalsIgnoreCase(
                claim.getStatus()
        )) {

            throw new RuntimeException(
                    "This claim has already been reviewed."
            );
        }


        claim.setStatus(
                normalizedStatus
        );


        ClaimRequest updated =
                claimRepository.save(claim);


        return convertToDTO(updated);
    }


    // =========================================================
    // ADMIN / EXISTING SUPPORT
    // =========================================================

    public List<ClaimRequest> getAllClaims() {

        return claimRepository.findAll();
    }


    // =========================================================
    // DTO CONVERSION
    // =========================================================

    private ClaimRequestDTO convertToDTO(
            ClaimRequest claim
    ) {

        ClaimRequestDTO dto =
                new ClaimRequestDTO();

        dto.setId(
                claim.getId()
        );

        dto.setItemId(
                claim.getItem().getId()
        );

        dto.setMessage(
                claim.getMessage()
        );

        dto.setStatus(
                claim.getStatus()
        );

        return dto;
    }
}