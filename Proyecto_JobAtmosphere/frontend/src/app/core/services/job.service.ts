import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { Job } from '../models/job.model';
import { Filters } from '../models/filters.model';

const URL = 'http://localhost:3000/jobs';
const URLcat = 'http://localhost:3000/categories';
const URLfav = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  constructor(private http: HttpClient) {}

  //GET ALL
  get_jobs(): Observable<Job[]> {
    return this.http.get<Job[]>(URL);
  }

  //FILTERS
  get_jobs_filter(filters: Filters): Observable<Job[]> {
    let params = {};
    params = filters;
    return this.http.get<Job[]>(URL, { params });
  }

  //GET ONE
  get_job(slug: String): Observable<Job> {
    return this.http.get<Job>(`${URL}/${slug}`);
  }

  //CREATE
  create_job(job: Job): Observable<Job[]> {
    return this.http.post<Job[]>(URL, job);
  }

  //UPDATE ONE
  update_job(job: Job, slug: String): Observable<Job[]> {
    return this.http.put<Job[]>(`${URL}/${slug}`, job);
  }

  //DELETE ONE
  delete_job(slug: any): Observable<Job[]> {
    return this.http.delete<Job[]>(`${URL}/${slug}`);
  }

  //DELETE ALL
  delete_all_jobs(): Observable<Job[]> {
    return this.http.delete<Job[]>(`${URL}`);
  }

  //GET JOBS BY CATEGORY
  getJobsByCategory(slug: String): Observable<Job[]> {
    return this.http.get<Job[]>(`${URLcat}/${slug}/jobs`);
  }

  //SEARCH
  find_job_name(search: string): Observable<any> {
    return this.http.get<Job>(`${URL}?name=${search}`).pipe(
      map((data) => {
        return data;
      })
    );
  }

  //FAVORITE
  favorite(id: String): Observable<any> {
    return this.http.post(`${URLfav}/${id}/favorite`, {})
  }

  //UNFAVORITE
  unfavorite(id: String): Observable<any> {
    return this.http.delete(`${URLfav}/${id}/favorite`)
  }
}
