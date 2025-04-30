package iss.animalshelter.animalshelterapp.service.service_impl;

import iss.animalshelter.animalshelterapp.model.employees.Employee;
import iss.animalshelter.animalshelterapp.persistence.EmployeesRepository;
import iss.animalshelter.animalshelterapp.service.EmployeesService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class EmployeeServiceImpl implements EmployeesService {

    private final EmployeesRepository employeesRepository;


    @Override
    public Employee getEmployeeByUsername(String username) {
        Optional<Employee> employee = employeesRepository.findByUsername(username);
        return employee.orElse(null);
    }
}
