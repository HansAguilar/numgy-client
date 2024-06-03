import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from './dto/user';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  url = "http://localhost:8080/api/v1/user";
  // private loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // public loggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  loggedIn: boolean = false;

  constructor(private http: HttpClient) {
    const loggedIn = localStorage.getItem('loggedIn') == 'true';
    this.loggedIn = loggedIn;
  }

  registerUser(data: { username: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.url}/register`, data, { headers: { 'Content-Type': 'application/json' } });
  }

  sendStatsUser(data: { username: string, overall_score: number }): Observable<any> {
    return this.http.post<any>(`${this.url}/send-stats`, data, { headers: { 'Content-Type': 'application/json' } });
  }

  loginUser(data: { username: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.url}/login`, data, { headers: { 'Content-Type': 'application/json' } }).pipe(
      tap((e) => {
        // this.loggedInSubject.next(true);
        this.loggedIn = true;
        localStorage.setItem('session_username', data.username);
        localStorage.setItem('loggedIn', 'true');
      })
    )
  }

  getLeaderboard(): Observable<any> {
    return this.http.get<User[]>(`http://localhost:8080/api/v1/leaderboard/getallrank`).pipe(
      tap((e) => {
        console.log(e);
      })
    )
  }


  logout() {
    // this.loggedInSubject.next(false);
    this.loggedIn = true;
    localStorage.removeItem('loggedIn');
  }
}
