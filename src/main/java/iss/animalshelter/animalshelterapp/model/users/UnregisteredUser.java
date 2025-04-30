package iss.animalshelter.animalshelterapp.model.users;

import iss.animalshelter.animalshelterapp.model.Person;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@Table(name = "unregistered_users")
public class UnregisteredUser extends Person {
}
