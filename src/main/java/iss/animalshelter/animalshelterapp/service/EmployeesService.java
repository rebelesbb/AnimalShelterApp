package iss.animalshelter.animalshelterapp.service;

import iss.animalshelter.animalshelterapp.model.employees.Employee;
import iss.animalshelter.animalshelterapp.utils.dtos.EmployeeDto;
import iss.animalshelter.animalshelterapp.utils.dtos.UpdateEmployeeDto;

import java.util.List;

public interface EmployeesService {
    Employee getEmployeeByUsername(String username);
    Employee getEmployeeById(Long id);

    List<Employee> getEmployeesByLocation(Integer locationId);

    Employee addEmployee(EmployeeDto employee);
    Employee updateEmployee(Long id, UpdateEmployeeDto employee);
    void deleteEmployee(Long employeeId);
}
