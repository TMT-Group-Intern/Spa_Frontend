import { Component, Input, OnInit, inject } from '@angular/core';
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
import { concatMap, filter, tap } from 'rxjs';


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

  private auth = inject( AuthService);
  private modalSvc = inject(TDSModalService);
  ServiceList: any[]=[];


  ngOnInit(): void {
    this.initshowServiceList();
  }

  //Display Service List
  initshowServiceList(): void{
    this.auth.renderListService().subscribe(data =>
      {
        this.ServiceList = data
        console.log('ServiceList:', this.ServiceList)
      }
    )
  }
  // Display modal create new service
  showCreateModal(){
    const modal = this.modalSvc.create({
      content: ModalAddServiceComponent,
      title:'Create service',
      footer: null,
      cancelText: null,
      size: 'md'
    })
    modal.afterClose.asObservable().subscribe(data =>{
      if(data) {
        this.initshowServiceList();
      }
    })
  }

  showEditModal(id:number){
    const modal = this.modalSvc.create({
      content: ModalAddServiceComponent,
      title:'Edit service',
      footer: null,
      cancelText: null,
      size: 'md',
      componentParams:{ id
      }
    });
    modal.afterClose.asObservable().subscribe(data =>{
      if(data) {
        this.initshowServiceList();}
    })
  }

  showDeleteModal(id:number){
    const modal = this.modalSvc.error({
      title:'Xóa dịch vụ',
      content: `<div class="text-error-400">Khi xóa thì không thể hoàn tác </div>`,
      iconType:'tdsi-trash-line',
      okText:'Xóa',
      size: 'md',
      cancelText:'Hủy',
      onOk:()=> true
    });
    modal.afterClose.asObservable().pipe(
      filter(condition => condition),
      concatMap(_=> this.auth.deleteAService(id)),
      tap(()=>  this.initshowServiceList())
    ).subscribe()
  }


}
