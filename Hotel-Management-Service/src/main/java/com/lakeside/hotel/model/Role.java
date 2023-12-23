package com.lakeside.hotel.model;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "role")
public class Role {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(name = "role")
	private String role;
	@JsonIgnore
	@ManyToMany(mappedBy = "roles", fetch = FetchType.EAGER)
	private Collection<HotelUser> users = new HashSet<>();

	public Role() {
		super();
	}

	public Role(String role) {
		this.role = role;
	}

	public Role(String role, Collection<HotelUser> users) {
		super();
		this.role = role;
		this.users = users;
	}

	public void assignRoleToUser(HotelUser user) {
		user.getRoles().add(this);
		this.getUsers().add(user);
	}

	public void removeUserFromRole(HotelUser user) {
		user.getRoles().remove(this);
		this.getUsers().remove(user);
	}

	public void removeAllUserFromRole() {
		if (this.getUsers() != null) {
			List<HotelUser> roleUsers = this.getUsers().stream().toList();
			roleUsers.forEach(this::removeUserFromRole);
		}
	}

	public String getRole() {
		return role != null ? role : "";
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public Collection<HotelUser> getUsers() {
		return users;
	}

	public void setUsers(Collection<HotelUser> users) {
		this.users = users;
	}

	@Override
	public String toString() {
		return "Role [id=" + id + ", role=" + role + ", users=" + users + "]";
	}
}
