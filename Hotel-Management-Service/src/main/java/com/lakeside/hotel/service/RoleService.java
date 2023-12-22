package com.lakeside.hotel.service;

import java.util.List;

import com.lakeside.hotel.model.HotelUser;
import com.lakeside.hotel.model.Role;

public interface RoleService {
	public List<Role> getRoles();

	public Role createRole(Role role);

	public void deleteRole(Long id);

	public Role findByName(String role);

	public HotelUser removeUserFromRole(Long userId, Long roleId);

	public HotelUser assignRoleToUser(Long userId, Long roleId);

	public Role removeAllUsersFromRole(Long roleId);
}
