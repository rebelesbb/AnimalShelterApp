package iss.animalshelter.animalshelterapp.model.reports;

import iss.animalshelter.animalshelterapp.model.Identifiable;
import iss.animalshelter.animalshelterapp.model.contacts.Person;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "animal_reports")
public class AnimalReport extends Identifiable<Long> {
    @Column(length = 1000)
    private String details;
    private LocalDate date;
    private String location;

    @Enumerated(EnumType.STRING)
    private ReportStatus status;

    @ManyToOne
    @JoinColumn(name = "contact_id")
    private Person contact;
}
