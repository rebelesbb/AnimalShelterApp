package iss.animalshelter.animalshelterapp.service;

import iss.animalshelter.animalshelterapp.model.employees.Employee;
import iss.animalshelter.animalshelterapp.model.users.User;
import iss.animalshelter.animalshelterapp.utils.dtos.CreateUserRequest;
import iss.animalshelter.animalshelterapp.utils.dtos.LoginRequest;

public interface AuthService {
    User loginAsUser(LoginRequest request);
    Employee loginAsEmployee(LoginRequest request);
    User registerUser(CreateUserRequest request);
    String hashPassword(String password);
}
