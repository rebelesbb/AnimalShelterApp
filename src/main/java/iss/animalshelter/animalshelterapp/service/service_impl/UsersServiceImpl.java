package iss.animalshelter.animalshelterapp.service.service_impl;

import iss.animalshelter.animalshelterapp.model.contacts.User;
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

    @Override
    public void deleteUserById(Long id) {
        usersRepository.deleteById(id);
    }

    @Override
    public User updateUser(Long id, User updatedUser) {
        return usersRepository.findById(id).map(existing -> {
            existing.setName(updatedUser.getName());
            existing.setEmail(updatedUser.getEmail());
            existing.setPhoneNumber(updatedUser.getPhoneNumber());
            return usersRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

}
