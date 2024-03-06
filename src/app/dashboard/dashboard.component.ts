import { Component } from '@angular/core';
import { faClipboardList, faFile } from '@fortawesome/free-solid-svg-icons';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  faCoffee = faClipboardList;
  file = faFile;
}
