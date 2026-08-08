package com.krishna.lostfoundportal.service;

import com.krishna.lostfoundportal.dto.AdminDashboardDTO;
import com.krishna.lostfoundportal.repository.ClaimRequestRepository;
import com.krishna.lostfoundportal.repository.LostItemRepository;
import com.krishna.lostfoundportal.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final LostItemRepository lostItemRepository;
    private final ClaimRequestRepository claimRequestRepository;

    public AdminDashboardService(
            UserRepository userRepository,
            LostItemRepository lostItemRepository,
            ClaimRequestRepository claimRequestRepository) {

        this.userRepository = userRepository;
        this.lostItemRepository = lostItemRepository;
        this.claimRequestRepository = claimRequestRepository;
    }

    public AdminDashboardDTO getDashboardStats() {

        long totalUsers = userRepository.count();

        long totalItems = lostItemRepository.count();

        long pendingClaims =
                claimRequestRepository.countByStatus("PENDING");

        long approvedClaims =
                claimRequestRepository.countByStatus("APPROVED");

        long rejectedClaims =
                claimRequestRepository.countByStatus("REJECTED");

        return new AdminDashboardDTO(
                totalUsers,
                totalItems,
                pendingClaims,
                approvedClaims,
                rejectedClaims
        );
    }
}