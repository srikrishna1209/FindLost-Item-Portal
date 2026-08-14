package com.krishna.lostfoundportal.repository;

import com.krishna.lostfoundportal.entity.ClaimRequest;
import com.krishna.lostfoundportal.entity.LostItem;
import com.krishna.lostfoundportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClaimRequestRepository
        extends JpaRepository<ClaimRequest, Long> {

    long countByStatus(String status);

    List<ClaimRequest> findByUser(User user);

    List<ClaimRequest> findByItem(LostItem item);
}