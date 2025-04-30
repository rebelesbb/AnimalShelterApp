package iss.animalshelter.animalshelterapp.service;

import iss.animalshelter.animalshelterapp.model.locations.Location;

import java.util.List;

public interface LocationsService {
    List<Location> getAllLocations();
    void saveLocation(Location location);
}
