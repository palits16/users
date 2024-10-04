import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) { }

  getUsers(): any {
    return this.http.get(this.apiUrl);
  }

  getUser(id: string | null): any {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}