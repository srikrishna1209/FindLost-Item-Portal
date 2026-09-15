package com.krishna.lostfoundportal.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class FileStorageService {

    private final Cloudinary cloudinary;

    public FileStorageService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret
    ) {

        this.cloudinary = new Cloudinary(
                ObjectUtils.asMap(
                        "cloud_name", cloudName,
                        "api_key", apiKey,
                        "api_secret", apiSecret,
                        "secure", true
                )
        );
    }

    public String saveFile(MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            return null;
        }

        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "findlost/items",
                        "resource_type", "image"
                )
        );

        Object secureUrl = result.get("secure_url");

        if (secureUrl == null) {
            throw new IOException("Cloudinary upload succeeded but no secure URL was returned.");
        }

        return secureUrl.toString();
    }
}