package com.bisaibang.liveshow.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.bisaibang.liveshow.domain.Contestent;
import com.bisaibang.liveshow.service.ContestentService;
import com.bisaibang.liveshow.web.rest.errors.BadRequestAlertException;
import com.bisaibang.liveshow.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Contestent.
 */
@RestController
@RequestMapping("/api")
public class ContestentResource {

    private final Logger log = LoggerFactory.getLogger(ContestentResource.class);

    private static final String ENTITY_NAME = "contestent";

    private final ContestentService contestentService;

    public ContestentResource(ContestentService contestentService) {
        this.contestentService = contestentService;
    }

    /**
     * POST  /contestents : Create a new contestent.
     *
     * @param contestent the contestent to create
     * @return the ResponseEntity with status 201 (Created) and with body the new contestent, or with status 400 (Bad Request) if the contestent has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/contestents")
    @Timed
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Contestent> createContestent(@Valid @RequestBody Contestent contestent) throws URISyntaxException {
        log.debug("REST request to save Contestent : {}", contestent);
        if (contestent.getId() != null) {
            throw new BadRequestAlertException("A new contestent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        contestent.setTutor(null);
        contestent.setChosens(new HashSet<>());
        Contestent result = contestentService.save(contestent);
        return ResponseEntity.created(new URI("/api/contestents/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /contestents : Updates an existing contestent.
     *
     * @param contestent the contestent to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated contestent,
     * or with status 400 (Bad Request) if the contestent is not valid,
     * or with status 500 (Internal Server Error) if the contestent couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/contestents")
    @Timed
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Contestent> updateContestent(@Valid @RequestBody Contestent contestent) throws URISyntaxException {
        log.debug("REST request to update Contestent : {}", contestent);
        if (contestent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Contestent result = contestentService.save(contestent);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, contestent.getId().toString()))
            .body(result);
    }

    /**
     * GET  /contestents : get all the contestents.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many)
     * @return the ResponseEntity with status 200 (OK) and the list of contestents in body
     */
    @GetMapping("/contestents")
    @Timed
    public List<Contestent> getAllContestents(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Contestents");
        return contestentService.findAll();
    }

    /**
     * GET  /contestents/:id : get the "id" contestent.
     *
     * @param id the id of the contestent to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the contestent, or with status 404 (Not Found)
     */
    @GetMapping("/contestents/{id}")
    @Timed
    public ResponseEntity<Contestent> getContestent(@PathVariable Long id) {
        log.debug("REST request to get Contestent : {}", id);
        Optional<Contestent> contestent = contestentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(contestent);
    }

    /**
     * DELETE  /contestents/:id : delete the "id" contestent.
     *
     * @param id the id of the contestent to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/contestents/{id}")
    @Timed
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteContestent(@PathVariable Long id) {
        log.debug("REST request to delete Contestent : {}", id);
        contestentService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
