package com.freeuni.macs.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.freeuni.macs.model.SubmitRequest;
import com.freeuni.macs.model.api.SubmitResponse;
import com.freeuni.macs.service.ProblemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ProblemService problemService;
    private final ObjectMapper objectMapper;

    @Autowired
    public WebSocketController(SimpMessagingTemplate messagingTemplate, ProblemService problemService, ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
        this.problemService = problemService;
        this.objectMapper = objectMapper;
    }

    @MessageMapping("/submitSolution")
    public void submitSolution(String submissionJson,
                               @Header("Authorization") String authorizationHeader,
                               SimpMessageHeaderAccessor headerAccessor) throws Exception {
        headerAccessor.getSessionAttributes().put("Authorization", authorizationHeader);

        SubmitRequest submission = objectMapper.readValue(submissionJson, SubmitRequest.class);
        List<SubmitResponse> responses = problemService.submitProblem(submission);
        String responseJson = objectMapper.writeValueAsString(responses);

        messagingTemplate.convertAndSend("/topic/submitResult", responseJson);
    }

    @MessageMapping("/runSolution")
    public void runSolution(String submissionJson) throws Exception {
        SubmitRequest submission = objectMapper.readValue(submissionJson, SubmitRequest.class);
        List<SubmitResponse> responses = problemService.runProblemOnPublicTests(submission);
        String responseJson = objectMapper.writeValueAsString(responses);

        messagingTemplate.convertAndSend("/topic/runResult", responseJson);
    }
}
