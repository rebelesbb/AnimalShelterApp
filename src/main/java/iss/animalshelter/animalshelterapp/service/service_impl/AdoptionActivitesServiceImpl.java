package iss.animalshelter.animalshelterapp.service.service_impl;


import iss.animalshelter.animalshelterapp.model.adoptions.ActionType;
import iss.animalshelter.animalshelterapp.model.adoptions.Adoption;
import iss.animalshelter.animalshelterapp.model.adoptions.AdoptionActivity;
import iss.animalshelter.animalshelterapp.model.employees.Employee;
import iss.animalshelter.animalshelterapp.persistence.AdoptionActivitiesRepository;
import iss.animalshelter.animalshelterapp.persistence.AdoptionsRepository;
import iss.animalshelter.animalshelterapp.persistence.EmployeesRepository;
import iss.animalshelter.animalshelterapp.service.AdoptionActivitiesService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AdoptionActivitesServiceImpl implements AdoptionActivitiesService {
    private final AdoptionActivitiesRepository adoptionActivitiesRepository;
    private final EmployeesRepository employeesRepository;
    private final AdoptionsRepository adoptionsRepository;

    @Override
    public void recordActivity(Long adoptionId, Long employeeId, ActionType actionType) {
        Employee employee = employeesRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Adoption adoption = adoptionsRepository.findById(adoptionId)
                .orElseThrow(() -> new RuntimeException("Adoption not found"));

        AdoptionActivity activity = new AdoptionActivity();
        activity.setActionDate(LocalDateTime.now());
        activity.setActionType(actionType);
        activity.setEmployee(employee);
        activity.setAdoption(adoption);

        adoptionActivitiesRepository.save(activity);
    }

    @Override
    public List<AdoptionActivity> getActivitiesForAdoption(Long adoptionId) {
        return adoptionActivitiesRepository.findByAdoption_Id(adoptionId);
    }
}
