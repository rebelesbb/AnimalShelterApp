package iss.animalshelter.animalshelterapp.utils.exceptions;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resource, String field, Object value) {
        super(resource + " not found with " + field + " = " + value);
    }
}
