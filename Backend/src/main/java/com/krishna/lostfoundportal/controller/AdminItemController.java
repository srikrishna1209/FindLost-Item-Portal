package com.krishna.lostfoundportal.controller;

import com.krishna.lostfoundportal.dto.AdminItemDTO;
import com.krishna.lostfoundportal.service.AdminItemService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/items")
public class AdminItemController {

    private final AdminItemService service;


    public AdminItemController(
            AdminItemService service
    ) {
        this.service = service;
    }


    @GetMapping
    public List<AdminItemDTO> getAllItems() {

        return service.getAllItems();
    }
}