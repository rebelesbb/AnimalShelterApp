package iss.animalshelter.animalshelterapp.service;

import iss.animalshelter.animalshelterapp.model.users.User;

public interface UsersService {
    User getUserByUsername(String username);
}
