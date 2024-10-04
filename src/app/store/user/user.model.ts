import { User } from "src/app/interface/user.interface";

export interface UserStateModel {
  users: User[];
  filteredUsers: User[];
  selected: User;
  errors: any;
}
