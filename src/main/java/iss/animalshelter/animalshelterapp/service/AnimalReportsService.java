package iss.animalshelter.animalshelterapp.service;

import iss.animalshelter.animalshelterapp.model.reports.AnimalReport;
import iss.animalshelter.animalshelterapp.utils.dtos.AnimalReportRequestDto;

import java.util.List;

public interface AnimalReportsService {
    AnimalReport reportFoundAnimal(AnimalReportRequestDto dto);
    List<AnimalReport> getAllReports();
    AnimalReport markAsFinished(Long id);
}
