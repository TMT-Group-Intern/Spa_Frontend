import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
 _companyIdCur$ = new BehaviorSubject<number| null>(null);
 _timeChange$ = new BehaviorSubject<string| null>(null);
 _search$ = new BehaviorSubject<string>('');
 _check_create$ = new BehaviorSubject<boolean>(true);
}
