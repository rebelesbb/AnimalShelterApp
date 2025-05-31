package iss.animalshelter.animalshelterapp.service.service_impl;

import iss.animalshelter.animalshelterapp.model.contacts.Person;
import iss.animalshelter.animalshelterapp.persistence.ContactsRepository;
import iss.animalshelter.animalshelterapp.service.ContactsService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class ContactsServiceImpl implements ContactsService {

    private ContactsRepository contactsRepository;

    @Override
    public Person getPersonById(Long id) {
        Optional<Person> person = contactsRepository.findById(id);
        return person.orElse(null);
    }
}
