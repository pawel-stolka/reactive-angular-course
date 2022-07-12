import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable() // no global singleton
export class LoadingService {
  private _loadingSubj = new BehaviorSubject(false);
  loading$ = this._loadingSubj.asObservable();

  showLoadingUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return undefined;
  }

  loadingOn() { 
    this._loadingSubj.next(true);
  }
  
  loadingOff() { 
    this._loadingSubj.next(false);
  }
}
