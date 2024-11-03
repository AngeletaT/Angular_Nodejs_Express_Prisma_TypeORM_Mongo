import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { Company } from '../models/company.model';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class CompanyService {
    private currentCompanySubject = new BehaviorSubject<Company>({} as Company);
    public currentCompany = this.currentCompanySubject
        .asObservable()
        .pipe(distinctUntilChanged());

    private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
    public isAuthenticated = this.isAuthenticatedSubject.asObservable();

    constructor(private apiService: ApiService, private jwtService: JwtService) { }

    populate() {
        const token = this.jwtService.getToken();
        if (token) {
            this.apiService.get('/company', undefined, 3001).subscribe(
                (data) => {
                    return this.setAuth(data.company);
                },
                (err) => {
                    this.purgeAuth();
                }
            );
        } else {
            this.purgeAuth();
        }
    }

    setAuth(company: Company) {
        this.currentCompanySubject.next(company);
        this.isAuthenticatedSubject.next(true);
    }

    purgeAuth() {
        this.jwtService.destroyToken();
        this.currentCompanySubject.next({} as Company);
        this.isAuthenticatedSubject.next(false);
    }

    attemptAuth(type: string, credentials: any): Observable<Company> {
        const route = type === 'login' ? '/company/login' : '/company/register';
        return this.apiService.post(route, credentials, 3001).pipe(
            map((data: any) => {
                if (type === 'login') {
                    this.jwtService.saveToken(data.token);
                    this.populate();
                }
                return data;
            })
        );
    }

    getCurrentCompany(): Company {
        return this.currentCompanySubject.value;
    }

    getCompanyProfile(): Observable<Company> {
        return this.apiService.get(`/company/dashboard`, undefined, 3001).pipe(
            map((data: any) => {
                this.currentCompanySubject.next(data.company);
                return data.company;
            })
        );
    }

    update(company: any): Observable<Company> {
        return this.apiService.put('/company', { company }, 3001).pipe(
            map((data: any) => {
                this.currentCompanySubject.next(data.company);
                return data.company;
            })
        );
    }

    logout(): Observable<void> {
        return this.apiService.post('/company/logout', {}, 3001).pipe(
            map(() => {
                this.purgeAuth();
            })
        );
    }

    getCompanyJobs(): Observable<any[]> {
        return this.apiService.get('/company/jobs', undefined, 3001);
    }

    requestRecruiter(jobSlug: string): Observable<void> {
        return this.apiService.post(`/job/${jobSlug}/assign`, {}, 3001);
    }

}