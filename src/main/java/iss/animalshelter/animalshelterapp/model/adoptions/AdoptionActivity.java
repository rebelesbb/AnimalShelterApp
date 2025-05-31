package iss.animalshelter.animalshelterapp.model.adoptions;

import iss.animalshelter.animalshelterapp.model.Identifiable;
import iss.animalshelter.animalshelterapp.model.employees.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "adoption_activities")
public class AdoptionActivity extends Identifiable<Long> {

    @ManyToOne
    @JoinColumn(name = "adoption_id", nullable = false)
    private Adoption adoption;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    private LocalDateTime actionDate;

    @Enumerated(EnumType.STRING)
    private ActionType actionType;
}
