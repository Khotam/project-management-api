export enum UserRoleEnum {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
}

export enum TaskStatusEnum {
  CREATED = 'created',
  IN_PROCESS = 'in-process',
  DONE = 'done',
}

export enum PostgresErrorCodes {
  FOREIGN_KEY = '23503',
  DUPLICATE_KEY = '23505',
  INVALID_INPUT_SYNTAX = '22P02',
  CHECK_VIOLATION = '23514',
  INTERNAL_ERROR = 'XX000',
}
