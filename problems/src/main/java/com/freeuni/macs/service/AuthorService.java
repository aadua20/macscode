package com.freeuni.macs.service;

import com.freeuni.macs.mapper.ProblemRequestMapper;
import com.freeuni.macs.model.*;
import com.freeuni.macs.model.api.InputOutputTestDto;
import com.freeuni.macs.repository.ProblemDraftRepository;
import com.freeuni.macs.repository.ProblemRepository;
import com.freeuni.macs.repository.TestRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthorService {

    private final ProblemRepository problemRepository;
    private final TestRepository testRepository;
    private final ProblemDraftRepository problemDraftRepository;

    @Autowired
    public AuthorService(ProblemRepository problemRepository, TestRepository testRepository, ProblemDraftRepository problemDraftRepository) {
        this.problemRepository = problemRepository;
        this.testRepository = testRepository;
        this.problemDraftRepository = problemDraftRepository;
    }

    public void processUpload(UploadProblemRequest uploadProblemRequest) {
        DraftProblem draftProblem = ProblemRequestMapper.convertToDraftProblem(uploadProblemRequest);
        problemDraftRepository.save(draftProblem);
    }

    public List<DraftProblem> getAllDraftProblems() {
        return problemDraftRepository.findAll();
    }

    public void processProblemPublish(UploadProblemRequest uploadProblemRequest) {
        Problem problem = saveProblem(uploadProblemRequest);
        saveTestCases(problem.getId(), uploadProblemRequest.getTestCases());
    }

    private Problem saveProblem(UploadProblemRequest request) {
        Problem existingProblem = problemRepository.findTopByProblemIdCourseOrderByProblemIdOrderDesc(request.getCourse());
        long newOrder = (existingProblem != null) ? existingProblem.getProblemId().getOrder() + 1 : 1;

        Problem problem = new Problem();
        problem.setName(request.getName());
        problem.setDescription(request.getDescription());
        problem.setType(request.getType());
        problem.setTopics(request.getTopics());
        problem.setDifficulty(request.getDifficulty());
        problem.setMainFile(request.getMainFile());
        problem.setSolutionFileTemplate(request.getSolutionTemplateFile());
        problem.setProblemId(new ProblemId(newOrder, request.getCourse()));

        return problemRepository.save(problem);
    }

    private void saveTestCases(ObjectId problemId, List<InputOutputTestDto> testCases) {
        for (InputOutputTestDto testCaseDto : testCases) {
            Test testCase = new Test();
            testCase.setProblemId(problemId);
            testCase.setInput(testCaseDto.getInput());
            testCase.setOutput(testCaseDto.getOutput());
            testCase.setIsPublic(testCaseDto.isPublic());
            testCase.setTestNum(testCaseDto.getTestNum());

            testRepository.save(testCase);
        }
    }
}
