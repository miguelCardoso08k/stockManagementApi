import { prisma } from "../database/prisma-client.js";
import {
  CreateUser,
  UpdateUserPrisma,
  User,
  UserRepository,
} from "../interfaces/users.js";

class UserRepositoryPrisma implements UserRepository {
  async create(data: CreateUser): Promise<null | User> {
    const { firstName, lastName, password, username } = data;
    return await prisma.user.create({
      data: {
        firstName,
        lastName,
        password,
        username,
      },
    });
  }

  async getAll(): Promise<User[] | null> {
    return await prisma.user.findMany();
  }

  async getUser(data: { username: string }): Promise<null | User> {
    return await prisma.user.findUnique({
      where: {
        username: data.username,
      },
    });
  }

  async getUserById(data: { id: string }): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        id: data.id,
      },
    });
  }

  async updateFirstName(data: UpdateUserPrisma): Promise<null | User> {
    return await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        firstName: data.value,
      },
    });
  }

  async updateLastName(data: UpdateUserPrisma): Promise<User | null> {
    return await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        lastName: data.value,
      },
    });
  }

  async updatePassword(data: UpdateUserPrisma): Promise<null | User> {
    return await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        password: data.value,
      },
    });
  }

  async delete(data: { id: string }): Promise<null | User> {
    return await prisma.user.delete({
      where: {
        id: data.id,
      },
    });
  }
}

export { UserRepositoryPrisma };
