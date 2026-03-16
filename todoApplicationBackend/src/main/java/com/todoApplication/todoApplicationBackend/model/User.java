package com.todoApplication.todoApplicationBackend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name="users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq_gen")
    @SequenceGenerator(name="user_seq_gen", sequenceName="USERS_SEQ", allocationSize=1)
    private Long userId;

    @Column(name="name",nullable=false)
    private String userName;

    @Column(name="email",unique=true,nullable=false)
    private String email;

    @Column(name="country")
    private String country;

    @Column(name="gender")
    private String gender;

    @Column(name="password",nullable=false)
    private String password;

    @Transient
    private String confirmPassword;

    @Column(name="jwt_token")
    private String jwtToken;

    @JsonManagedReference
    @OneToMany(mappedBy="user",cascade=CascadeType.ALL)
    List<Project> project = new ArrayList<>();
}