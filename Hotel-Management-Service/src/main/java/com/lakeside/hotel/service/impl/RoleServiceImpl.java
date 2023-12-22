package com.lakeside.hotel.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.lakeside.hotel.exception.RoleAlreadyExistsException;
import com.lakeside.hotel.exception.UserAlreadyExistsException;
import com.lakeside.hotel.model.HotelUser;
import com.lakeside.hotel.model.Role;
import com.lakeside.hotel.repository.RoleRepository;
import com.lakeside.hotel.repository.UserRepository;
import com.lakeside.hotel.service.RoleService;

@Service
public class RoleServiceImpl implements RoleService {

	@Autowired
	private RoleRepository roleRepo;

	@Autowired
	private UserRepository userRepo;

	@Override
	public List<Role> getRoles() {
		return roleRepo.findAll();
	}

	@Override
	public Role createRole(Role role) {
		String roleName = "ROLE_" + role.getRole().toUpperCase();
		Role roleObj = new Role(roleName);
		if (roleRepo.existsByRole(role)) {
			throw new RoleAlreadyExistsException(role.getRole() + " role already exists.");
		}
		return roleRepo.save(roleObj);
	}

	@Override
	public void deleteRole(Long id) {
		this.removeAllUsersFromRole(id);
		roleRepo.deleteById(id);
	}

	@Override
	public Role findByName(String role) {
		return roleRepo.findByRole(role).get();
	}

	@Override
	public HotelUser removeUserFromRole(Long userId, Long roleId) {
		Optional<HotelUser> user = userRepo.findById(userId);
		Optional<Role> role = roleRepo.findById(roleId);
		if (role.isPresent() && role.get().getUsers().contains(user.get())) {
			role.get().removeUserFromRole(user.get());
			roleRepo.save(role.get());
			return user.get();
		}
		throw new UsernameNotFoundException("User not found");
	}

	@Override
	public HotelUser assignRoleToUser(Long userId, Long roleId) {
		Optional<HotelUser> user = userRepo.findById(userId);
		Optional<Role> role = roleRepo.findById(roleId);
		if (user.isPresent() && user.get().getRoles().contains(role.get())) {
			throw new UserAlreadyExistsException(
					user.get().getFirstName() + "is already assigned to the" + role.get().getRole() + "  role.");
		}
		if (role.isPresent()) {
			role.get().assignRoleToUser(user.get());
			roleRepo.save(role.get());
		}
		return user.get();
	}

	@Override
	public Role removeAllUsersFromRole(Long roleId) {
		Optional<Role> role = roleRepo.findById(roleId);
//		role.get().removeAllUserFromRole();
		role.ifPresent(Role::removeAllUserFromRole);
		return roleRepo.save(role.get());
	}

}
