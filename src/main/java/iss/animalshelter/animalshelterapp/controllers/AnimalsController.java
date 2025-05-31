package iss.animalshelter.animalshelterapp.controllers;

import iss.animalshelter.animalshelterapp.model.animals.Animal;
import iss.animalshelter.animalshelterapp.service.AnimalsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/animals")
@RequiredArgsConstructor
public class AnimalsController {
    private final AnimalsService animalsService;

    @GetMapping
    public ResponseEntity<List<Animal>> getAllAvailableAnimals() {
        List<Animal> animals = animalsService.getAllAvailableAnimals();
        return animals.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(animals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Animal> getAnimalById(@PathVariable final long id) {
        Optional<Animal> animal = animalsService.getAnimalById(id);
        return animal.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/species")
    public ResponseEntity<List<String>> getAllSpecies() {
        List<String> species = animalsService.getAllSpecies();
        return species.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(species);
    }

    @GetMapping("/breeds")
    public ResponseEntity<List<String>> getAllBreeds() {
        List<String> breeds = animalsService.getAllBreeds();
        return breeds.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(breeds);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Animal>> filterAnimals(
            @RequestParam(required = false) String locationId,
            @RequestParam(required = false) String species,
            @RequestParam(required = false) String breed
    ){
        Integer parsedLocationId = null;

        if (locationId != null && !locationId.isBlank()) {
            try {
                parsedLocationId = Integer.parseInt(locationId);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().build(); // Optional: handle invalid input
            }
        }

        List<Animal> animals = animalsService.filterAnimals(parsedLocationId, species, breed);
        return animals.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(animals);
    }

    private final String UPLOAD_DIR = "uploads";

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> addAnimal(
            @RequestPart("animal") Animal animal,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        try {
            if (image != null && !image.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath(image.getOriginalFilename());
                Path targetPath = Paths.get(UPLOAD_DIR).resolve(fileName);
                Files.copy(image.getInputStream(), targetPath);

                animal.setPhotoPath("/uploads/" + fileName);
            }

            Animal saved = animalsService.saveAnimal(animal);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Image upload failed: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateAnimal(
            @PathVariable int id,
            @RequestPart("animal") Animal updatedAnimal,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        Optional<Animal> existingOpt = animalsService.getAnimalById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Animal existingAnimal = existingOpt.get();
        existingAnimal.setName(updatedAnimal.getName());
        existingAnimal.setBirthDate(updatedAnimal.getBirthDate());
        existingAnimal.setSpecies(updatedAnimal.getSpecies());
        existingAnimal.setBreed(updatedAnimal.getBreed());
        existingAnimal.setSex(updatedAnimal.getSex());
        existingAnimal.setSize(updatedAnimal.getSize());
        existingAnimal.setWeight(updatedAnimal.getWeight());
        existingAnimal.setCoatType(updatedAnimal.getCoatType());
        existingAnimal.setTemperament(updatedAnimal.getTemperament());
        existingAnimal.setGoodWithKids(updatedAnimal.isGoodWithKids());
        existingAnimal.setGoodWithAnimals(updatedAnimal.isGoodWithAnimals());
        existingAnimal.setSpecialNeeds(updatedAnimal.getSpecialNeeds());
        existingAnimal.setArrivalDate(updatedAnimal.getArrivalDate());
        existingAnimal.setDescription(updatedAnimal.getDescription());
        existingAnimal.setStatus(updatedAnimal.getStatus());
        existingAnimal.setLocation(updatedAnimal.getLocation());

        try {
            if (image != null && !image.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath(image.getOriginalFilename());
                Path targetPath = Paths.get(UPLOAD_DIR).resolve(fileName);
                Files.copy(image.getInputStream(), targetPath);

                existingAnimal.setPhotoPath("/uploads/" + fileName);
            }

            Animal saved = animalsService.saveAnimal(existingAnimal);
            return ResponseEntity.ok(saved);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Image upload failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnimal(@PathVariable Long id) {
        boolean deleted = animalsService.deleteAnimal(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
