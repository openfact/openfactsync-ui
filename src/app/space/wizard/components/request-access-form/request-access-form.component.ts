import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { IRequestAccessForm } from '../../models/request-access';
import { Space } from '../../../../ngx/ngx-clarksnut';

@Component({
  selector: 'cn-request-access-form',
  templateUrl: './request-access-form.component.html',
  styleUrls: ['./request-access-form.component.scss'],
})

export class RequestAccessFormComponent implements OnInit, OnDestroy {

  @Input() space: Space;
  @Output() onChange = new EventEmitter<IRequestAccessForm>(null);

  form: FormGroup;

  private subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    const spaceOwner = (<any>this.space).relationalData.creator.attributes.fullName || (<any>this.space).relationalData.creator.attributes.username;

    this.form = this.formBuilder.group({
      currentOwner: [spaceOwner, Validators.compose([Validators.required, Validators.maxLength(20)])],
      requestMessage: [null, Validators.compose([Validators.required, Validators.maxLength(250)])]
    });

    this.subscriptions.push(
      this.form.statusChanges.subscribe(() => {
        if (this.form.valid) {
          this.onChange.emit({
            message: this.form.value.requestMessage
          } as IRequestAccessForm);
        } else {
          this.onChange.emit(null);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

}
