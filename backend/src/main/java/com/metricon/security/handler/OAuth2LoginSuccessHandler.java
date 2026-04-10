package com.metricon.security.handler;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.oauth2.core.user.OAuth2User;
import com.metricon.user.entity.User;
import com.metricon.user.repository.UserRepository;
import com.metricon.notification.service.NotificationService;
import com.metricon.common.enums.NotificationType;
import com.metricon.common.enums.RoleName;

import java.util.List;

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

        if (authentication.getPrincipal() instanceof OAuth2User oauthUser) {
            String email = oauthUser.getAttribute("email");
            String name = oauthUser.getAttribute("name");

            // 1. Notify the user who just logged in
            notificationService.createNotification(
                    email,
                    "Welcome Back!",
                    "You have successfully logged into the Smart Campus Operations Hub.",
                    NotificationType.INFO
            );

            // 2. Notify all Admins that a user logged in
            List<User> admins = userRepository.findByRoleName(RoleName.ADMIN);
            for (User admin : admins) {
                if (!admin.getEmail().equals(email)) {
                    notificationService.createNotification(
                            admin.getEmail(),
                            "User Login",
                            "User " + name + " (" + email + ") has logged into the system.",
                            NotificationType.INFO
                    );
                }
            }
        }

        response.sendRedirect("http://localhost:5173");
    }
}