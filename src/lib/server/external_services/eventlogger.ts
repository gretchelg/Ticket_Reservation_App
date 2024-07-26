import pino from "pino"

const logger = pino({});

// TODO: link to some external service

export function Log(eventName: string, byUser: string, details: object | null): void {
    logger.info({
        log_schema_version: 1.0,
        event_name: eventName,
        by: byUser,
        on_date: new Date().toISOString(),
        details: details
    })
}