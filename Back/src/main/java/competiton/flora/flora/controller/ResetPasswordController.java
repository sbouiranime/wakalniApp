package competiton.flora.flora.controller;

import competiton.flora.flora.entity.User;
import competiton.flora.flora.repository.UserRepository;
import competiton.flora.flora.service.AuthenticationService;
import competiton.flora.flora.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/password")
public class ResetPasswordController {
    @Autowired
    UserRepository userRepository;
    @Autowired
    EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    @PostMapping("/forgotPassword")
    public void forgotPassword(@RequestBody User user){
        if(user.getEmail() != null){
            emailService.sendEmail(user.getEmail(),"Reset your Password","http://192.168.1.3:8081/new-password/?email="+user.getEmail());
        }
    }

    @PostMapping("/resetPassword/{email}")
    public void resetPassword(@PathVariable String email, @RequestBody User user){
        if(user!= null){
            if(userRepository.existsByEmail(email)){
                User user1= userRepository.findByEmailIgnoreCase(email);
                user1.setPassword(passwordEncoder.encode(user.getPassword()));
                userRepository.save(user1);
            }

        }
    }

}
