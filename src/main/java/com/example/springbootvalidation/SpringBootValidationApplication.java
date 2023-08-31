package com.example.springbootvalidation;

import com.example.springbootvalidation.club.Club;
import com.example.springbootvalidation.club.ClubRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Arrays;
import java.util.List;

@SpringBootApplication
public class SpringBootValidationApplication {
    private static final List<String> cities = Arrays.asList("Salzburg", "Vienna");

    /**
     * Ingests data by generating a list of 100 clubs and saving them to the repository.
     *
     * @param repository the ClubRepository used to save clubs
     * @return the ApplicationRunner responsible for ingesting the data
     */
    @Bean
    ApplicationRunner dataIngester(ClubRepository repository) {
        return args -> {
            for (int i = 0; i < 100; i++) {
                Club club = new Club("Club " + i, "manager" + i + "@example.com", cities.get(i % 2));
                repository.save(club);
            }

        };
    }

    public static void main(String[] args) {
        SpringApplication.run(SpringBootValidationApplication.class, args);
    }

}
