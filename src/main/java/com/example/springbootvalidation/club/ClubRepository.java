package com.example.springbootvalidation.club;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface ClubRepository extends JpaRepository<Club, String> {
}
