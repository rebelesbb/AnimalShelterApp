package iss.animalshelter.animalshelterapp.controllers;

import iss.animalshelter.animalshelterapp.model.reports.AnimalReport;
import iss.animalshelter.animalshelterapp.service.AnimalReportsService;
import iss.animalshelter.animalshelterapp.utils.dtos.AnimalReportRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class AnimalReportsController {

    private final AnimalReportsService animalReportsService;

    @PostMapping("/found")
    public ResponseEntity<AnimalReport> reportFoundAnimal(@RequestBody AnimalReportRequestDto dto){
        AnimalReport report = animalReportsService.reportFoundAnimal(dto);
        if(report == null){
            return ResponseEntity.internalServerError().body(null);
        }
        return ResponseEntity.ok(report);
    }

    @GetMapping
    public ResponseEntity<List<AnimalReport>> reports(){
        return ResponseEntity.ok(animalReportsService.getAllReports());
    }

    @PutMapping("/{id}/found")
    public ResponseEntity<AnimalReport> handleFound(@PathVariable long id){
        return ResponseEntity.ok(animalReportsService.markAsFinished(id));
    }
}
