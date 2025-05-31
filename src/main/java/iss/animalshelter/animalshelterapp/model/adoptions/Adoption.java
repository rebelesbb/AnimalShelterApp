package iss.animalshelter.animalshelterapp.model.adoptions;

import iss.animalshelter.animalshelterapp.model.Identifiable;
import iss.animalshelter.animalshelterapp.model.contacts.Person;
import iss.animalshelter.animalshelterapp.model.animals.Animal;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "adoptions")
public class Adoption extends Identifiable<Long> {
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate pickupDate;
    private String details;

    @Enumerated(EnumType.STRING)
    private AdoptionStatus status;

    @ManyToOne(optional = false)
    @JoinColumn(name = "adopter_id")
    private Person adopter;

    @ManyToOne(optional = false)
    @JoinColumn(name = "animal_id")
    private Animal animal;
}
