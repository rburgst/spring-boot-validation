package com.example.springbootvalidation.club;

import com.example.springbootvalidation.util.TsidUtil;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;
import org.hibernate.validator.constraints.Length;

import java.util.Objects;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(name = "clubNameUnique", columnNames = {"clubName"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Club {
    @Id
    Long id;

    @Column
    @NotBlank
    @Length(min = 3, max = 150)
    String clubName;

    @Column
    @Email
    @NotBlank
    @Length(max = 200)
    String managerEmail;

    public Club(String clubName, String managerEmail) {
        this.id = TsidUtil.getUniqueId();
        this.clubName = clubName;
        this.managerEmail = managerEmail;
    }

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = TsidUtil.getUniqueId();
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Club club = (Club) o;
        return id != null && Objects.equals(id, club.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" +
                "id = " + id + ", " +
                "clubName = " + clubName + ", " +
                "managerEmail = " + managerEmail + ")";
    }
}
