package com.metricon.security.services;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.metricon.common.enums.RoleName;
import com.metricon.user.entity.Role;
import com.metricon.user.entity.User;
import com.metricon.user.repository.RoleRepository;
import com.metricon.user.repository.UserRepository;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public CustomOAuth2UserService(UserRepository userRepository,
                                   RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = new DefaultOAuth2UserService().loadUser(userRequest);

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");

        User user = userRepository.findByEmail(email).orElse(null);

    if (user == null) {
        Role defaultRole = roleRepository.findByName(RoleName.PENDING)
            .orElseThrow(() -> new RuntimeException("Default role not found"));

        user = new User();
        user.setEmail(email);
        user.setName(name);
        user.setProfilePicture(picture);
        user.setRole(defaultRole);

        user = userRepository.save(user); // explicitly save
    }

        String roleName = user.getRole().getName().name();

        return new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_" + roleName)),
                Map.copyOf(oauth2User.getAttributes()),
                "email"
        );
    }
}