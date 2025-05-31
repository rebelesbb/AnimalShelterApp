package iss.animalshelter.animalshelterapp.utils.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnimalReportRequestDto {
    private String details;
    private String location;
    private PersonDto person;
}
