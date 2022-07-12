import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, concatMap, finalize } from "rxjs/operators";

@Injectable() // no global singleton
export class LoadingService {
  private _loadingSubj = new BehaviorSubject(false);
  loading$ = this._loadingSubj.asObservable();

  showLoadingUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null).pipe(             // just initialize $
      tap(() => this.loadingOn()),
      concatMap(() => obs$),          //proxy returning the same obs$ as input, but turning on/off loading$
      finalize(() => this.loadingOff())
    )

  }

  private loadingOn() {
    this._loadingSubj.next(true);
  }

  private loadingOff() {
    this._loadingSubj.next(false);
  }
}
