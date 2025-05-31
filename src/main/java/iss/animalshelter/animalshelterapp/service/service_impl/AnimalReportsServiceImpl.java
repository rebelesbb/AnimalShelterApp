package iss.animalshelter.animalshelterapp.service.service_impl;

import iss.animalshelter.animalshelterapp.model.contacts.Person;
import iss.animalshelter.animalshelterapp.model.reports.AnimalReport;
import iss.animalshelter.animalshelterapp.model.reports.ReportStatus;
import iss.animalshelter.animalshelterapp.persistence.AnimalReportsRepository;
import iss.animalshelter.animalshelterapp.persistence.ContactsRepository;
import iss.animalshelter.animalshelterapp.service.AnimalReportsService;
import iss.animalshelter.animalshelterapp.utils.dtos.AnimalReportRequestDto;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class AnimalReportsServiceImpl implements AnimalReportsService {
    private final AnimalReportsRepository animalReportsRepository;
    private final ContactsRepository contactsRepository;

    public AnimalReport reportFoundAnimal(AnimalReportRequestDto dto) {
        Person person;

        if (dto.getPerson().getId() == -1) {
            person = new Person();
            person.setName(dto.getPerson().getName());
            person.setPhoneNumber(dto.getPerson().getPhoneNumber());
            person = contactsRepository.save(person);
        } else {
            person = contactsRepository.findById(dto.getPerson().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Person not found"));
        }

        AnimalReport report = new AnimalReport();
        report.setContact(person);
        report.setDetails(dto.getDetails());
        report.setLocation(dto.getLocation());
        report.setDate(LocalDate.now());
        report.setStatus(ReportStatus.IN_PROGRESS);

        return animalReportsRepository.save(report);
    }

    public List<AnimalReport> getAllReports() {
        return animalReportsRepository.findAllByStatus(ReportStatus.IN_PROGRESS);
    }

    public AnimalReport markAsFinished(Long id) {
        AnimalReport report = animalReportsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus(ReportStatus.FINISHED);
        return animalReportsRepository.save(report);
    }
}
