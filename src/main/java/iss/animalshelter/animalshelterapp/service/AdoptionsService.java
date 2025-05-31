package iss.animalshelter.animalshelterapp.service;

import iss.animalshelter.animalshelterapp.model.adoptions.Adoption;
import iss.animalshelter.animalshelterapp.utils.dtos.AdoptionRequestDto;

import java.time.LocalDate;
import java.util.List;

public interface AdoptionsService {
    Adoption saveAdoption(AdoptionRequestDto dto);
    List<Adoption> getAdoptionsOfUser(long userId);
    List<Adoption> getAdoptionsOfLocation(long locationId);
    void cancelAdoption(Long adoptionId, Long userId);
    Adoption updatePickupDate(Long adoptionId, LocalDate pickupDate, Long userId);
    Adoption finishAdoption(Long adoptionId);
}
