package com.krishna.lostfoundportal.service;

import com.krishna.lostfoundportal.dto.LostItemDTO;
import com.krishna.lostfoundportal.entity.LostItem;
import com.krishna.lostfoundportal.entity.User;
import com.krishna.lostfoundportal.exception.ResourceNotFoundException;
import com.krishna.lostfoundportal.repository.LostItemRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LostItemService {

    private final LostItemRepository repository;
    private final AuthService authService;
    private final FileStorageService fileStorageService;

    public LostItemService(LostItemRepository repository,
                           AuthService authService,
                           FileStorageService fileStorageService) {

        this.repository = repository;
        this.authService = authService;
        this.fileStorageService = fileStorageService;
    }

    // Create with Image Upload
    public LostItemDTO saveItem(LostItemDTO dto, MultipartFile image) throws IOException {

        LostItem item = LostItemMapper.toEntity(dto);

        // Get currently logged-in user
        User currentUser = authService.getCurrentUser();

        // Set owner
        item.setUser(currentUser);

        // Save image
        if (image != null && !image.isEmpty()) {
            String fileName = fileStorageService.saveFile(image);
            item.setImageUrl(fileName);
        }

        LostItem savedItem = repository.save(item);

        return LostItemMapper.toDTO(savedItem);
    }

    // Read All
    public List<LostItemDTO> getAllItems() {

        return repository.findAll()
                .stream()
                .map(LostItemMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Get My Items
    public List<LostItemDTO> getMyItems() {

        User currentUser = authService.getCurrentUser();

        return repository.findByUser(currentUser)
                .stream()
                .map(LostItemMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Pagination
    public Page<LostItemDTO> getItemsByPage(int page, int size) {

        Page<LostItem> items =
                repository.findAll(PageRequest.of(page, size));

        return items.map(LostItemMapper::toDTO);
    }

    // Sorting
    public List<LostItemDTO> getSortedItems(String field, String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(field).descending()
                : Sort.by(field).ascending();

        return repository.findAll(sort)
                .stream()
                .map(LostItemMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Read By Id
    public LostItemDTO getItemById(Long id) {

        LostItem item = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Item not found with id: " + id));

        return LostItemMapper.toDTO(item);
    }

    // Update
    public LostItemDTO updateItem(Long id, LostItemDTO dto) {

        LostItem existingItem = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Item not found with id: " + id));

        User currentUser = authService.getCurrentUser();

        if (!existingItem.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can update only your own items.");
        }

        existingItem.setItemName(dto.getItemName());
        existingItem.setDescription(dto.getDescription());
        existingItem.setLocation(dto.getLocation());
        existingItem.setStatus(dto.getStatus());

        LostItem updated = repository.save(existingItem);

        return LostItemMapper.toDTO(updated);
    }

    // Delete
    public void deleteItem(Long id) {

        LostItem existingItem = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Item not found with id: " + id));

        User currentUser = authService.getCurrentUser();

        if (!existingItem.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can delete only your own items.");
        }

        repository.delete(existingItem);
    }

    // Search by Item Name
    public List<LostItemDTO> searchByItemName(String itemName) {

        return repository.findByItemName(itemName)
                .stream()
                .map(LostItemMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Search by Location
    public List<LostItemDTO> searchByLocation(String location) {

        return repository.findByLocation(location)
                .stream()
                .map(LostItemMapper::toDTO)
                .collect(Collectors.toList());
    }
    // Global Search
public List<LostItemDTO> searchItems(String keyword) {

    return repository.searchItems(keyword)
            .stream()
            .map(LostItemMapper::toDTO)
            .collect(Collectors.toList());
}
}