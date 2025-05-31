package iss.animalshelter.animalshelterapp.utils.dtos;

import iss.animalshelter.animalshelterapp.model.employees.EmployeeRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDto {
    @NotBlank
    private String name;
    @NotBlank
    private String phoneNumber;

    @NotBlank
    private String username;
    @NotBlank
    private String password;
    @Email
    private String email;

    @NotNull
    private LocalDate hireDate;
    @NotNull
    private Double salary;
    @NotNull
    private EmployeeRole role;

    @NotNull
    private Integer locationId;
}

