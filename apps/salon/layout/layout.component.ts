import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../src/app/shared/menu/menu.component';

@Component({
  selector: 'frontend-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports:[CommonModule, RouterModule, MenuComponent]
})
export class LayoutComponent {}
