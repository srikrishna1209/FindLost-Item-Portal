package com.krishna.lostfoundportal.repository;

import com.krishna.lostfoundportal.entity.ClaimRequest;
import com.krishna.lostfoundportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClaimRequestRepository
        extends JpaRepository<ClaimRequest, Long> {

    long countByStatus(String status);

    java.util.List<ClaimRequest> findByUser(User user);
}