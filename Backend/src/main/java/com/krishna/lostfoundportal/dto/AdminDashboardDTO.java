package com.krishna.lostfoundportal.dto;

public class AdminDashboardDTO {

    private long totalUsers;
    private long totalItems;
    private long pendingClaims;
    private long approvedClaims;
    private long rejectedClaims;

    public AdminDashboardDTO() {
    }

    public AdminDashboardDTO(
            long totalUsers,
            long totalItems,
            long pendingClaims,
            long approvedClaims,
            long rejectedClaims) {

        this.totalUsers = totalUsers;
        this.totalItems = totalItems;
        this.pendingClaims = pendingClaims;
        this.approvedClaims = approvedClaims;
        this.rejectedClaims = rejectedClaims;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(long totalItems) {
        this.totalItems = totalItems;
    }

    public long getPendingClaims() {
        return pendingClaims;
    }

    public void setPendingClaims(long pendingClaims) {
        this.pendingClaims = pendingClaims;
    }

    public long getApprovedClaims() {
        return approvedClaims;
    }

    public void setApprovedClaims(long approvedClaims) {
        this.approvedClaims = approvedClaims;
    }

    public long getRejectedClaims() {
        return rejectedClaims;
    }

    public void setRejectedClaims(long rejectedClaims) {
        this.rejectedClaims = rejectedClaims;
    }
}