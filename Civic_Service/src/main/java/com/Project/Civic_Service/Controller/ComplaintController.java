package com.Project.Civic_Service.Controller;

import com.Project.Civic_Service.Ai.ComplaintAnalysis;
import com.Project.Civic_Service.Ai.ComplaintAnalyzer;
import com.Project.Civic_Service.Entities.Complaint;
import com.Project.Civic_Service.Respository.ComplaintRepository;
import com.Project.Civic_Service.Entities.User;
import com.Project.Civic_Service.Respository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:5173")
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ComplaintAnalyzer complaintAnalyzer;

    // 1. CITIZEN: Submit a new complaint (with Smart AI Routing)
    @PostMapping
    public ResponseEntity<?> submitComplaint(@RequestBody Map<String, String> request) {
        String description = request.get("description");

        Complaint complaint = new Complaint();
        complaint.setDescription(description);
        complaint.setCreatedAt(LocalDateTime.now());
        complaint.setStatus("PENDING");

        // --- SMART ROUTER (Simulating AI Classification) ---
        try {
            ComplaintAnalysis analysis = complaintAnalyzer.analyze(description);
            complaint.setDepartment(analysis.department());
            complaint.setTitle(analysis.title());
            complaint.setSeverity(analysis.severity());
        } catch (Exception e) {
            // Fallback just in case the local AI server is turned off or busy
            System.err.println("AI Analysis failed: " + e.getMessage());
            complaint.setDepartment("MANUAL_REVIEW");
            complaint.setTitle("Unclassified Issue");
            complaint.setSeverity("PENDING");
        }
        // Save to Database (Mocking user ID 1 for now)
        User user = userRepository.findById(1L).orElseGet(() -> {
            User newUser = new User();
            newUser.setPhoneNumber("9876543210");
            newUser.setRole("CITIZEN");
            return userRepository.save(newUser);
        });
        complaint.setUser(user);

        complaintRepository.save(complaint);
        return ResponseEntity.ok(complaint);
    }

    // 2. CITIZEN: Fetch my complaints
    @GetMapping("/my")
    public ResponseEntity<List<Complaint>> getMyComplaints() {
        return ResponseEntity.ok(complaintRepository.findAll());
    }

    // 3. ADMIN: Fetch ALL complaints for the dashboard
    @GetMapping("/admin/all")
    public ResponseEntity<List<Complaint>> getAllComplaintsForAdmin() {
        return ResponseEntity.ok(complaintRepository.findAll());
    }

    // 4. ADMIN: Update the status of a complaint
    @PutMapping("/admin/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow();
        complaint.setStatus(request.get("status"));
        complaintRepository.save(complaint);
        return ResponseEntity.ok(complaint);
    }
}