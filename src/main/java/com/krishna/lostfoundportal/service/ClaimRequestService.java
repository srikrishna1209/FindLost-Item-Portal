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
            AuthService authService) {

        this.claimRepository = claimRepository;
        this.itemRepository = itemRepository;
        this.authService = authService;
    }

    // Create Claim Request
    public ClaimRequestDTO createClaim(ClaimRequestDTO dto) {

        User currentUser = authService.getCurrentUser();

        LostItem item = itemRepository.findById(dto.getItemId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Item not found"));

        ClaimRequest claim = new ClaimRequest();

        claim.setUser(currentUser);
        claim.setItem(item);
        claim.setMessage(dto.getMessage());
        claim.setStatus("PENDING");
        claim.setCreatedAt(LocalDateTime.now());

        ClaimRequest saved = claimRepository.save(claim);

        return convertToDTO(saved);
    }

    // Get My Claims
    public List<ClaimRequestDTO> getMyClaims() {

        User currentUser = authService.getCurrentUser();

        return claimRepository.findByUser(currentUser)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Admin - Get All Claims
    public List<ClaimRequest> getAllClaims() {

        return claimRepository.findAll();
    }

    // Convert Entity to DTO
    private ClaimRequestDTO convertToDTO(ClaimRequest claim) {

        ClaimRequestDTO dto = new ClaimRequestDTO();

        dto.setId(claim.getId());
        dto.setItemId(claim.getItem().getId());
        dto.setMessage(claim.getMessage());
        dto.setStatus(claim.getStatus());

        return dto;
    }
}