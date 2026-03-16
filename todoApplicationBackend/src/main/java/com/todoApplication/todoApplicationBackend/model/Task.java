package com.todoApplication.todoApplicationBackend.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name="tasks")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Task {

    @Id
    @Column(name="task_id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "task_seq_gen")
    @SequenceGenerator(name="task_seq_gen", sequenceName="tasks_seq", allocationSize=1)
    private Long taskId;

    @Column(name="task_name")
    private String taskName;

    @Column(name="description")
    private String description;

    @Column(name="due_date")
    private LocalDate dueDate;

    @Column(name="status")
    private String status;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name="project_id")
    private Project project;


    @OneToOne
    @JoinColumn(name="priority_id")
    private Priority priority;

}