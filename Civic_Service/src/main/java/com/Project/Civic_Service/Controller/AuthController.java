package com.Project.Civic_Service.Controller;

import com.Project.Civic_Service.Service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService){
        this.authService=authService;
    }
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody Map<String,String> request){
        String phoneNumber=request.get("phoneNumber");
        authService.generateAndSendOtp(phoneNumber);
        return ResponseEntity.ok("OTP Processed for "+phoneNumber);
    }
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String,String> request){
        String phoneNumber = request.get("phoneNumber");
        String otp = request.get("otp");

        try {
            String jwtToken = authService.verifyOtpAndLogin(phoneNumber, otp);
            return ResponseEntity.ok(Map.of("token", jwtToken));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }
}
