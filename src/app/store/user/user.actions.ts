export class GetUsers {
  static readonly type = '[User] Get Users';

  constructor() {}
}

export class GetUser {
  static readonly type = '[User] Get User';

  constructor(public id: string) {}
}

export class ApplyFilter {
  static readonly type = '[User ] Apply Filter';
  constructor(public payload: string) {} 
}