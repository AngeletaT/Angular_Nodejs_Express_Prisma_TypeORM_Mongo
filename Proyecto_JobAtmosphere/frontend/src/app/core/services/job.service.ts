import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Job } from '../models/job.model';
import { Filters } from '../models/filters.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  constructor(private apiService: ApiService, private http: HttpClient) { }

  //GET ALL
  get_jobs(): Observable<Job[]> {
    return this.apiService.get('/jobs', undefined, 3000).pipe(
      map((data: any) => data)
    );
  }

  // GET FILTROS
  get_jobs_filter(filters: Filters): Observable<Job[]> {
    let params = { ...filters }; // Spread filters into params
    return this.http.get<Job[]>(`http://localhost:3000/jobs`, { params });
  }

  //GET ONE
  get_job(slug: String): Observable<Job> {
    return this.apiService.get(`/jobs/${slug}`, undefined, 3000).pipe(
      map((data: any) => data)
    );
  }

  //CREATE
  create_job(job: Job): Observable<Job[]> {
    return this.apiService.post('/jobs', job, 3001).pipe(
      map((data: any) => data)
    );
  }

  //UPDATE ONE
  update_job(job: Job, slug: String): Observable<Job[]> {
    return this.apiService.put(`/job/${slug}`, job, 3001).pipe(
      map((data: any) => data)
    );
  }

  //DELETE ONE
  delete_job(slug: any): Observable<Job[]> {
    return this.apiService.delete(`/jobs/${slug}`).pipe(
      map((data: any) => data)
    );
  }

  //DELETE ALL
  delete_all_jobs(): Observable<Job[]> {
    return this.apiService.delete('/jobs').pipe(
      map((data: any) => data)
    );
  }

  //GET JOBS BY CATEGORY
  getJobsByCategory(slug: String): Observable<Job[]> {
    return this.apiService.get(`/categories/${slug}/jobs`, undefined, 3000).pipe(
      map((data: any) => data)
    );
  }

  //SEARCH
  find_job_name(search: string): Observable<any> {
    return this.apiService.get(`/jobs?name=${search}`).pipe(
      map((data: any) => data)
    );
  }

  //FAVORITE
  favorite(id: String): Observable<any> {
    return this.apiService.post(`/${id}/favorite`, {}, 3000).pipe(
      map((data: any) => data)
    );
  }

  //UNFAVORITE
  unfavorite(id: String): Observable<any> {
    return this.apiService.delete(`/${id}/favorite`, 3000).pipe(
      map((data: any) => data)
    );
  }

  //RECRUITER
  requestRecruiter(jobSlug: string): Observable<any> {
    return this.apiService.post(`/job/${jobSlug}/assign`, {}, 3001).pipe(
      map((data: any) => data)
    );
  }
}