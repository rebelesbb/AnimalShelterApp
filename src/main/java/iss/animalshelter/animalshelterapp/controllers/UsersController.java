package iss.animalshelter.animalshelterapp.controllers;

import iss.animalshelter.animalshelterapp.model.users.User;
import iss.animalshelter.animalshelterapp.persistence.UsersRepository;
import iss.animalshelter.animalshelterapp.service.AuthService;
import iss.animalshelter.animalshelterapp.service.UsersService;
import iss.animalshelter.animalshelterapp.utils.dtos.CreateUserRequest;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class UsersController {

    private final UsersService usersService;

    @GetMapping("/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        User user = usersService.getUserByUsername(username);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }
}
