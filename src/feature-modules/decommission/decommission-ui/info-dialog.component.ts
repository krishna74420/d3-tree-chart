import { Component } from '@angular/core';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss']
})
export class InfoDialogComponent {
  links = [
    { label: 'Middleware Removal', url: 'https://confluence.company.com/middleware' },
    { label: 'Database Removal', url: 'https://confluence.company.com/database' },
    { label: 'Load Balancer Removal', url: 'https://confluence.company.com/loadbalancer' }
  ];
}
