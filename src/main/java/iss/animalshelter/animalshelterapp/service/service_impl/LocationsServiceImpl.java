package iss.animalshelter.animalshelterapp.service.service_impl;

import iss.animalshelter.animalshelterapp.service.LocationsService;
import iss.animalshelter.animalshelterapp.model.locations.Location;
import iss.animalshelter.animalshelterapp.persistence.LocationsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationsServiceImpl implements LocationsService {
    private final LocationsRepository locationsRepository;

    @Autowired
    public LocationsServiceImpl(LocationsRepository locationsRepository) {
        this.locationsRepository = locationsRepository;
    }

    @Override
    public List<Location> getAllLocations() {
        return locationsRepository.findAll();
    }

    @Override
    public void saveLocation(Location location) {
        locationsRepository.save(location);
    }
}
