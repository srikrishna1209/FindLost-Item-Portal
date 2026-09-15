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

        return convertToDTO(
                saved,
                currentUser
        );
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
                .map(claim ->
                        convertToDTO(
                                claim,
                                currentUser
                        )
                )
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
        // Only the person who reported the item
        // can view its claims.

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
                .map(claim ->
                        convertToDTO(
                                claim,
                                currentUser
                        )
                )
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


        // Don't allow changing an already reviewed claim.

        if (
                !"PENDING".equalsIgnoreCase(
                        claim.getStatus()
                )
        ) {

            throw new RuntimeException(
                    "This claim has already been reviewed."
            );
        }


        claim.setStatus(
                normalizedStatus
        );


        ClaimRequest updated =
                claimRepository.save(claim);


        return convertToDTO(
                updated,
                currentUser
        );
    }


    // =========================================================
    // COMPLETE HANDOVER
    // =========================================================
    //
    // APPROVED
    //      ↓
    // HANDOVER_COMPLETED
    //
    // ITEM
    //      ↓
    // RETURNED
    //
    // The item will no longer appear on:
    // - Lost Items
    // - Found Items
    //
    // It will remain available through:
    // - Returned Items
    // - My Claims
    // =========================================================

    public ClaimRequestDTO completeHandover(
            Long claimId
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

        User claimant =
                claim.getUser();

        User reporter =
                item != null
                        ? item.getUser()
                        : null;


        // =====================================================
        // SECURITY
        // =====================================================

        boolean isClaimant =
                claimant != null
                && claimant.getId()
                        .equals(currentUser.getId());

        boolean isReporter =
                reporter != null
                && reporter.getId()
                        .equals(currentUser.getId());


        if (!isClaimant && !isReporter) {

            throw new RuntimeException(
                    "Only the claimant or item reporter can complete the handover."
            );
        }


        // =====================================================
        // CLAIM MUST BE APPROVED
        // =====================================================

        if (
                !"APPROVED".equalsIgnoreCase(
                        claim.getStatus()
                )
        ) {

            throw new RuntimeException(
                    "Only an approved claim can be marked as handover completed."
            );
        }


        // =====================================================
        // COMPLETE CLAIM
        // =====================================================

        claim.setStatus(
                "HANDOVER_COMPLETED"
        );


        // =====================================================
        // MARK ITEM AS RETURNED
        // =====================================================

        if (item != null) {

            item.setStatus(
                    "RETURNED"
            );

            itemRepository.save(item);
        }


        // =====================================================
        // SAVE CLAIM
        // =====================================================

        ClaimRequest updated =
                claimRepository.save(claim);


        return convertToDTO(
                updated,
                currentUser
        );
    }


    // =========================================================
    // GET ALL RETURNED / COMPLETED ITEMS
    // =========================================================
    //
    // PUBLIC RETURNED ITEMS HISTORY
    //
    // Shows EVERY successfully completed handover,
    // regardless of which user is viewing the page.
    //
    // Contact information is NOT exposed here.
    // =========================================================

    public List<ClaimRequestDTO> getAllCompletedHandovers() {

        List<ClaimRequest> completedClaims =
                claimRepository.findAll()
                        .stream()
                        .filter(claim ->
                                "HANDOVER_COMPLETED"
                                        .equalsIgnoreCase(
                                                claim.getStatus()
                                        )
                        )
                        .collect(Collectors.toList());


        return completedClaims
                .stream()
                .map(claim ->
                        convertToDTO(
                                claim,
                                null
                        )
                )
                .collect(Collectors.toList());
    }


    // =========================================================
    // ADMIN / EXISTING SUPPORT
    // =========================================================

    public List<ClaimRequest> getAllClaims() {

        return claimRepository.findAll();
    }


    // =========================================================
    // DTO CONVERSION + CONTACT SECURITY
    // =========================================================

    private ClaimRequestDTO convertToDTO(
            ClaimRequest claim,
            User currentUser
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


        /*
         * CONTACT INFORMATION
         *
         * Contact information is deliberately NOT returned
         * while the claim is PENDING or REJECTED.
         *
         * It is returned after APPROVED or HANDOVER_COMPLETED
         * only when the logged-in user is either:
         * - the claimant
         * - the reporter
         *
         * For the public Returned Items page,
         * currentUser is null, so no contact information
         * is exposed.
         */

        if (
                "APPROVED".equalsIgnoreCase(
                        claim.getStatus()
                )
                ||
                "HANDOVER_COMPLETED".equalsIgnoreCase(
                        claim.getStatus()
                )
        ) {

            User claimant =
                    claim.getUser();

            LostItem item =
                    claim.getItem();

            User reporter =
                    item != null
                            ? item.getUser()
                            : null;


            if (
                    claimant != null
                    && reporter != null
                    && currentUser != null
            ) {

                // Claimant sees reporter contact information.

                if (
                        currentUser.getId()
                                .equals(claimant.getId())
                ) {

                    dto.setOtherUserName(
                            reporter.getName()
                    );

                    dto.setOtherUserEmail(
                            reporter.getEmail()
                    );
                }


                // Reporter sees claimant contact information.

                else if (
                        currentUser.getId()
                                .equals(reporter.getId())
                ) {

                    dto.setOtherUserName(
                            claimant.getName()
                    );

                    dto.setOtherUserEmail(
                            claimant.getEmail()
                    );
                }
            }
        }


        return dto;
    }
}