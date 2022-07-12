import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { delay, map, shareReplay } from "rxjs/operators";
import { Course } from "../model/course";

@Injectable({
    providedIn: 'root'
})
export class CoursesService {

    constructor(private http: HttpClient) { }

    fetchAllCourses(): Observable<Course[]> {
        return this.http.get<Course[]>('/api/courses')
            .pipe(
                map(res => res['payload']),
                delay(1500),
                shareReplay()
            )
    }

    saveCourses(courseId: string, changes: Partial<Course>): Observable<any> {
        return this.http.put(`/api/courses/${courseId}`, changes).pipe(
            shareReplay()
        )
    }
}