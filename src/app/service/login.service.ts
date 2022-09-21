import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { PGpoolService } from './pgpool.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private readonly SESSION = 'pg-pool';
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  user!: any;

  get session() {
    return localStorage.getItem(this.SESSION);
  }

  constructor(private pgpoolService: PGpoolService) {
    this._isLoggedIn$.next(!!this.session);
    this.user = this.getUser(this.session!);
  }

  login(username: string, password: string) {
    return this.pgpoolService.login(username, password).pipe(
      tap(res => {
        this._isLoggedIn$.next(true);
        localStorage.setItem(this.SESSION, JSON.stringify(res));
        this.user = this.getUser(JSON.stringify(res))
        console.log(this.user)
      })
    );
  }

  logout() {
    this._isLoggedIn$.next(false);
    localStorage.clear();
  }

  private getUser(session: string) {
    if (!session) return;
    const user = JSON.parse(session);
    return user;
  }
}
