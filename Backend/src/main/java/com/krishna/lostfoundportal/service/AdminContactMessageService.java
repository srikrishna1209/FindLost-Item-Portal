package com.krishna.lostfoundportal.service;

import com.krishna.lostfoundportal.dto.AdminContactMessageDTO;
import com.krishna.lostfoundportal.entity.ContactMessage;
import com.krishna.lostfoundportal.exception.ResourceNotFoundException;
import com.krishna.lostfoundportal.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminContactMessageService {

    private final ContactMessageRepository repository;


    public AdminContactMessageService(
            ContactMessageRepository repository
    ) {
        this.repository = repository;
    }


    public List<AdminContactMessageDTO> getAllMessages() {

        return repository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    public AdminContactMessageDTO updateStatus(
            Long id,
            String status
    ) {

        ContactMessage message =
                repository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Contact message not found"
                                )
                        );


        String normalizedStatus =
                status == null
                        ? ""
                        : status.trim().toUpperCase();


        if (
                !normalizedStatus.equals("NEW")
                && !normalizedStatus.equals("READ")
                && !normalizedStatus.equals("RESOLVED")
        ) {

            throw new RuntimeException(
                    "Status must be NEW, READ or RESOLVED."
            );
        }


        message.setStatus(
                normalizedStatus
        );


        ContactMessage saved =
                repository.save(message);


        return convertToDTO(saved);
    }


    public long getNewCount() {
        return repository.countByStatus("NEW");
    }


    public long getReadCount() {
        return repository.countByStatus("READ");
    }


    public long getResolvedCount() {
        return repository.countByStatus("RESOLVED");
    }


    private AdminContactMessageDTO convertToDTO(
            ContactMessage entity
    ) {

        AdminContactMessageDTO dto =
                new AdminContactMessageDTO();

        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setEmail(entity.getEmail());
        dto.setSubject(entity.getSubject());
        dto.setMessage(entity.getMessage());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());

        return dto;
    }
}