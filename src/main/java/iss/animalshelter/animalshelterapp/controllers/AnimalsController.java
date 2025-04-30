package iss.animalshelter.animalshelterapp.controllers;

import iss.animalshelter.animalshelterapp.model.animals.Animal;
import iss.animalshelter.animalshelterapp.service.AnimalsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/animals")
public class AnimalsController {
    private final AnimalsService animalsService;

    @Autowired
    public AnimalsController(final AnimalsService animalsService) {
        this.animalsService = animalsService;
    }

    @GetMapping
    public ResponseEntity<List<Animal>> getAllAnimals() {
        List<Animal> animals = animalsService.getAllAnimals();
        return animals.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(animals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Animal> getAnimalById(@PathVariable final int id) {
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
}
