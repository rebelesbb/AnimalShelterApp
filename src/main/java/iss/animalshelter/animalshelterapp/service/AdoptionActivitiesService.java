package iss.animalshelter.animalshelterapp.service;

import iss.animalshelter.animalshelterapp.model.adoptions.ActionType;
import iss.animalshelter.animalshelterapp.model.adoptions.AdoptionActivity;

import java.util.List;

public interface AdoptionActivitiesService {
    void recordActivity(Long adoptionId, Long employeeId, ActionType actionType);
    List<AdoptionActivity> getActivitiesForAdoption(Long adoptionId);
}
