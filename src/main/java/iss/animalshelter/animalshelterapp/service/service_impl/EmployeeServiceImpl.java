package iss.animalshelter.animalshelterapp.service.service_impl;

import iss.animalshelter.animalshelterapp.model.employees.Employee;
import iss.animalshelter.animalshelterapp.model.locations.Location;
import iss.animalshelter.animalshelterapp.persistence.EmployeesRepository;
import iss.animalshelter.animalshelterapp.persistence.LocationsRepository;
import iss.animalshelter.animalshelterapp.service.EmployeesService;
import iss.animalshelter.animalshelterapp.utils.PasswordEncoder;
import iss.animalshelter.animalshelterapp.utils.dtos.EmployeeDto;
import iss.animalshelter.animalshelterapp.utils.dtos.UpdateEmployeeDto;
import iss.animalshelter.animalshelterapp.utils.exceptions.ResourceNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class EmployeeServiceImpl implements EmployeesService {

    private final EmployeesRepository employeesRepository;
    private final LocationsRepository locationsRepository;

    @Override
    public Employee getEmployeeByUsername(String username) {
        Optional<Employee> employee = employeesRepository.findByUsername(username);
        return employee.orElse(null);
    }

    @Override
    public Employee getEmployeeById(Long id) {
        Optional<Employee> employee = employeesRepository.findById(id);
        return employee.orElse(null);
    }

    @Override
    public Employee addEmployee(EmployeeDto dto) {
        Location loc = locationsRepository.findById(dto.getLocationId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Location", "id", dto.getLocationId()));

        Employee emp = new Employee();
        emp.setName(dto.getName());
        emp.setPhoneNumber(dto.getPhoneNumber());
        emp.setUsername(dto.getUsername());
        emp.setPassword(PasswordEncoder.hashPassword(dto.getPassword()));
        emp.setEmail(dto.getEmail());
        emp.setHireDate(dto.getHireDate());
        emp.setSalary(dto.getSalary());
        emp.setRole(dto.getRole());
        emp.setLocation(loc);

        return employeesRepository.save(emp);
    }

    @Override
    public Employee updateEmployee(Long id, UpdateEmployeeDto dto) {
        Employee emp = employeesRepository.findById(id).orElse(null);
        if (emp == null) return null;

        emp.setName(dto.getName());
        emp.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            emp.setPassword(PasswordEncoder.hashPassword(dto.getPassword()));
        }
        emp.setEmail(dto.getEmail());
        emp.setHireDate(dto.getHireDate());
        emp.setSalary(dto.getSalary());
        emp.setRole(dto.getRole());
        if (!emp.getLocation().getId().equals(dto.getLocationId())) {
            emp.setLocation(
                    locationsRepository.findById(dto.getLocationId())
                            .orElseThrow(() -> new ResourceNotFoundException("Location", "id", dto.getLocationId()))
            );
        }

        return employeesRepository.save(emp);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Employee> getEmployeesByLocation(Integer locationId){
        return employeesRepository.findByLocation_Id(locationId);
    }

    @Override
    @Transactional
    public void deleteEmployee(Long employeeId) {
        employeesRepository.deleteById(employeeId);
    }
}
