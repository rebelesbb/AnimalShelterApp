package iss.animalshelter.animalshelterapp.utils.dtos;

import iss.animalshelter.animalshelterapp.model.contacts.Person;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdoptionRequestDto {
    private Long animalId;
    private String details;
    private String pickupDate;
    private Person person;
}
