package com.krishna.lostfoundportal.service;

import com.krishna.lostfoundportal.dto.ContactMessageDTO;
import com.krishna.lostfoundportal.entity.ContactMessage;
import com.krishna.lostfoundportal.repository.ContactMessageRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ContactMessageService {

    private final ContactMessageRepository repository;


    public ContactMessageService(
            ContactMessageRepository repository
    ) {
        this.repository = repository;
    }


    public ContactMessageDTO saveMessage(
            ContactMessageDTO dto
    ) {

        ContactMessage contactMessage =
                new ContactMessage();

        contactMessage.setName(
                dto.getName().trim()
        );

        contactMessage.setEmail(
                dto.getEmail().trim()
        );

        contactMessage.setSubject(
                dto.getSubject() == null
                        ? ""
                        : dto.getSubject().trim()
        );

        contactMessage.setMessage(
                dto.getMessage().trim()
        );

        contactMessage.setStatus("NEW");

        contactMessage.setCreatedAt(
                LocalDateTime.now()
        );


        ContactMessage saved =
                repository.save(contactMessage);


        return convertToDTO(saved);
    }


    private ContactMessageDTO convertToDTO(
            ContactMessage entity
    ) {

        ContactMessageDTO dto =
                new ContactMessageDTO();

        dto.setId(entity.getId());

        dto.setName(entity.getName());

        dto.setEmail(entity.getEmail());

        dto.setSubject(entity.getSubject());

        dto.setMessage(entity.getMessage());

        return dto;
    }
}