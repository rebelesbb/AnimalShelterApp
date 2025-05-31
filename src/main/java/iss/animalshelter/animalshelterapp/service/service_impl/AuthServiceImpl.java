package iss.animalshelter.animalshelterapp.service.service_impl;

import iss.animalshelter.animalshelterapp.model.employees.Employee;
import iss.animalshelter.animalshelterapp.model.contacts.User;
import iss.animalshelter.animalshelterapp.persistence.EmployeesRepository;
import iss.animalshelter.animalshelterapp.persistence.UsersRepository;
import iss.animalshelter.animalshelterapp.service.AuthService;
import iss.animalshelter.animalshelterapp.utils.PasswordEncoder;
import iss.animalshelter.animalshelterapp.utils.dtos.CreateUserRequest;
import iss.animalshelter.animalshelterapp.utils.dtos.LoginRequest;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Optional;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class AuthServiceImpl implements AuthService {
    private UsersRepository userRepository;
    private EmployeesRepository employeeRepository;

    @Override
    public User loginAsUser(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsernameAndPassword(request.getUsername(), PasswordEncoder.hashPassword(request.getPassword()));
        return userOpt.orElse(null);
    }

    @Override
    public Employee loginAsEmployee(LoginRequest request) {
        Optional<Employee> empOpt = employeeRepository.findByUsernameAndPassword(request.getUsername(), PasswordEncoder.hashPassword(request.getPassword()));
        return empOpt.orElse(null);
    }

    @Override
    public User registerUser(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username-ul este deja folosit.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email-ul este deja folosit.");
        }
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Numarul de telefon este deja folosit.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setUsername(request.getUsername());
        user.setPassword(PasswordEncoder.hashPassword(request.getPassword()));
        user.setEmail(request.getEmail());

        return userRepository.save(user);
    }
}
