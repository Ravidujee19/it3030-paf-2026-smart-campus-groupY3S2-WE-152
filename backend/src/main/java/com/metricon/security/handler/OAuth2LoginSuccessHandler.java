package com.metricon.security.handler;

import java.io.IOException;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.metricon.common.enums.NotificationType;
import com.metricon.common.enums.RoleName;
import com.metricon.notification.service.NotificationService;
import com.metricon.user.entity.User;
import com.metricon.user.repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public OAuth2LoginSuccessHandler(UserRepository userRepository, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        if (email == null) {
            email = authentication.getName();
        }
        
        final String userEmail = email;
        userRepository.findByEmail(userEmail).ifPresent(user -> {
            RoleName roleName = user.getRole().getName();
            
            // Self notification
            notificationService.createNotification(userEmail, "Login Successful", "Welcome back!", NotificationType.SUCCESS);
            
            // Broadcast mappings
            if (roleName == RoleName.STUDENT) {
                notificationService.notifyRoles(List.of(RoleName.STAFF, RoleName.ADMIN), "Student Logged In", "Student " + user.getName() + " has logged in.", NotificationType.INFO);
            } else if (roleName == RoleName.STAFF || roleName == RoleName.TECHNICIAN) {
                notificationService.notifyRoles(List.of(RoleName.STAFF, RoleName.ADMIN, RoleName.TECHNICIAN), "Staff/Technician Logged In", user.getName() + " has logged in.", NotificationType.INFO);
            } else if (roleName == RoleName.ADMIN) {
                notificationService.notifyRoles(List.of(RoleName.ADMIN), "Admin Logged In", "Admin " + user.getName() + " has logged in.", NotificationType.INFO);
            }
        });

        response.sendRedirect("http://localhost:5173");
    }
}