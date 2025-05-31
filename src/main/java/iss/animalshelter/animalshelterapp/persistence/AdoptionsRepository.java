package iss.animalshelter.animalshelterapp.persistence;

import iss.animalshelter.animalshelterapp.model.adoptions.Adoption;
import iss.animalshelter.animalshelterapp.model.adoptions.AdoptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdoptionsRepository extends JpaRepository<Adoption, Long> {
    boolean existsByAnimal_IdAndStatus(long animalId, AdoptionStatus status);
    List<Adoption> findByAdopter_Id(long adopterId);
    List<Adoption> findByAnimal_Location_Id(long locationId);
}
