package iss.animalshelter.animalshelterapp.service;

import iss.animalshelter.animalshelterapp.model.animals.Animal;

import java.util.List;
import java.util.Optional;

public interface AnimalsService {
    List<Animal> getAllAnimals();
    List<Animal> getAllAvailableAnimals();
    List<Animal> filterAnimals(Integer locationId, String species, String breed);

    List<String> getAllSpecies();
    List<String> getAllBreeds();

    Optional<Animal> getAnimalById(long id);

    Animal saveAnimal(Animal animal);
    boolean deleteAnimal(Long id);

}
