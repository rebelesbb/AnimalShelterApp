package iss.animalshelter.animalshelterapp.model.employees;

import iss.animalshelter.animalshelterapp.model.Person;
import iss.animalshelter.animalshelterapp.model.locations.Location;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "employees")
public class Employee extends Person {

    @Column(nullable = false, unique=true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Email
    @Column(unique=true)
    private String email;

    @Column(nullable = false)
    private LocalDate hireDate;

    @Column(nullable = false)
    private double salary;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EmployeeRole role;

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;
}
