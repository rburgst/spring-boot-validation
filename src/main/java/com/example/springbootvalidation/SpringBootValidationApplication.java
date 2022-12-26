package com.example.springbootvalidation;

import com.example.springbootvalidation.club.Club;
import com.example.springbootvalidation.club.ClubRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SpringBootValidationApplication {

    @Bean
    ApplicationRunner dataIngester(ClubRepository repository) {
        return args -> {
            repository.save(new Club("club1", "manager@club1.com"));
            repository.save(new Club("club2", "manager@club2.com"));
        };
    }

    public static void main(String[] args) {
        SpringApplication.run(SpringBootValidationApplication.class, args);
    }

}
