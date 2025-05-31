package iss.animalshelter.animalshelterapp.persistence;

import iss.animalshelter.animalshelterapp.model.employees.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeesRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByUsernameAndPassword(String username, String password);
    Optional<Employee> findByUsername(String username);

    List<Employee> findByLocation_Id(Integer id);
}
