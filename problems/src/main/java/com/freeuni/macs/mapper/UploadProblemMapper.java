package com.freeuni.macs.mapper;

import com.freeuni.macs.model.UserSubmission;
import com.freeuni.macs.model.api.UserSubmissionDto;
import org.springframework.stereotype.Service;

@Service
public class UploadProblemMapper {

    public static UserSubmissionDto toDto(UserSubmission userSubmission) {
        if (userSubmission == null) {
            return null;
        }

        return UserSubmissionDto.builder()
                .id(userSubmission.getId())
                .submitterUsername(userSubmission.getSubmitterUsername())
                .problemId(userSubmission.getProblemId())
                .solutionFileContent(userSubmission.getSolutionFileContent())
                .submissionDate(userSubmission.getSubmissionDate())
                .result(userSubmission.getResult())
                .build();
    }

    public static UserSubmission toEntity(UserSubmissionDto userSubmissionDto) {
        if (userSubmissionDto == null) {
            return null;
        }

        return UserSubmission.builder()
                .id(userSubmissionDto.getId())
                .submitterUsername(userSubmissionDto.getSubmitterUsername())
                .problemId(userSubmissionDto.getProblemId())
                .solutionFileContent(userSubmissionDto.getSolutionFileContent())
                .submissionDate(userSubmissionDto.getSubmissionDate())
                .result(userSubmissionDto.getResult())
                .build();
    }
}
