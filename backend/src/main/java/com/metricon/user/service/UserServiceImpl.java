package com.metricon.user.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.metricon.common.enums.RoleName;
import com.metricon.user.dto.UserMeResponse;
import com.metricon.user.entity.Role;
import com.metricon.user.entity.User;
import com.metricon.user.repository.RoleRepository;
import com.metricon.user.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public UserMeResponse getCurrentUser(String email) {
        User user = findByEmail(email);
        return new UserMeResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().getName().name(),
                user.getProfilePicture()
        );
    }

    @Override
    public List<UserMeResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserMeResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole().getName().name(),
                        user.getProfilePicture()
                ))
                .toList();
    }

    @Override
    public void updateUserRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role role = roleRepository.findByName(RoleName.valueOf(roleName.toUpperCase()))
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.setRole(role);
        userRepository.save(user);
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);
    }
}