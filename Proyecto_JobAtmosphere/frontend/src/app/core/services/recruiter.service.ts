import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { Recruiter } from '../models/recruiter.model';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class RecruiterService {
    private currentRecruiterSubject = new BehaviorSubject<Recruiter>({} as Recruiter);
    public currentRecruiter = this.currentRecruiterSubject
        .asObservable()
        .pipe(distinctUntilChanged());

    private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
    public isAuthenticated = this.isAuthenticatedSubject.asObservable();

    constructor(private apiService: ApiService, private jwtService: JwtService) { }

    populate() {
        const token = this.jwtService.getToken();
        if (token) {
            this.apiService.get('/recruiter', undefined, 3002).subscribe(
                (data) => {
                    return this.setAuth(data.recruiter);
                },
                (err) => {
                    this.purgeAuth();
                }
            );
        } else {
            this.purgeAuth();
        }
    }

    setAuth(recruiter: Recruiter) {
        this.currentRecruiterSubject.next(recruiter);
        this.isAuthenticatedSubject.next(true);
    }

    purgeAuth() {
        this.jwtService.destroyToken();
        this.currentRecruiterSubject.next({} as Recruiter);
        this.isAuthenticatedSubject.next(false);
    }

    attemptAuth(type: string, credentials: any): Observable<Recruiter> {
        const route = type === 'login' ? '/recruiter/login' : '/recruiter/register';
        return this.apiService.post(route, credentials, 3002).pipe(
            map((data: any) => {
                if (type === 'login') {
                    this.jwtService.saveToken(data.token);
                    this.populate();
                }
                return data;
            })
        );
    }

    getCurrentRecruiter(): Recruiter {
        return this.currentRecruiterSubject.value;
    }

    logout(): Observable<void> {
        return this.apiService.post('/recruiter/logout', {}, 3002).pipe(
            map(() => {
                this.purgeAuth();
            })
        );
    }
}
