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
                // console.log(data)
                if (type === 'login') {
                    this.jwtService.saveToken(data.token);
                    // console.log('Token:', data.token)
                    this.populate();
                }
                return data;
            })
        );
    }

    getCurrentRecruiter(): Recruiter {
        return this.currentRecruiterSubject.value;
    }

    getRecruiterProfile(): Observable<Recruiter> {
        return this.apiService.get(`/recruiter/dashboard`, undefined, 3002).pipe(
            map((data: any) => {
                // console.log(data)
                this.currentRecruiterSubject.next(data);
                return data;
            })
        );
    }

    getJobApplications(): Observable<any> {
        return this.apiService.get(`/recruiter/job`, undefined, 3002).pipe(
            map((data: any) => {
                // console.log(data)
                return data;
            })
        );
    }

    logout(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.purgeAuth();
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    update(recruiter: Partial<Recruiter>): Observable<Recruiter> {
        return this.apiService.post('/recruiter/update', recruiter, 3002).pipe(
            map((data: any) => {
                this.currentRecruiterSubject.next(data);
                return data;
            })
        );
    }

    updateApplicationStatus(updateObject: { jobId: string, userId: string, newStatus: string }): Observable<any> {
        // console.log('updateObject:', updateObject);
        return this.apiService.post('/recruiter/application/status', updateObject, 3002).pipe(
            map((data: any) => {
                // console.log('Estado actualizado:', data);
                return data;
            })
        );
    }


}
