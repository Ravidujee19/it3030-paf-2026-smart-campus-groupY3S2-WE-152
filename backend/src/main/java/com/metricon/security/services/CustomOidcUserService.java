package com.metricon.security.services;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import com.metricon.common.enums.RoleName;
import com.metricon.user.entity.Role;
import com.metricon.user.entity.User;
import com.metricon.user.repository.RoleRepository;
import com.metricon.user.repository.UserRepository;

@Service
public class CustomOidcUserService implements OAuth2UserService<OidcUserRequest, OidcUser> {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public CustomOidcUserService(UserRepository userRepository,
                                 RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = new OidcUserService().loadUser(userRequest);

        String email = oidcUser.getEmail();
        String name = oidcUser.getFullName();
        String picture = oidcUser.getPicture();

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            Role defaultRole = roleRepository.findByName(RoleName.PENDING)
                    .orElseThrow(() -> new RuntimeException("Default role not found"));

            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setProfilePicture(picture);
            user.setRole(defaultRole);

            user = userRepository.save(user);
        }

        String roleName = user.getRole().getName().name();

        return new DefaultOidcUser(
                List.of(new SimpleGrantedAuthority("ROLE_" + roleName)),
                oidcUser.getIdToken(),
                oidcUser.getUserInfo(),
                "email"
        );
    }
}