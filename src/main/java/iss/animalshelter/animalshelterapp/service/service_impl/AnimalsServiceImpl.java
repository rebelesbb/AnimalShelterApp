package iss.animalshelter.animalshelterapp.service.service_impl;

import iss.animalshelter.animalshelterapp.service.AnimalsService;
import iss.animalshelter.animalshelterapp.model.animals.Animal;
import iss.animalshelter.animalshelterapp.persistence.AnimalsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnimalsServiceImpl implements AnimalsService {

    private final AnimalsRepository animalRepository;

    @Autowired
    public AnimalsServiceImpl(AnimalsRepository animalRepository) {
        this.animalRepository = animalRepository;
    }

    @Override
    public List<Animal> getAllAnimals() {
        return animalRepository.findAll();
    }

    @Override
    public List<Animal> filterAnimals(Integer locationId, String species, String breed) {
        return animalRepository.findAll()
                .stream()
                .filter(animal -> locationId == null || animal.getLocation().getId().equals(locationId))
                .filter(animal -> species == null || animal.getSpecies().equals(species))
                .filter(animal -> breed == null || animal.getBreed().equals(breed))
                .toList();

    }

    @Override
    public List<String> getAllSpecies() {
        return animalRepository.findAll()
                .stream()
                .map(Animal::getSpecies)
                .distinct()
                .toList();
    }

    @Override
    public List<String> getAllBreeds() {
        return animalRepository.findAll()
                .stream()
                .map(Animal::getBreed)
                .distinct()
                .toList();
    }

    @Override
    public Optional<Animal> getAnimalById(long id) {
        return animalRepository.findById(id);
    }
}
