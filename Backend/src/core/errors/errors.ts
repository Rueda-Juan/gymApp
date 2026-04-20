/**
 * Base error class for all application errors.
 * Provides structured error handling with code and status.
 */
export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Domain-level business rule violation.
 */
export class DomainError extends AppError {
  readonly code = 'DOMAIN_ERROR';
  readonly statusCode = 400;
}

/**
 * Input validation failure (Zod or manual).
 */
export class ValidationError extends AppError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 422;

  constructor(
    message: string,
    public readonly fieldErrors: Record<string, string[]>,
  ) {
    super(message, fieldErrors);
  }
}

/**
 * Entity not found in the data store.
 */
export class NotFoundError extends AppError {
  readonly code = 'NOT_FOUND';
  readonly statusCode = 404;
}

/**
 * Database operation failure.
 */
export class DatabaseError extends AppError {
  readonly code = 'DATABASE_ERROR';
  readonly statusCode = 500;
}
