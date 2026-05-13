package com.Project.Civic_Service.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CurrentTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name="complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double latitude;
    private Double longitude;

    private String imageUrl;

    private String status;

    private String department;
    private String severity;

    @ManyToOne (fetch=FetchType.EAGER)
    @JoinColumn(name="user_id",nullable=false)
    @JsonIgnore
    private User user;

    @CurrentTimestamp
    @Column(updatable=false)
    private LocalDateTime createdAt;


}
