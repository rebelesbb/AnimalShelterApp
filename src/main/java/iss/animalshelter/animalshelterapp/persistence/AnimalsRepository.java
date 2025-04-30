package iss.animalshelter.animalshelterapp.persistence;

import iss.animalshelter.animalshelterapp.model.animals.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnimalsRepository extends JpaRepository<Animal, Long> {
}
