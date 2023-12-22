package com.lakeside.hotel.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lakeside.hotel.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

	public Optional<Role> findById(Long id);

	public Optional<Role> findByRole(String role);

	public boolean existsByRole(Role role);
}
