package com.metricon.security.handler;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        response.sendRedirect("http://localhost:5173");
    }
}

// package com.metricon.security.handler;

// import java.io.IOException;

// import org.springframework.security.core.Authentication;
// import org.springframework.security.oauth2.core.user.OAuth2User;
// import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
// import org.springframework.stereotype.Component;

// import com.metricon.common.enums.RoleName;
// import com.metricon.user.entity.Role;
// import com.metricon.user.entity.User;
// import com.metricon.user.repository.RoleRepository;
// import com.metricon.user.repository.UserRepository;

// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;

// @Component
// public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

//     private final UserRepository userRepository;
//     private final RoleRepository roleRepository;

//     public OAuth2LoginSuccessHandler(UserRepository userRepository,
//                                      RoleRepository roleRepository) {
//         this.userRepository = userRepository;
//         this.roleRepository = roleRepository;
//     }

//     @Override
//     public void onAuthenticationSuccess(HttpServletRequest request,
//                                         HttpServletResponse response,
//                                         Authentication authentication) throws IOException, ServletException {

//         OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
//         String email = oAuth2User.getAttribute("email");
//         String name = oAuth2User.getAttribute("name");
//         String picture = oAuth2User.getAttribute("picture");

//         userRepository.findByEmail(email).orElseGet(() -> {
//             Role defaultRole = roleRepository.findByName(RoleName.STUDENT)
//                     .orElseThrow(() -> new RuntimeException("Default role not found"));

//             User user = new User();
//             user.setEmail(email);
//             user.setName(name);
//             user.setProfilePicture(picture);
//             user.setRole(defaultRole);
//             return userRepository.save(user);
//         });

//         response.sendRedirect("http://localhost:5173");
//     }
// }