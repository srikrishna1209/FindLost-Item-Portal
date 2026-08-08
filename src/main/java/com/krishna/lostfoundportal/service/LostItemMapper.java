package com.krishna.lostfoundportal.service;

import com.krishna.lostfoundportal.dto.LostItemDTO;
import com.krishna.lostfoundportal.entity.LostItem;

public class LostItemMapper {

    // Entity -> DTO
    public static LostItemDTO toDTO(LostItem item) {

        LostItemDTO dto = new LostItemDTO();

        dto.setId(item.getId());
        dto.setItemName(item.getItemName());
        dto.setDescription(item.getDescription());
        dto.setLocation(item.getLocation());
        dto.setStatus(item.getStatus());
        dto.setImageUrl(item.getImageUrl());

        return dto;
    }

    // DTO -> Entity
    public static LostItem toEntity(LostItemDTO dto) {

        LostItem item = new LostItem();

        item.setId(dto.getId());
        item.setItemName(dto.getItemName());
        item.setDescription(dto.getDescription());
        item.setLocation(dto.getLocation());
        item.setStatus(dto.getStatus());
        item.setImageUrl(dto.getImageUrl());

        return item;
    }
}