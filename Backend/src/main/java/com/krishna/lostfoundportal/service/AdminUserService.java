package com.krishna.lostfoundportal.service;

import com.krishna.lostfoundportal.dto.AdminUserDTO;
import com.krishna.lostfoundportal.entity.User;
import com.krishna.lostfoundportal.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminUserService {

    private final UserRepository repository;


    public AdminUserService(
            UserRepository repository
    ) {
        this.repository = repository;
    }


    public List<AdminUserDTO> getAllUsers() {

        return repository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    public long getTotalUsers() {
        return repository.count();
    }


    public long getAdminCount() {

        return repository.findAll()
                .stream()
                .filter(user ->
                        "ADMIN".equalsIgnoreCase(
                                user.getRole()
                        )
                )
                .count();
    }


    public long getUserCount() {

        return repository.findAll()
                .stream()
                .filter(user ->
                        "USER".equalsIgnoreCase(
                                user.getRole()
                        )
                )
                .count();
    }


    private AdminUserDTO convertToDTO(
            User user
    ) {

        AdminUserDTO dto =
                new AdminUserDTO();

        dto.setId(user.getId());

        dto.setName(user.getName());

        dto.setEmail(user.getEmail());

        dto.setRole(user.getRole());

        return dto;
    }
}