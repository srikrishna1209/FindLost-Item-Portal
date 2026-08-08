package com.krishna.lostfoundportal.service;

import com.krishna.lostfoundportal.dto.AdminClaimDTO;
import com.krishna.lostfoundportal.entity.ClaimRequest;
import com.krishna.lostfoundportal.entity.LostItem;
import com.krishna.lostfoundportal.exception.ResourceNotFoundException;
import com.krishna.lostfoundportal.repository.ClaimRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminClaimService {

    private final ClaimRequestRepository claimRepository;

    public AdminClaimService(ClaimRequestRepository claimRepository) {
        this.claimRepository = claimRepository;
    }

    public List<AdminClaimDTO> getAllClaims() {

        return claimRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AdminClaimDTO approveClaim(Long id) {

        ClaimRequest claim = claimRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Claim not found"));

        claim.setStatus("APPROVED");

        LostItem item = claim.getItem();
        item.setStatus("CLAIMED");

        ClaimRequest saved = claimRepository.save(claim);

        return convertToDTO(saved);
    }

    public AdminClaimDTO rejectClaim(Long id) {

        ClaimRequest claim = claimRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Claim not found"));

        claim.setStatus("REJECTED");

        ClaimRequest saved = claimRepository.save(claim);

        return convertToDTO(saved);
    }

    private AdminClaimDTO convertToDTO(ClaimRequest claim) {

        AdminClaimDTO dto = new AdminClaimDTO();

        dto.setId(claim.getId());

        dto.setUserId(claim.getUser().getId());
        dto.setUserName(claim.getUser().getName());
        dto.setUserEmail(claim.getUser().getEmail());

        dto.setItemId(claim.getItem().getId());
        dto.setItemName(claim.getItem().getItemName());

        dto.setMessage(claim.getMessage());
        dto.setStatus(claim.getStatus());
        dto.setCreatedAt(claim.getCreatedAt());

        return dto;
    }
}