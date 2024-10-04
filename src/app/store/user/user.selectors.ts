import { UserStateModel } from './user.model';

export const getUserById = (state: UserStateModel) => (id: string) => {
  return state.users.find((user) => user.id === id);
};
