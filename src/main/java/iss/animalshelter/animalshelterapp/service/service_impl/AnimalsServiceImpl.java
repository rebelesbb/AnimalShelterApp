package iss.animalshelter.animalshelterapp.service.service_impl;

import iss.animalshelter.animalshelterapp.model.animals.AnimalStatus;
import iss.animalshelter.animalshelterapp.service.AnimalsService;
import iss.animalshelter.animalshelterapp.model.animals.Animal;
import iss.animalshelter.animalshelterapp.persistence.AnimalsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
    public List<Animal> getAllAvailableAnimals() {
        return animalRepository.findAllByStatus(AnimalStatus.AVAILABLE);
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

    @Override
    public Animal saveAnimal(Animal animal) {
        return animalRepository.save(animal);
    }

    @Transactional
    public boolean deleteAnimal(Long id) {
        Optional<Animal> animalOpt = animalRepository.findById(id);
        if (animalOpt.isEmpty()) {
            return false;
        }

        Animal animal = animalOpt.get();

        if (animal.getPhotoPath() != null && !animal.getPhotoPath().isBlank()) {
            try {
                String relativePath = animal.getPhotoPath().replaceFirst("^/+", ""); // ex: uploads/file.jpg
                Path filePath = Paths.get(relativePath);
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                System.err.println("Failed to delete photo file: " + e.getMessage());
            }
        }

        animalRepository.deleteById(id);
        return true;
    }

}
