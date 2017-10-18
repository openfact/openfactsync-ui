import { Space } from 'ngo-openfact-sync';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ofs-inbox',
  templateUrl: 'inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnDestroy, OnInit {

  categorizedSpaces: Space[] = [];

  constructor() {
  }

  public ngOnInit() {
  }

  public ngOnDestroy(): void {
  }

}
