import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListComponent } from './list.component';
import { ListRoutingModule } from './list-routing.module';
import { OverviewComponent } from './overview/overview.component';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown/bs-dropdown.module';
import { TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'angular2-moment';
import { ClarksnutModule } from '../../ngx/ngx-clarksnut';
import { SpaceWizardModule } from './../wizard/space-wizard.module';
import { SpaceDeleteModule } from '../delete/space-delete.module';
import { UtilModule } from '../../util/util.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ListRoutingModule,
    BsDropdownModule,
    MomentModule,
    TranslateModule,
    ClarksnutModule,
    SpaceWizardModule,
    SpaceDeleteModule,
    UtilModule,
  ],
  declarations: [
    ListComponent,
    OverviewComponent
  ]
})
export class ListModule { }
