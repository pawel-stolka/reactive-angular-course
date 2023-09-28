import { MessagesService } from './../messages/messages.service';
import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  intermediateCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(
    private coursesService: CoursesService,
    private loadingService: LoadingService,
    private messagesService: MessagesService) { }

  ngOnInit() {
    this.reload();
  }

  reload() {
    const courses$ = this.coursesService.fetchAllCourses().pipe(
      map(courses => courses.sort(sortCoursesBySeqNo)),
      catchError(err => {
        const message = "Could not load courses";
        this.messagesService.showErrors(message);
        console.log(message, err);
        return throwError(err);
      })
    )

    const loadCourses$ = this.loadingService.showLoadingUntilCompleted(courses$);

    this.beginnerCourses$ = loadCourses$.pipe(
      map(courses => courses.filter(course => course.category === 'BEGINNER'))
    )
    this.intermediateCourses$ = loadCourses$.pipe(
      map(courses => courses.filter(course => course.category === 'INTERMEDIATE'))
    )
    this.advancedCourses$ = loadCourses$.pipe(
      map(courses => courses.filter(course => course.category === 'ADVANCED'))
    )
  }



}




