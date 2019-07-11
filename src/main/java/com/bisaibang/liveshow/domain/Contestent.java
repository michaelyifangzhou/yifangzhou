package com.bisaibang.liveshow.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Contestent.
 */
@Entity
@Table(name = "contestent")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class  Contestent implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "avatar")
    private String avatar;

    @Column(name = "description")
    private String description;

    @Column(name = "video")
    private String video;

    @Column(name = "abandoned")
    private Boolean abandoned;

    @ManyToOne
    @JsonIgnoreProperties("")
    private User tutor;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "contestent_chosen",
               joinColumns = @JoinColumn(name = "contestents_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "chosens_id", referencedColumnName = "id"))
    private Set<User> chosens = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Contestent name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAvatar() {
        return avatar;
    }

    public Contestent avatar(String avatar) {
        this.avatar = avatar;
        return this;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getDescription() {
        return description;
    }

    public Contestent description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getVideo() {
        return video;
    }

    public Contestent video(String video) {
        this.video = video;
        return this;
    }

    public void setVideo(String video) {
        this.video = video;
    }

    public Boolean isAbandoned() {
        return abandoned;
    }

    public Contestent abandoned(Boolean abandoned) {
        this.abandoned = abandoned;
        return this;
    }

    public void setAbandoned(Boolean abandoned) {
        this.abandoned = abandoned;
    }

    public User getTutor() {
        return tutor;
    }

    public Contestent tutor(User user) {
        this.tutor = user;
        return this;
    }

    public void setTutor(User user) {
        this.tutor = user;
    }

    public Set<User> getChosens() {
        return chosens;
    }

    public Contestent chosens(Set<User> users) {
        this.chosens = users;
        return this;
    }

    public Contestent addChosen(User user) {
        this.chosens.add(user);
        return this;
    }

    public Contestent removeChosen(User user) {
        this.chosens.remove(user);
        return this;
    }

    public void setChosens(Set<User> users) {
        this.chosens = users;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Contestent contestent = (Contestent) o;
        if (contestent.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), contestent.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Contestent{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", avatar='" + getAvatar() + "'" +
            ", description='" + getDescription() + "'" +
            ", video='" + getVideo() + "'" +
            ", abandoned='" + isAbandoned() + "'" +
            "}";
    }
}
