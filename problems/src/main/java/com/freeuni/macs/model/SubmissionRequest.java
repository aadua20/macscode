package com.freeuni.macs.model;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class SubmissionRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private List<SolutionFile> srcFiles;
    private List<Test> testCases;
    private String type;

    public SubmissionRequest(List<SolutionFile> solutionFiles,
                             List<Test> problemTests,
                             String type) {
        this.srcFiles = solutionFiles;
        this.testCases = problemTests;
        this.type = type;
    }
}
