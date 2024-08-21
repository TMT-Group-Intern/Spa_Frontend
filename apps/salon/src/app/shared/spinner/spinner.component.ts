// import { Component } from '@angular/core';
// import { LoadingService } from '@core/services/loading.service';

// @Component({
//   selector: 'frontend-spinner',
//   templateUrl: './spinner.component.html',
//   styleUrls: ['./spinner.component.scss'],
//   //standalone:true,
// })
// export class SpinnerComponent {
//   isLoading$ = this.loadingService.isLoading$;

//   constructor(private loadingService: LoadingService) { }
// }

import { Component } from '@angular/core';

@Component({
  selector: 'frontend-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone:true,
})
export class SpinnerComponent {}