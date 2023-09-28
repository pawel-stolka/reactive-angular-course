import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { filter, tap } from "rxjs/operators";
import { CourseDialogComponent } from "../course-dialog/course-dialog.component";
import { Course } from "../model/course";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "courses-card-list",
  templateUrl: "./courses-card-list.component.html",
  styleUrls: ["./courses-card-list.component.scss"],
})
export class CoursesCardListComponent implements OnInit {
  @Input() courses: Course[];
  @Output() coursesChanged = new EventEmitter();

  constructor(
    private coursesService: CoursesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const courses$ = this.coursesService.fetchAllCourses();
  }

  trackByFn(item: any) {
    return item.id;
  }

  editCourse(course: Course) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px"
    dialogConfig.data = course;

    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);
  }
}
