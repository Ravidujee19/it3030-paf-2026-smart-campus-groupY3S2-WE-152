package com.metricon.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.metricon.common.enums.RoleName;
import com.metricon.user.entity.Role;
import com.metricon.user.repository.RoleRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            for (RoleName roleName : RoleName.values()) {
                roleRepository.findByName(roleName)
                        .orElseGet(() -> roleRepository.save(new Role(roleName)));
            }
        };
    }
}