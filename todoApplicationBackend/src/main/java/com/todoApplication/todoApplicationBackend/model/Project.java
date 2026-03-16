package com.todoApplication.todoApplicationBackend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name="projects")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Project {

    @Id
    @Column(name="project_id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "proj_seq_gen")
    @SequenceGenerator(name="proj_seq_gen", sequenceName="projects_seq", allocationSize=1)
    private Long projectId;

    @Column(name="project_name")
    private String projectName;

    @Column(name="description")
    private String description;

    @Column(name="due_date")
    private LocalDate dueDate;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @JsonManagedReference
    @OneToMany(mappedBy="project")
    private List<Task> tasks;
}