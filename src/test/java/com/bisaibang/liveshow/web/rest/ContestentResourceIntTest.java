package com.bisaibang.liveshow.web.rest;

import com.bisaibang.liveshow.LiveshowApp;

import com.bisaibang.liveshow.domain.Contestent;
import com.bisaibang.liveshow.repository.ContestentRepository;
import com.bisaibang.liveshow.service.ContestentService;
import com.bisaibang.liveshow.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;


import static com.bisaibang.liveshow.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ContestentResource REST controller.
 *
 * @see ContestentResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LiveshowApp.class)
public class ContestentResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_AVATAR = "AAAAAAAAAA";
    private static final String UPDATED_AVATAR = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_VIDEO = "AAAAAAAAAA";
    private static final String UPDATED_VIDEO = "BBBBBBBBBB";

    private static final Boolean DEFAULT_ABANDONED = false;
    private static final Boolean UPDATED_ABANDONED = true;

    @Autowired
    private ContestentRepository contestentRepository;

    @Mock
    private ContestentRepository contestentRepositoryMock;

    @Mock
    private ContestentService contestentServiceMock;

    @Autowired
    private ContestentService contestentService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restContestentMockMvc;

    private Contestent contestent;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ContestentResource contestentResource = new ContestentResource(contestentService);
        this.restContestentMockMvc = MockMvcBuilders.standaloneSetup(contestentResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Contestent createEntity(EntityManager em) {
        Contestent contestent = new Contestent()
            .name(DEFAULT_NAME)
            .avatar(DEFAULT_AVATAR)
            .description(DEFAULT_DESCRIPTION)
            .video(DEFAULT_VIDEO)
            .abandoned(DEFAULT_ABANDONED);
        return contestent;
    }

    @Before
    public void initTest() {
        contestent = createEntity(em);
    }

    @Test
    @Transactional
    public void createContestent() throws Exception {
        int databaseSizeBeforeCreate = contestentRepository.findAll().size();

        // Create the Contestent
        restContestentMockMvc.perform(post("/api/contestents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(contestent)))
            .andExpect(status().isCreated());

        // Validate the Contestent in the database
        List<Contestent> contestentList = contestentRepository.findAll();
        assertThat(contestentList).hasSize(databaseSizeBeforeCreate + 1);
        Contestent testContestent = contestentList.get(contestentList.size() - 1);
        assertThat(testContestent.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testContestent.getAvatar()).isEqualTo(DEFAULT_AVATAR);
        assertThat(testContestent.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testContestent.getVideo()).isEqualTo(DEFAULT_VIDEO);
        assertThat(testContestent.isAbandoned()).isEqualTo(DEFAULT_ABANDONED);
    }

    @Test
    @Transactional
    public void createContestentWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = contestentRepository.findAll().size();

        // Create the Contestent with an existing ID
        contestent.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restContestentMockMvc.perform(post("/api/contestents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(contestent)))
            .andExpect(status().isBadRequest());

        // Validate the Contestent in the database
        List<Contestent> contestentList = contestentRepository.findAll();
        assertThat(contestentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = contestentRepository.findAll().size();
        // set the field null
        contestent.setName(null);

        // Create the Contestent, which fails.

        restContestentMockMvc.perform(post("/api/contestents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(contestent)))
            .andExpect(status().isBadRequest());

        List<Contestent> contestentList = contestentRepository.findAll();
        assertThat(contestentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllContestents() throws Exception {
        // Initialize the database
        contestentRepository.saveAndFlush(contestent);

        // Get all the contestentList
        restContestentMockMvc.perform(get("/api/contestents?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(contestent.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].avatar").value(hasItem(DEFAULT_AVATAR.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].video").value(hasItem(DEFAULT_VIDEO.toString())))
            .andExpect(jsonPath("$.[*].abandoned").value(hasItem(DEFAULT_ABANDONED.booleanValue())));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllContestentsWithEagerRelationshipsIsEnabled() throws Exception {
        ContestentResource contestentResource = new ContestentResource(contestentServiceMock);
        when(contestentServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restContestentMockMvc = MockMvcBuilders.standaloneSetup(contestentResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restContestentMockMvc.perform(get("/api/contestents?eagerload=true"))
        .andExpect(status().isOk());

        verify(contestentServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllContestentsWithEagerRelationshipsIsNotEnabled() throws Exception {
        ContestentResource contestentResource = new ContestentResource(contestentServiceMock);
            when(contestentServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restContestentMockMvc = MockMvcBuilders.standaloneSetup(contestentResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restContestentMockMvc.perform(get("/api/contestents?eagerload=true"))
        .andExpect(status().isOk());

            verify(contestentServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getContestent() throws Exception {
        // Initialize the database
        contestentRepository.saveAndFlush(contestent);

        // Get the contestent
        restContestentMockMvc.perform(get("/api/contestents/{id}", contestent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(contestent.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.avatar").value(DEFAULT_AVATAR.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.video").value(DEFAULT_VIDEO.toString()))
            .andExpect(jsonPath("$.abandoned").value(DEFAULT_ABANDONED.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingContestent() throws Exception {
        // Get the contestent
        restContestentMockMvc.perform(get("/api/contestents/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateContestent() throws Exception {
        // Initialize the database
        contestentService.save(contestent);

        int databaseSizeBeforeUpdate = contestentRepository.findAll().size();

        // Update the contestent
        Contestent updatedContestent = contestentRepository.findById(contestent.getId()).get();
        // Disconnect from session so that the updates on updatedContestent are not directly saved in db
        em.detach(updatedContestent);
        updatedContestent
            .name(UPDATED_NAME)
            .avatar(UPDATED_AVATAR)
            .description(UPDATED_DESCRIPTION)
            .video(UPDATED_VIDEO)
            .abandoned(UPDATED_ABANDONED);

        restContestentMockMvc.perform(put("/api/contestents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedContestent)))
            .andExpect(status().isOk());

        // Validate the Contestent in the database
        List<Contestent> contestentList = contestentRepository.findAll();
        assertThat(contestentList).hasSize(databaseSizeBeforeUpdate);
        Contestent testContestent = contestentList.get(contestentList.size() - 1);
        assertThat(testContestent.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testContestent.getAvatar()).isEqualTo(UPDATED_AVATAR);
        assertThat(testContestent.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testContestent.getVideo()).isEqualTo(UPDATED_VIDEO);
        assertThat(testContestent.isAbandoned()).isEqualTo(UPDATED_ABANDONED);
    }

    @Test
    @Transactional
    public void updateNonExistingContestent() throws Exception {
        int databaseSizeBeforeUpdate = contestentRepository.findAll().size();

        // Create the Contestent

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restContestentMockMvc.perform(put("/api/contestents")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(contestent)))
            .andExpect(status().isBadRequest());

        // Validate the Contestent in the database
        List<Contestent> contestentList = contestentRepository.findAll();
        assertThat(contestentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteContestent() throws Exception {
        // Initialize the database
        contestentService.save(contestent);

        int databaseSizeBeforeDelete = contestentRepository.findAll().size();

        // Get the contestent
        restContestentMockMvc.perform(delete("/api/contestents/{id}", contestent.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Contestent> contestentList = contestentRepository.findAll();
        assertThat(contestentList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Contestent.class);
        Contestent contestent1 = new Contestent();
        contestent1.setId(1L);
        Contestent contestent2 = new Contestent();
        contestent2.setId(contestent1.getId());
        assertThat(contestent1).isEqualTo(contestent2);
        contestent2.setId(2L);
        assertThat(contestent1).isNotEqualTo(contestent2);
        contestent1.setId(null);
        assertThat(contestent1).isNotEqualTo(contestent2);
    }
}
