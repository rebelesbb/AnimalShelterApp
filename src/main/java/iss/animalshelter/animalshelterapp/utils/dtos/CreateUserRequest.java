package iss.animalshelter.animalshelterapp.utils.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserRequest {
    private String name;
    private String phoneNumber;
    private String username;
    private String password;
    private String email;
}
