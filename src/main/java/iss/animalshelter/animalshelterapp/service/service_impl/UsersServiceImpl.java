package iss.animalshelter.animalshelterapp.service.service_impl;

import iss.animalshelter.animalshelterapp.model.users.User;
import iss.animalshelter.animalshelterapp.persistence.UsersRepository;
import iss.animalshelter.animalshelterapp.service.UsersService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class UsersServiceImpl implements UsersService {
    private final UsersRepository usersRepository;

    @Override
    public User getUserByUsername(String username) {
        Optional<User> user = usersRepository.findByUsername(username);
        return user.orElse(null);
    }
}
