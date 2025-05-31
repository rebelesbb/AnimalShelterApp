package iss.animalshelter.animalshelterapp.persistence;

import iss.animalshelter.animalshelterapp.model.animals.Animal;
import iss.animalshelter.animalshelterapp.model.animals.AnimalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnimalsRepository extends JpaRepository<Animal, Long> {
    List<Animal> findAllByStatus(AnimalStatus status);
}
