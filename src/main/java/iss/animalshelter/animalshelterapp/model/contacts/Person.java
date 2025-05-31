package iss.animalshelter.animalshelterapp.model.contacts;

import iss.animalshelter.animalshelterapp.model.Identifiable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "contacts")
public class Person extends Identifiable<Long> {
    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String phoneNumber;
}
