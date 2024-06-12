import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TDSDataTableModule } from 'tds-ui/data-table';
import { TDSAvatarModule } from 'tds-ui/avatar';
import { TDSCheckBoxModule } from 'tds-ui/tds-checkbox';
import { TDSTableModule } from 'tds-ui/table';
import { TDSColumnSettingsModule } from 'tds-ui/column-settings';
import { TDSButtonModule } from 'tds-ui/button';
import { AuthService } from '../../shared.service';
import { TDSToolTipModule } from 'tds-ui/tooltip';
import { TDSModalService } from 'tds-ui/modal';
import { ModalAddServiceComponent } from './modal-add-service/modal-add-service.component';
import { TDSFormFieldModule } from 'tds-ui/form-field';


@Component({
  selector: 'frontend-service-list',
  standalone: true,
  imports: [CommonModule, TDSDataTableModule, TDSAvatarModule,
    TDSCheckBoxModule, TDSTableModule, TDSColumnSettingsModule,
    TDSButtonModule, TDSToolTipModule, TDSFormFieldModule
  ],
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss'],
})
export class ServiceListComponent implements OnInit {
  ServiceList: any[]=[];

  constructor(
    private auth: AuthService,
    private modalSvc : TDSModalService
  ) {}

  ngOnInit(): void {
  this.ShowServiceList();
  }

  //Display Service List
  ShowServiceList(): void{
    this.auth.RenderListService().subscribe(data =>
      {
        this.ServiceList = data
        console.log('ServiceList:', this.ServiceList)
      }
    )
  }
  // Display modal create new service
  showModal(): void{
    const modal = this.modalSvc.create({
      content: ModalAddServiceComponent,
      title:'Create new service',
      footer: null,
      cancelText: null,
      size: 'md'
    })
    modal.afterClose.asObservable().subscribe(data =>{
      console.log(data)
    })
  }
}
