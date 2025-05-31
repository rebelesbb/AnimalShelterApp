package iss.animalshelter.animalshelterapp.controllers;


import iss.animalshelter.animalshelterapp.JwtUtil;
import iss.animalshelter.animalshelterapp.model.employees.Employee;
import iss.animalshelter.animalshelterapp.model.contacts.User;
import iss.animalshelter.animalshelterapp.service.AuthService;
import iss.animalshelter.animalshelterapp.utils.dtos.CreateUserRequest;
import iss.animalshelter.animalshelterapp.utils.dtos.LoginRequest;
import iss.animalshelter.animalshelterapp.utils.dtos.LoginResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("Login request: " + request.getUsername() + " / " + request.getPassword());
        User user = authService.loginAsUser(request);
        if (user != null) {
            String token = jwtUtil.generateToken(user.getId(), user.getUsername(), "USER");
            return ResponseEntity.ok(new LoginResponse(token));
        }

        Employee emp = authService.loginAsEmployee(request);
        if (emp != null) {
            String token = jwtUtil.generateToken(emp.getId(), emp.getUsername(), emp.getRole().name());
            return ResponseEntity.ok(new LoginResponse(token));
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody CreateUserRequest request) {
        try {
            User createdUser = authService.registerUser(request);
            return ResponseEntity.ok("Cont creat cu succes pentru " + createdUser.getUsername());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
