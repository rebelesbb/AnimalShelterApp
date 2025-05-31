package iss.animalshelter.animalshelterapp.controllers;

import iss.animalshelter.animalshelterapp.model.adoptions.ActionType;
import iss.animalshelter.animalshelterapp.model.adoptions.Adoption;
import iss.animalshelter.animalshelterapp.model.adoptions.AdoptionActivity;
import iss.animalshelter.animalshelterapp.service.AdoptionActivitiesService;
import iss.animalshelter.animalshelterapp.service.AdoptionsService;
import iss.animalshelter.animalshelterapp.utils.dtos.AdoptionRequestDto;
import iss.animalshelter.animalshelterapp.utils.dtos.UpdateAdoptionDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/adoptions")
@RequiredArgsConstructor
public class AdoptionsController {

    private final AdoptionsService adoptionsService;
    private final AdoptionActivitiesService adoptionActivitiesService;

    @PostMapping
    public ResponseEntity<?> createAdoption(@RequestBody AdoptionRequestDto dto) {
        try {
            Adoption saved = adoptionsService.saveAdoption(dto);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid data: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error saving adoption: " + e.getMessage());
        }
    }

    @GetMapping("/user")
    public ResponseEntity<List<Adoption>> getUserAdoptions(@RequestParam Long userId) {
        return ResponseEntity.ok(adoptionsService.getAdoptionsOfUser(userId));
    }

    @GetMapping("/location")
    public ResponseEntity<List<Adoption>> getLocationAdoptions(@RequestParam Long locationId) {
        return ResponseEntity.ok(adoptionsService.getAdoptionsOfLocation(locationId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Adoption> updateAdoptionPickupDateAsUser(
            @PathVariable Long id,
            @RequestBody UpdateAdoptionDto dto) {

        LocalDate newPickupDate = LocalDate.parse(dto.getPickupDate());
        Adoption updated = adoptionsService.updatePickupDate(id, newPickupDate, dto.getUserId());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelAdoption(
            @PathVariable Long id,
            @RequestParam Long userId) {

        adoptionsService.cancelAdoption(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/employee/{id}")
    public ResponseEntity<Adoption> updateAdoptionPickupDateAsEmployee(
            @PathVariable Long id,
            @RequestParam Long employeeId,
            @RequestBody UpdateAdoptionDto dto) {

        LocalDate newPickupDate = LocalDate.parse(dto.getPickupDate());
        Adoption updated = adoptionsService.updatePickupDate(id, newPickupDate, dto.getUserId());
        adoptionActivitiesService.recordActivity(id, employeeId, ActionType.CHANGED_DATE);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/finish")
    public ResponseEntity<?> finishAdoption(
            @PathVariable Long id,
            @RequestParam Long employeeId) {

        Adoption updated = adoptionsService.finishAdoption(id);
        adoptionActivitiesService.recordActivity(id, employeeId, ActionType.FINISHED);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}/activities")
    public ResponseEntity<List<AdoptionActivity>> getAdoptionActivities(@PathVariable Long id) {
        List<AdoptionActivity> activities = adoptionActivitiesService.getActivitiesForAdoption(id);
        return ResponseEntity.ok(activities);
    }

}
