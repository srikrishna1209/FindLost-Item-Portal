package com.krishna.lostfoundportal.controller;

import com.krishna.lostfoundportal.dto.LostItemDTO;
import com.krishna.lostfoundportal.service.LostItemService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/items")
public class LostItemController {

    private final LostItemService service;

    public LostItemController(LostItemService service) {
        this.service = service;
    }

    // Create Item with Image Upload
    @PostMapping(consumes = {"multipart/form-data"})
    public LostItemDTO addItem(

            @RequestParam String itemName,
            @RequestParam String description,
            @RequestParam String location,
            @RequestParam String status,
            @RequestParam(required = false) MultipartFile image

    ) throws IOException {

        LostItemDTO dto = new LostItemDTO();

        dto.setItemName(itemName);
        dto.setDescription(description);
        dto.setLocation(location);
        dto.setStatus(status);

        return service.saveItem(dto, image);
    }

    // Read All
    @GetMapping
    public List<LostItemDTO> getAllItems() {
        return service.getAllItems();
    }

    // Get My Items
    @GetMapping("/my-items")
    public List<LostItemDTO> getMyItems() {
        return service.getMyItems();
    }

    // Pagination
    @GetMapping("/page")
    public Page<LostItemDTO> getItemsByPage(
            @RequestParam int page,
            @RequestParam int size) {

        return service.getItemsByPage(page, size);
    }

    // Sorting
    @GetMapping("/sort")
    public List<LostItemDTO> getSortedItems(
            @RequestParam String field,
            @RequestParam(defaultValue = "asc") String direction) {

        return service.getSortedItems(field, direction);
    }

    // Read One
    @GetMapping("/{id}")
    public LostItemDTO getItemById(@PathVariable Long id) {
        return service.getItemById(id);
    }

    // Update
    @PutMapping("/{id}")
    public LostItemDTO updateItem(
            @PathVariable Long id,
            @Valid @RequestBody LostItemDTO dto) {

        return service.updateItem(id, dto);
    }

    // Delete
    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        service.deleteItem(id);
    }

    // Search by Item Name
    @GetMapping("/search/name")
    public List<LostItemDTO> searchByItemName(@RequestParam String itemName) {
        return service.searchByItemName(itemName);
    }

    // Search by Location
    @GetMapping("/search/location")
    public List<LostItemDTO> searchByLocation(@RequestParam String location) {
        return service.searchByLocation(location);
    }
    // Global Search
@GetMapping("/search")
public List<LostItemDTO> searchItems(@RequestParam String keyword) {
    return service.searchItems(keyword);
}
}