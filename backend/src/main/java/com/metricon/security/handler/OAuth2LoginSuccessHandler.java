package com.metricon.security.handler;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.metricon.common.enums.NotificationType;
import com.metricon.common.enums.RoleName;
import com.metricon.notification.service.NotificationService;
import com.metricon.user.entity.Role;
import com.metricon.user.entity.User;
import com.metricon.user.repository.RoleRepository;
import com.metricon.user.repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final NotificationService notificationService;

    public OAuth2LoginSuccessHandler(UserRepository userRepository,
                                     RoleRepository roleRepository,
                                     NotificationService notificationService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.notificationService = notificationService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            Role defaultRole = roleRepository.findByName(RoleName.STUDENT)
                    .orElseThrow(() -> new RuntimeException("Default role not found"));

            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setProfilePicture(picture);
            newUser.setRole(defaultRole);
            return userRepository.save(newUser);
        });

        notificationService.createNotification(
                user.getEmail(),
                "Welcome back",
                String.format("Hello %s! You have successfully logged into the Smart Campus Hub.", user.getName()),
                NotificationType.SUCCESS
        );

        RoleName userRole = user.getRole().getName();
        String alertMsg = String.format("User Login: %s (%s) is now online.", 
                user.getName(), 
                userRole.name());

        if (userRole == RoleName.ADMIN) {
            notificationService.createNotificationForRole(RoleName.ADMIN, "Admin Access Alert", alertMsg, NotificationType.INFO);
            notificationService.createNotificationForRole(RoleName.STAFF, "Admin Access Alert", alertMsg, NotificationType.INFO);
            
        } else if (userRole == RoleName.STAFF || userRole == RoleName.TECHNICIAN) {
            notificationService.createNotificationForRole(RoleName.ADMIN, "Staff Access Alert", alertMsg, NotificationType.INFO);
        }

        response.sendRedirect("http://localhost:5173");
    }
}