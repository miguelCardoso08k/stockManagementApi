export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export interface CreateUser {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export interface ModifyUser {
  column: "firstName" | "lastName" | "password";
  value: string;
}

export interface UpdateUser {
  id: string;
  modify: ModifyUser;
}

export interface UpdateUserPrisma {
  id: string;
  value: string;
}

export interface UserRepository {
  create(data: CreateUser): Promise<null | User>;
  getUserById(data: { id: string }): Promise<null | User>;
  getUser(data: { username: string }): Promise<null | User>;
  getAll(): Promise<null | User[]>;
  updateFirstName(data: UpdateUserPrisma): Promise<null | User>;
  updateLastName(data: UpdateUserPrisma): Promise<null | User>;
  updatePassword(data: UpdateUserPrisma): Promise<null | User>;
  delete(data: { id: string }): Promise<null | User>;
}
