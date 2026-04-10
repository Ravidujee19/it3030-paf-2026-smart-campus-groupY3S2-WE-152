package com.metricon.user.service;

import java.util.List;

import com.metricon.user.dto.UserMeResponse;
import com.metricon.user.entity.User;

public interface UserService {
    User findByEmail(String email);
    UserMeResponse getCurrentUser(String email);
    List<UserMeResponse> getAllUsers();
    void updateUserRole(Long userId, String roleName);
    void deleteUser(Long userId);

    UserMeResponse updateUserProfile(Long userId, com.metricon.user.dto.UserProfileUpdateRequest request);
}