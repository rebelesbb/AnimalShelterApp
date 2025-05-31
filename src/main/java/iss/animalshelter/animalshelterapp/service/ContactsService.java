package iss.animalshelter.animalshelterapp.service;

import iss.animalshelter.animalshelterapp.model.contacts.Person;

public interface ContactsService {
    Person getPersonById(Long id);
}
