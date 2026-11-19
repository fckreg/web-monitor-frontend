export class ApiError extends Error {
  readonly status: number;
  readonly path: string;

  constructor(path: string, status: number) {
    super(`Бэкенд ответил HTTP ${status} на ${path}`);
    this.name = "ApiError";
    this.status = status;
    this.path = path;
  }
}
