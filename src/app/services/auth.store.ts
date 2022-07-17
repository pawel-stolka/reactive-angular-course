import { shareReplay, tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from "@angular/core";
import { User } from '../model/user';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private _userSubj = new BehaviorSubject<User>(null);

  user$: Observable<User> = this._userSubj.asObservable();
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.isLoggedIn$ = this.user$.pipe(map(user => !!user));
    this.isLoggedOut$ = this.user$.pipe(map(loggedIn => !loggedIn));
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>('/api/login', { email, password }).pipe(
      tap(user => this._userSubj.next(user)),
      shareReplay()
    )
  }

  logout() {
    this._userSubj.next(null);
  }

}
