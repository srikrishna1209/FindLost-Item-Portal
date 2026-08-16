package com.krishna.lostfoundportal.service;

import com.krishna.lostfoundportal.dto.AdminItemDTO;
import com.krishna.lostfoundportal.entity.LostItem;
import com.krishna.lostfoundportal.repository.LostItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminItemService {

    private final LostItemRepository repository;


    public AdminItemService(
            LostItemRepository repository
    ) {
        this.repository = repository;
    }


    public List<AdminItemDTO> getAllItems() {

        return repository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    private AdminItemDTO convertToDTO(
            LostItem item
    ) {

        AdminItemDTO dto =
                new AdminItemDTO();


        dto.setId(item.getId());

        dto.setItemName(item.getItemName());

        dto.setDescription(item.getDescription());

        dto.setLocation(item.getLocation());

        dto.setStatus(item.getStatus());

        dto.setImageUrl(item.getImageUrl());


        if (item.getUser() != null) {

            dto.setUserId(
                    item.getUser().getId()
            );

            dto.setUserName(
                    item.getUser().getName()
            );

            dto.setUserEmail(
                    item.getUser().getEmail()
            );
        }


        return dto;
    }
}