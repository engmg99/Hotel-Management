package com.lakeside.hotel.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lakeside.hotel.exception.RoleAlreadyExistsException;
import com.lakeside.hotel.model.HotelUser;
import com.lakeside.hotel.model.Role;
import com.lakeside.hotel.service.RoleService;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

	@Autowired
	private RoleService roleService;

	@GetMapping("/all")
	public ResponseEntity<List<Role>> getAllRoles() {
		try {
			return new ResponseEntity<>(roleService.getRoles(), HttpStatus.FOUND);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/create")
	public ResponseEntity<String> createRole(@RequestBody Role role) {
		try {
			roleService.createRole(role);
			return ResponseEntity.ok("New Role Created Successfully!");
		} catch (RoleAlreadyExistsException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@DeleteMapping("/delete/{roleId}")
	public void deleteRole(@PathVariable Long roleId) {
		roleService.deleteRole(roleId);
	}

	@PostMapping("/remove-all-users-from-role/{roleId}")
	public Role removeAllUsersFromRole(@PathVariable Long roleId) {
		return roleService.removeAllUsersFromRole(roleId);
	}

	@PostMapping("/remove-user-from-role")
	public HotelUser removeUserFromRole(@RequestParam(required = true) Long userId,
			@RequestParam(required = true) Long roleId) {
		return roleService.removeUserFromRole(userId, roleId);
	}

	@PostMapping("/assign-user-from-role")
	public HotelUser assignUserFromRole(@RequestParam(required = true) Long userId,
			@RequestParam(required = true) Long roleId) {
		return roleService.assignRoleToUser(userId, roleId);
	}
}
