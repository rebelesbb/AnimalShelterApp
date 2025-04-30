package iss.animalshelter.animalshelterapp.persistence;

import iss.animalshelter.animalshelterapp.model.locations.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationsRepository extends JpaRepository<Location, Integer> {
}
