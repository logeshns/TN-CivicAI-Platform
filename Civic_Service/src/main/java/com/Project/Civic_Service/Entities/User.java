package com.Project.Civic_Service.Entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CurrentTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique=true,nullable=false)
    private String phoneNumber;

    @Column(nullable=false)
    private String role;

    private String district;

    @CurrentTimestamp
    @Column(updatable=false)
    private LocalDateTime createdAt;

}
