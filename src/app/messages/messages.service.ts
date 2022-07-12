import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from "@angular/core";
import { filter } from 'rxjs/operators';

@Injectable()
export class MessagesService {

  private _errorsSubj = new BehaviorSubject<string[]>([]);

  errors$: Observable<string[]> = this._errorsSubj.asObservable().pipe(
    filter(messages => messages && messages.length > 0)
  );

  showErrors(...errors: string[]) {
    console.log('this.showErrors', errors)
    this._errorsSubj.next(errors);
  }
}
