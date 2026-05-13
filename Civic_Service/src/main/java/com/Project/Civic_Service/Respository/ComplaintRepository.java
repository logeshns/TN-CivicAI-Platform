package com.Project.Civic_Service.Respository;

import com.Project.Civic_Service.Entities.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint,Long>{
    List<Complaint> findByDepartment(String department);
    List<Complaint> findByUserId(Long userId);
    List<Complaint> findByDepartmentAndStatus(String department,String status);
}
