package com.Project.Civic_Service.Service;

import com.Project.Civic_Service.Config.JwtService;
import com.Project.Civic_Service.Entities.User;
import com.Project.Civic_Service.Respository.UserRepository;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final ConcurrentHashMap<String,String> otpStorage=new ConcurrentHashMap<>();

    @Value("${twilio.acccount-sid:dummy_sid}")
    private String twilioAccountSid;

    @Value("${twilio.auth-token:dummy_token}")
    private String twilioAuthToken;

    @Value("${twilio.phone-number:dummy_phone}")
    private String twilioPhoneNumber;

    public AuthService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    @PostConstruct
    public void initTwilio(){
        if(!twilioAccountSid.equals("dummy_sid")){
            Twilio.init(twilioAccountSid,twilioAuthToken);
        }
    }
    public void generateAndSendOtp(String userPhoneNumber){
        String otp=String.format("%06d",new Random().nextInt(999999));
        otpStorage.put(userPhoneNumber,otp);
        try{
            if (!twilioAccountSid.equals("dummy_sid")) {
                Message message = Message.creator(
                        new PhoneNumber(userPhoneNumber),
                        new PhoneNumber(twilioPhoneNumber),
                        "Your TN Civic Platform OTP is: " + otp
                ).create();
                System.out.println("✅ SMS Sent! Twilio SID: " + message.getSid());
            } else {
                System.out.println("⚠️ TWILIO NOT CONFIGURED. FALLBACK OTP -> " + otp);
            }
        }catch (Exception e) {
            System.err.println("❌ Twilio Error: " + e.getMessage());
            System.out.println("⚠️ FALLBACK OTP FOR TESTING -> " + otp);
        }
    }
    public String verifyOtpAndLogin(String phoneNumber, String submittedOtp) {
        String realOtp = otpStorage.get(phoneNumber);

        if (realOtp == null || !realOtp.equals(submittedOtp)) {
            throw new RuntimeException("Invalid or Expired OTP");
        }

        otpStorage.remove(phoneNumber);

        Optional<User> existingUser = userRepository.findByPhoneNumber(phoneNumber);
        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            user = new User();
            user.setPhoneNumber(phoneNumber);
            user.setRole("USER");
            user = userRepository.save(user);
        }

        return jwtService.generateToken(user);
    }
}
