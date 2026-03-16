package com.todoApplication.todoApplicationBackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="priority")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Priority {

    @Id
    @Column(name="priority_id")
    private Long priorityId;

    @Column(name="priority_name")
    private String priorityName;
}
