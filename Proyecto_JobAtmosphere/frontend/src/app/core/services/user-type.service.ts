import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserTypeService {
    private userTypeSubject = new BehaviorSubject<string | null>(null);
    public userType$: Observable<string | null> = this.userTypeSubject.asObservable();

    setUserType(userType: string) {
        this.userTypeSubject.next(userType);
    }

    clearUserType() {
        this.userTypeSubject.next(null);
    }

    getUserType(): string | null {
        return this.userTypeSubject.value;
    }
}