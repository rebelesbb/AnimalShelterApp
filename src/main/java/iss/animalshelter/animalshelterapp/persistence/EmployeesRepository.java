package iss.animalshelter.animalshelterapp.persistence;

import iss.animalshelter.animalshelterapp.model.employees.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeesRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByUsernameAndPassword(String username, String password);
    Optional<Employee> findByUsername(String username);
}
