package iss.animalshelter.animalshelterapp.utils.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateAdoptionDto {
    private Long userId;
    private String pickupDate;
}
