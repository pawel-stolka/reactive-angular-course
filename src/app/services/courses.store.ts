import { catchError, shareReplay, tap } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { MessagesService } from './../messages/messages.service';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DELAY } from '../model/constants';
import { LoadingService } from '../loading/loading.service';

@Injectable({
  providedIn: 'root',
})
export class CoursesStore {
  private _coursesSubj = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this._coursesSubj.asObservable();

  constructor(
    private http: HttpClient,
    private loading: LoadingService,
    private messages: MessagesService
  ) {
    this.loadCourses();
  }

  private loadCourses() {
    const loadCourses$ = this.http.get<Course[]>('/api/courses').pipe(
      map((res) => res['payload']),
      // delay(DELAY),
      // shareReplay()
      catchError((err) => {
        const message = 'Could not load courses';
        console.log(message, err);
        this.messages.showErrors(message);
        return throwError(err);
      }),
      tap((courses) => this._coursesSubj.next(courses))
    );

    this.loading.showLoadingUntilCompleted(loadCourses$).subscribe();
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    // 1. modify data in store
    const courses = this._coursesSubj.getValue();
    const index = courses.findIndex((course) => course.id === courseId);
    const newCourse: Course = {
      ...courses[index],
      ...changes,
    };
    const newCourses: Course[] = courses.slice(0);
    newCourses[index] = newCourse;
    this._coursesSubj.next(newCourses);

    // 2. return it optimistically from store
    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      delay(DELAY),
      catchError((err) => {
        const message = 'Could not save course';
        console.log(message, err);
        this.messages.showErrors(message);
        return throwError(err);
      }),
      shareReplay()
    );

  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map((courses) =>
        courses
          .filter((course) => course.category === category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }
}
