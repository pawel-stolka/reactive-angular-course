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
      tap(courses => this._coursesSubj.next(courses))
    );

    this.loading.showLoadingUntilCompleted(loadCourses$)
      .subscribe()
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
