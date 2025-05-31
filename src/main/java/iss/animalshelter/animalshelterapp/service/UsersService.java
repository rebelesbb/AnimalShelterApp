package iss.animalshelter.animalshelterapp.service;

import iss.animalshelter.animalshelterapp.model.contacts.User;

public interface UsersService {
    User getUserByUsername(String username);
    void deleteUserById(Long id);
    User updateUser(Long id, User updatedUser);
}
