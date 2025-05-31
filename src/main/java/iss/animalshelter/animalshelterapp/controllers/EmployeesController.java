package iss.animalshelter.animalshelterapp.controllers;

import iss.animalshelter.animalshelterapp.model.employees.Employee;
import iss.animalshelter.animalshelterapp.service.EmployeesService;
import iss.animalshelter.animalshelterapp.utils.dtos.EmployeeDto;
import iss.animalshelter.animalshelterapp.utils.dtos.UpdateEmployeeDto;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class EmployeesController {
    private final EmployeesService employeesService;

    @GetMapping("/{username}")
    public ResponseEntity<Employee> getEmployeeByUsername(@PathVariable String username) {
        Employee employee = employeesService.getEmployeeByUsername(username);
        if (employee == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(employee);
    }

    @GetMapping
    public ResponseEntity<List<Employee>> listByLocation(
            @RequestParam("locationId") Integer locationId
    ) {
        List<Employee> list = employeesService.getEmployeesByLocation(locationId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Employee> getById(@PathVariable Long id) {
        Employee employee = employeesService.getEmployeeById(id);
        if (employee == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(employee);
    }

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@Validated @RequestBody EmployeeDto dto) {
        Employee created = employeesService.addEmployee(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeesService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(
            @PathVariable Long id,
            @Validated @RequestBody UpdateEmployeeDto dto
    ) {
        Employee updated = employeesService.updateEmployee(id, dto);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }
}
