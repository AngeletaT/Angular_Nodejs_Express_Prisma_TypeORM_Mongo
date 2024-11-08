import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { Company } from '../models/company.model';
import { Job } from '../models/job.model';
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

    update(updatedData: any): Observable<Company> {
        // console.log("Update Data: 3", updatedData);
        return this.apiService.put('/company', updatedData, 3001).pipe(
            map((data: any) => {
                // console.log("Service Update: 4", data.company);
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

    getCompanyJobs(): Observable<Job[]> {
        return this.apiService.get('/job', undefined, 3001).pipe(
            map((response: any) => {
                // console.log('Trabajos de la empresa:', response.jobs);
                return response.jobs;
            })
        );
    }

    getCompanyByName(companyName: string): Observable<Company> {
        return this.apiService.get(`/details/${companyName}`, undefined, 3001).pipe(
            map((response: any) => {
                // console.log('Company:', response.company);
                return response.company;
            })
        );
    }

    follow(companyId: string): Observable<any> {
        const body = { companyId };
        // console.log('Follow company:', body);
        return this.apiService.post(`/user/follow`, body, 3000).pipe(
            map((response: any) => {
                // console.log('Followed company:', response);
                return response;
            })
        );
    }
}