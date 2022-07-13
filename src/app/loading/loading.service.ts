import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, concatMap, finalize } from 'rxjs/operators';

@Injectable() // no global singleton
export class LoadingService {
  private _loadingSubj = new BehaviorSubject(false);
  loading$ = this._loadingSubj.asObservable();

  constructor() {
    console.log('loadingService created');
  }

  showLoadingUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    // just initialize $
    return of(null).pipe(
      tap(() => this.loadingOn()),
      concatMap(() => obs$), //proxy returning the same obs$ as input, but turning on/off loading$
      finalize(() => this.loadingOff())
    );
  }

  loadingOn() {
    this._loadingSubj.next(true);
  }

  private loadingOff() {
    this._loadingSubj.next(false);
  }
}
