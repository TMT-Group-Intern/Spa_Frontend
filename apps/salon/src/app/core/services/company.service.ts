import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
 _companyIdCur$ = new BehaviorSubject<number| null>(null);
 _timeChange$ = new BehaviorSubject<string| null>(null);

}
