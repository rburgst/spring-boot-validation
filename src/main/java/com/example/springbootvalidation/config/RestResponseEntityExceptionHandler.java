package com.example.springbootvalidation.config;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
class RestResponseEntityExceptionHandler extends
        ResponseEntityExceptionHandler {

    @ExceptionHandler({ConstraintViolationException.class})
    public ResponseEntity<Object> handleConstraintViolation(
            Exception ex, WebRequest request) {
        ConstraintViolationException nevEx = findException(ex, ConstraintViolationException.class);

        Map<String, Map<String, String>> errs = new HashMap<>();
        nevEx.getConstraintViolations().stream()
                .forEach(constraintViolation -> errs.put(constraintViolation.getPropertyPath().toString(), Map.of("message", constraintViolation.getMessage())));
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "validation failed");
        problemDetail.setProperty("errors", errs);
        return ResponseEntity.badRequest().body(problemDetail);
    }


    private <T extends Throwable> T findException(Throwable throwable, Class<T> expected) {
        Throwable cur = throwable;
        while (cur != null) {
            if (expected.isAssignableFrom(cur.getClass())) {
                return ((T) cur);
            }
            cur = cur.getCause();
        }
        throw new IllegalArgumentException("throwable %s is not of type %s".formatted(throwable, expected));
    }
}
