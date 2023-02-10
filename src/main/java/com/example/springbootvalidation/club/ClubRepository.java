package com.example.springbootvalidation.club;

import com.querydsl.core.types.dsl.StringExpression;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.querydsl.binding.QuerydslBinderCustomizer;
import org.springframework.data.querydsl.binding.QuerydslBindings;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface ClubRepository extends JpaRepository<Club, String>,
        QuerydslPredicateExecutor<Club>, QuerydslBinderCustomizer<QClub> {
    @Override
    default void customize(
            QuerydslBindings bindings, QClub root) {
        bindings.bind(root.clubName)
                .first(StringExpression::containsIgnoreCase);
        bindings.bind(root.managerEmail)
                .first(StringExpression::containsIgnoreCase)
        ;
    }
}
