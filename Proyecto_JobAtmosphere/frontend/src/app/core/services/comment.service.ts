import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Comment } from '../models/comment.model';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class CommentService {
    constructor(
        private apiService: ApiService
    ) { }

    add(slug: any, payload: string): Observable<Comment> {
        return this.apiService
            .post(`/${slug}/comments`, { body: payload }
            ).pipe(map((data) => { return data })
            );
    }

    getAll(slug: any): Observable<Comment[]> {
        return this.apiService.get(`/${slug}/comments`)
            .pipe(map(data => data.comments));
    }

    update(slug: string, commentId: number, payload: { body: string }): Observable<Comment> {
        return this.apiService.put(`/${slug}/comments/${commentId}`, { comment: payload })
            .pipe(map(data => data.comment));
    }

    delete(commentId: any, productSlug: any) {
        return this.apiService.delete(
            `/${productSlug}/comments/${commentId}`
        );
    }

}

