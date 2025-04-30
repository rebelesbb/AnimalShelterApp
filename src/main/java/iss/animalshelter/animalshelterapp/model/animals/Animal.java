package iss.animalshelter.animalshelterapp.model.animals;

import iss.animalshelter.animalshelterapp.model.Identifiable;
import iss.animalshelter.animalshelterapp.model.locations.Location;
import jakarta.persistence.*;
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
@Table(name = "animals")
public class Animal extends Identifiable<Long> {

    @Column(nullable = false)
    private String name;

    private LocalDate birthDate;

    private String species;

    private String breed;

    private String sex;

    @Enumerated(EnumType.STRING)
    private AnimalSize size;

    private double weight;

    @Enumerated(EnumType.STRING)
    private CoatType coatType;

    @Enumerated(EnumType.STRING)
    private TemperamentType temperament;

    private boolean goodWithKids;

    private boolean goodWithAnimals;

    private String specialNeeds;

    private String photoPath;

    private LocalDate arrivalDate;

    private String description;

    @Enumerated(EnumType.STRING)
    private AnimalStatus status;

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;

}
