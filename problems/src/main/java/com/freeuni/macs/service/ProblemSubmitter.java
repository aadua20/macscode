package com.freeuni.macs.service;

import com.freeuni.macs.model.SubmitResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProblemSubmitter {
    List<SubmitResponse> submitProblem();
}
