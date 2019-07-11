package com.bisaibang.liveshow.repository;

import com.bisaibang.liveshow.domain.Contestent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Contestent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ContestentRepository extends JpaRepository<Contestent, Long> {

    @Query("select contestent from Contestent contestent where contestent.tutor.login = ?#{principal.username}")
    List<Contestent> findByTutorIsCurrentUser();

    @Query(value = "select distinct contestent from Contestent contestent left join fetch contestent.chosens",
        countQuery = "select count(distinct contestent) from Contestent contestent")
    Page<Contestent> findAllWithEagerRelationships(Pageable pageable);

    @Query(value = "select distinct contestent from Contestent contestent left join fetch contestent.chosens")
    List<Contestent> findAllWithEagerRelationships();

    @Query("select contestent from Contestent contestent left join fetch contestent.chosens where contestent.id =:id")
    Optional<Contestent> findOneWithEagerRelationships(@Param("id") Long id);


}
