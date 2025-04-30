package iss.animalshelter.animalshelterapp.service;

import iss.animalshelter.animalshelterapp.model.employees.Employee;

public interface EmployeesService {
    Employee getEmployeeByUsername(String username);
}
