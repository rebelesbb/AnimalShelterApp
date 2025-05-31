package iss.animalshelter.animalshelterapp.utils.dtos;

import iss.animalshelter.animalshelterapp.model.employees.EmployeeRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEmployeeDto {
    @NotBlank
    private String name;
    @NotBlank
    private String phoneNumber;
    @Email
    private String email;
    @NotNull
    private LocalDate hireDate;
    @NotNull
    private Double  salary;
    @NotNull
    private EmployeeRole role;
    @NotNull
    private Integer    locationId;
    private String password;
}
