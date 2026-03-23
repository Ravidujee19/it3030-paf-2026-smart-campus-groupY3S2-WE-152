package com.metricon.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.metricon.common.enums.RoleName;
import com.metricon.user.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}