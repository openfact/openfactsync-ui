import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'cn-alerts',
  templateUrl: 'alerts.component.html'
})
export class AlertsComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  ngOnInit() {}

}
