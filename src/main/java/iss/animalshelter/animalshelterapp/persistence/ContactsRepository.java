package iss.animalshelter.animalshelterapp.persistence;

import iss.animalshelter.animalshelterapp.model.contacts.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContactsRepository extends JpaRepository<Person, Long> {
    Optional<Person> getPersonById(long id);
    Optional<Person> getPersonByPhoneNumber(String phoneNumber);
}
