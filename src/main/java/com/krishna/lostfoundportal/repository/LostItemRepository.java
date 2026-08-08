package com.krishna.lostfoundportal.repository;

import com.krishna.lostfoundportal.entity.LostItem;
import com.krishna.lostfoundportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LostItemRepository extends JpaRepository<LostItem, Long> {

    // Find by exact item name
    List<LostItem> findByItemName(String itemName);

    // Find by exact location
    List<LostItem> findByLocation(String location);

    // Find all items posted by a user
    List<LostItem> findByUser(User user);

    // Search by item name
    List<LostItem> findByItemNameContainingIgnoreCase(String keyword);

    // Search by location
    List<LostItem> findByLocationContainingIgnoreCase(String keyword);

    // Search by description
    List<LostItem> findByDescriptionContainingIgnoreCase(String keyword);

    // Professional global search
    @Query("""
            SELECT l FROM LostItem l
            WHERE LOWER(l.itemName) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(l.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(l.location) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(l.status) LIKE LOWER(CONCAT('%', :keyword, '%'))
            """)
    List<LostItem> searchItems(@Param("keyword") String keyword);
}