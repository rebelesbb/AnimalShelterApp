package iss.animalshelter.animalshelterapp.persistence;

import iss.animalshelter.animalshelterapp.model.adoptions.AdoptionActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdoptionActivitiesRepository extends JpaRepository<AdoptionActivity, Long> {
    List<AdoptionActivity> findByAdoption_Id(Long id);
}
