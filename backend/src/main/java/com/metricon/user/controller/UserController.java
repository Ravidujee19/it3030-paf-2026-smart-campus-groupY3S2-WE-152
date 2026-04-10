package com.metricon.user.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.metricon.user.dto.UserMeResponse;
import com.metricon.user.dto.UserProfileUpdateRequest;
import com.metricon.user.dto.UserRoleUpdateRequest;
import com.metricon.user.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserMeResponse getMe(@AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        return userService.getCurrentUser(email);
    }
    
    @PutMapping("/me")
    public UserMeResponse updateMe(@AuthenticationPrincipal OAuth2User principal, @RequestBody UserProfileUpdateRequest request) {
    	String email = principal.getAttribute("email");
    	Long userId = userService.getCurrentUser(email).getId();
    	return userService.updateUserProfile(userId, request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<UserMeResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/role")
    public String updateUserRole(@PathVariable Long id, @RequestBody UserRoleUpdateRequest request) {
        userService.updateUserRole(id, request.getRole());
        return "User role updated successfully";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "User deleted successfully";
    }
}