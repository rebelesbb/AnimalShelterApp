package iss.animalshelter.animalshelterapp.service.service_impl;

import iss.animalshelter.animalshelterapp.model.adoptions.Adoption;
import iss.animalshelter.animalshelterapp.model.adoptions.AdoptionStatus;
import iss.animalshelter.animalshelterapp.model.animals.Animal;
import iss.animalshelter.animalshelterapp.model.animals.AnimalStatus;
import iss.animalshelter.animalshelterapp.model.contacts.Person;
import iss.animalshelter.animalshelterapp.model.contacts.User;
import iss.animalshelter.animalshelterapp.persistence.AdoptionsRepository;
import iss.animalshelter.animalshelterapp.persistence.AnimalsRepository;
import iss.animalshelter.animalshelterapp.persistence.ContactsRepository;
import iss.animalshelter.animalshelterapp.persistence.UsersRepository;
import iss.animalshelter.animalshelterapp.service.AdoptionsService;
import iss.animalshelter.animalshelterapp.utils.dtos.AdoptionRequestDto;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class AdoptionsServiceImpl implements AdoptionsService {
    private AdoptionsRepository adoptionsRepository;
    private ContactsRepository contactsRepository;
    private AnimalsRepository animalsRepository;
    private UsersRepository usersRepository;

    @Override
    @Transactional
    public Adoption saveAdoption(AdoptionRequestDto dto) {
        Animal animal = animalsRepository.findById(dto.getAnimalId())
                .orElseThrow(() -> new IllegalArgumentException("Animal not found"));

        boolean exists = adoptionsRepository.existsByAnimal_IdAndStatus(animal.getId(), AdoptionStatus.IN_PROGRESS);

        if (exists) {
            throw new IllegalStateException("An adoption for this animal is already in progress.");
        }

        Person person;
        if (dto.getPerson().getId() == -1) {
            person = new Person();
            person.setName(dto.getPerson().getName());
            person.setPhoneNumber(dto.getPerson().getPhoneNumber());
            person = contactsRepository.save(person);
        }
        else {
            Optional<Person> personOpt = contactsRepository.findById(dto.getPerson().getId());
            person = personOpt.orElseThrow(() -> new IllegalArgumentException("Contact not found"));
        }

        animal.setStatus(AnimalStatus.PENDING_ADOPTION);
        animalsRepository.save(animal);

        Adoption adoption = new Adoption();
        adoption.setAdopter(person);
        adoption.setAnimal(animal);
        adoption.setDetails(dto.getDetails());
        adoption.setPickupDate(LocalDate.parse(dto.getPickupDate()));
        adoption.setStartDate(LocalDate.now());
        adoption.setStatus(AdoptionStatus.IN_PROGRESS);

        return adoptionsRepository.save(adoption);
    }

    @Override
    public List<Adoption> getAdoptionsOfUser(long userId) {
        User user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return adoptionsRepository.findByAdopter_Id(userId);
    }

    @Override
    public List<Adoption> getAdoptionsOfLocation(long locationId) {
        return adoptionsRepository.findByAnimal_Location_Id(locationId);
    }

    @Override
    public void cancelAdoption(Long adoptionId, Long userId) {
        Adoption adoption = adoptionsRepository.findById(adoptionId)
                .orElseThrow(() -> new RuntimeException("Adoption not found"));

        Animal animal = animalsRepository.findById(adoption.getAnimal().getId())
                .orElseThrow(() -> new RuntimeException("Animal not found"));

        animal.setStatus(AnimalStatus.AVAILABLE);
        animalsRepository.save(animal);
        adoptionsRepository.delete(adoption);
    }

    @Override
    public Adoption updatePickupDate(Long adoptionId, LocalDate pickupDate, Long userId) {
        Adoption adoption = adoptionsRepository.findById(adoptionId)
                .orElseThrow(() -> new RuntimeException("Adoption not found"));

        adoption.setPickupDate(pickupDate);
        return adoptionsRepository.save(adoption);
    }

    @Override
    public Adoption finishAdoption(Long adoptionId) {
        Adoption adoption = adoptionsRepository.findById(adoptionId)
                .orElseThrow(() -> new RuntimeException("Adoption not found"));

        adoption.setStatus(AdoptionStatus.FINISHED);
        adoption.setEndDate(LocalDate.now());

        return adoptionsRepository.save(adoption);
    }


}
