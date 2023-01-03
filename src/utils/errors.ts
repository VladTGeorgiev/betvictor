/**
 * Class extending build in Error class with statusCode property
 */
export class APIError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}
