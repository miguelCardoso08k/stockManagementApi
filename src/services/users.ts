import { randomInt } from "crypto";
import {
  CreateUser,
  UserRepository,
  User,
  UpdateUser,
} from "../interfaces/users.js";
import { UserRepositoryPrisma } from "../repositories/users.js";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import auth from "../config/auth/auth.json";

class UserService {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepositoryPrisma();
  }

  async create(data: CreateUser): Promise<null | User> {
    const { firstName, lastName, username, password } = data;
    const userExist = await this.getUser({ username: data.username });

    if (userExist) return null;

    const hashPassword = await hash(password, randomInt(10, 16));
    const result = await this.userRepository.create({
      firstName,
      lastName,
      username,
      password: hashPassword,
    });

    if (!result) throw new Error("ocorreu um erro");

    return result;
  }

  async login(data: {
    username: string;
    password: string;
  }): Promise<null | { message: string; token?: string }> {
    const { username, password } = data;
    const user = await this.getUser({ username: username });

    if (!user) return null;

    const match = await compare(password, user.password);

    if (!match) return { message: "senha incorreta" };

    const token = jwt.sign({ id: user.id }, auth.secret, {
      expiresIn: 86400,
    });

    return { message: "usuário conectado", token: token };
  }

  async getUser(data: {
    username?: string;
    id?: string;
  }): Promise<null | User> {
    if (data.username)
      return await this.userRepository.getUser({ username: data.username });

    if (data.id) return await this.userRepository.getUserById({ id: data.id });

    return null;
  }

  async getAll(): Promise<null | User[]> {
    return await this.userRepository.getAll();
  }

  async updateUser(data: UpdateUser): Promise<null | string | User> {
    const { column, value } = data.modify;
    const userExist = await this.getUser({ id: data.id });

    if (!userExist) return null;

    const validateUpdate = async () => {
      if (
        column !== "firstName" &&
        column !== "lastName" &&
        column !== "password"
      )
        return null;

      if (column === "firstName")
        return await this.userRepository.updateFirstName({
          id: data.id,
          value,
        });

      if (column === "lastName")
        return await this.userRepository.updateLastName({ id: data.id, value });

      if (column === "password")
        return await this.userRepository.updatePassword({ id: data.id, value });

      return null;
    };

    const result = await validateUpdate();

    if (!result) return "erro ao realizar atualização";

    return result;
  }

  async delete(data: { id: string }): Promise<null | User> {
    const userExist = await this.getUser(data);

    if (!userExist) return null;

    return await this.userRepository.delete(data);
  }
}

export { UserService };
