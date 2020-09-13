import { User } from "entities/User";
import users from "../../database/mem";

export const userHelper = {
  isExists(login: string) {
    return users.some((u) => login === u.login);
  },
  createUser(user: User) {
    users.push({
      firstName: user.firstName,
      lastName: user.lastName,
      login: user.login,
      password: user.password,
    });
  },
};
