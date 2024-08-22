package competiton.flora.flora.controller;


import competiton.flora.flora.entity.User;
import competiton.flora.flora.repository.UserRepository;
import competiton.flora.flora.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Base64;
import java.util.Optional;

@RestController
@CrossOrigin
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;


    @Autowired
    private JwtService service;

    @GetMapping("/getProfile")
    public User getUser(HttpServletRequest request){
        String authHeader= request.getHeader("Authorization");
        String jwt= authHeader.substring(7);
        String email=  service.extractUsername(jwt);
        if(userRepository.existsByEmail(email)){
            return userRepository.findByEmailIgnoreCase(email);
        }
        else return null;
    }

    @PostMapping("/editProfile")
    public ResponseEntity<User> editProfile(@RequestBody User user) {
        Optional<User> userData = userRepository.findById(user.getId());

        if (userData.isPresent()) {
            User _user = userData.get();
            _user.setFullname(user.getFullname());
            if(user.getPassword()!= null){
                _user.setPassword(passwordEncoder.encode(user.getPassword()));
            }
            _user.setEmail(user.getEmail());
            return new ResponseEntity<>(userRepository.save(_user), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping(value = "/editProfilePicture/{id}")
    public void editProfilePicture(@PathVariable long id,@RequestParam("file")MultipartFile file){
        User user= userRepository.findById(id).get();
        if(userRepository.existsById(id)){
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            if(fileName.contains("..")){
                System.out.println("not a valid file");
            }
            try{
                user.setPicture(Base64.getEncoder().encodeToString(file.getBytes()));
            }catch (IOException e){
                e.printStackTrace();
            }
            userRepository.save(user);
        }else {
            throw new RuntimeException("unexisting user");
        }
    }



}
