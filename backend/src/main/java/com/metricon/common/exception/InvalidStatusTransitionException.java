package com.metricon.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when a ticket status transition violates the allowed workflow.
 * Returns HTTP 400 (Bad Request) automatically.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidStatusTransitionException extends RuntimeException {

    public InvalidStatusTransitionException(String currentStatus, String targetStatus) {
        super(String.format("Invalid status transition from %s to %s", currentStatus, targetStatus));
    }

    public InvalidStatusTransitionException(String message) {
        super(message);
    }
}
