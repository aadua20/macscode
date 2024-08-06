package com.freeuni.macs.mapper;

import com.freeuni.macs.model.Problem;
import com.freeuni.macs.model.Test;
import com.freeuni.macs.model.api.ProblemDto;
import com.freeuni.macs.model.api.TestDto;
import com.freeuni.macs.service.TestService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProblemMapper {

    private final TestService testService;

    @Autowired
    public ProblemMapper(TestService testService) {
        this.testService = testService;
    }

    public static ProblemDto toDto(Problem problem) {
        ProblemDto problemDto = new ProblemDto();
        problemDto.setId(problem.getId().toString());
        problemDto.setProblemId(problem.getProblemId());
        problemDto.setName(problem.getName());
        problemDto.setDescription(problem.getDescription());
        problemDto.setDifficulty(problem.getDifficulty());
        problemDto.setTopics(problem.getTopics());
        problemDto.setType(problem.getType());
        return problemDto;
    }

    public static Problem toEntity(ProblemDto problemDto) {
        Problem problem = new Problem();
        problem.setId(new ObjectId(problemDto.getId()));
        problem.setProblemId(problemDto.getProblemId());
        problem.setName(problemDto.getName());
        problem.setDescription(problemDto.getDescription());
        problem.setDifficulty(problemDto.getDifficulty());
        problem.setTopics(problemDto.getTopics());
        problem.setType(problemDto.getType());
        return problem;
    }
}
