package com.example.springbootvalidation.club;


import org.springframework.data.rest.core.config.Projection;

/**
 * Projection for {@link Club}
 */
@Projection(name = "clubInfo", types = {Club.class})
public interface ClubInfo {
    String getId();

    String getClubName();

    String getCity();
}
