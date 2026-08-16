package com.krishna.lostfoundportal.controller;

import com.krishna.lostfoundportal.dto.AdminContactMessageDTO;
import com.krishna.lostfoundportal.service.AdminContactMessageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/contact-messages")
public class AdminContactMessageController {

    private final AdminContactMessageService service;


    public AdminContactMessageController(
            AdminContactMessageService service
    ) {
        this.service = service;
    }


    @GetMapping
    public List<AdminContactMessageDTO> getAllMessages() {

        return service.getAllMessages();
    }


    @GetMapping("/stats")
    public Map<String, Long> getStats() {

        return Map.of(
                "new", service.getNewCount(),
                "read", service.getReadCount(),
                "resolved", service.getResolvedCount()
        );
    }


    @PutMapping("/{id}/status")
    public AdminContactMessageDTO updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {

        return service.updateStatus(
                id,
                status
        );
    }
}