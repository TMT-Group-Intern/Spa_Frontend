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
import { TDSFormFieldModule } from 'tds-ui/form-field';
import { catchError, concatMap, filter, of, tap } from 'rxjs';
import { ModalServiceComponent } from './moda-service/modal-service.component';


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
      }
    )
  }
  // Call display modal create a service
  showCreateModal(){
    const modal = this.modalSvc.create({
      content: ModalServiceComponent,
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
  // Call display modal edit service
  showEditModal(id:number){
    const modal = this.modalSvc.create({
      content: ModalServiceComponent,
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

  // Call display modal delete a service
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
      concatMap(_=> this.auth.deleteAService(id).pipe(
        tap(()=>{
          this.modalSvc.success({
            title:'Successfully!'
          });
        }),
        catchError((error) => {
          this.modalSvc.error({
            title: 'Error',
            content:error.error.message,
          });
          return of(null);
        }),
      )
    ),
      tap(()=>  this.initshowServiceList()),
    ).subscribe()
  }

}
