package com.bisaibang.liveshow.service;

import com.bisaibang.liveshow.domain.Contestent;
import com.bisaibang.liveshow.repository.ContestentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing Contestent.
 */
@Service
@Transactional
public class ContestentService {

    private final Logger log = LoggerFactory.getLogger(ContestentService.class);

    private final ContestentRepository contestentRepository;

    public ContestentService(ContestentRepository contestentRepository) {
        this.contestentRepository = contestentRepository;
    }

    /**
     * Save a contestent.
     *
     * @param contestent the entity to save
     * @return the persisted entity
     */
    public Contestent save(Contestent contestent) {
        log.debug("Request to save Contestent : {}", contestent);
        return contestentRepository.save(contestent);
    }

    /**
     * Get all the contestents.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<Contestent> findAll() {
        log.debug("Request to get all Contestents");
        return contestentRepository.findAllWithEagerRelationships();
    }

    /**
     * Get all the Contestent with eager load of many-to-many relationships.
     *
     * @return the list of entities
     */
    public Page<Contestent> findAllWithEagerRelationships(Pageable pageable) {
        return contestentRepository.findAllWithEagerRelationships(pageable);
    }
    

    /**
     * Get one contestent by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<Contestent> findOne(Long id) {
        log.debug("Request to get Contestent : {}", id);
        return contestentRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the contestent by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Contestent : {}", id);
        contestentRepository.deleteById(id);
    }
}
