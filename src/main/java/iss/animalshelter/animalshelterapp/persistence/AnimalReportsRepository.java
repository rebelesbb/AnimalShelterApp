package iss.animalshelter.animalshelterapp.persistence;

import iss.animalshelter.animalshelterapp.model.reports.AnimalReport;
import iss.animalshelter.animalshelterapp.model.reports.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnimalReportsRepository extends JpaRepository<AnimalReport, Long> {
    public List<AnimalReport> findAllByStatus(ReportStatus status);
}
