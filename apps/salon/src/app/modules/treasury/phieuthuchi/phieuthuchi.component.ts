import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'frontend-phieuthuchi',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './phieuthuchi.component.html',
  styleUrls: ['./phieuthuchi.component.scss'],
})
export class PhieuthuchiComponent implements OnInit {


  taoPhieuThu = new FormGroup({
    decription: new FormControl(""),
    price: new FormControl(""),
    type: new FormControl("")
  });

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmit() {
    throw new Error('Method not implemented.');
  }


}
