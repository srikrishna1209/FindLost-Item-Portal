package com.krishna.lostfoundportal.controller;

import com.krishna.lostfoundportal.dto.ContactMessageDTO;
import com.krishna.lostfoundportal.service.ContactMessageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactMessageController {

    private final ContactMessageService service;


    public ContactMessageController(
            ContactMessageService service
    ) {
        this.service = service;
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactMessageDTO submitMessage(
            @Valid @RequestBody ContactMessageDTO dto
    ) {

        return service.saveMessage(dto);
    }
}