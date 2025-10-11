import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { DecommissionUiComponent } from './decommission-ui/decommission-ui.component';
import { InfoDialogComponent } from './decommission-ui/info-dialog.component';
import { DecommissionRoutingModule } from './decommission-routing.module';

@NgModule({
  declarations: [DecommissionUiComponent, InfoDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
    FormlyModule.forChild(),
    FormlyMaterialModule,
    DecommissionRoutingModule
  ],
  exports: [DecommissionUiComponent]
})
export class DecommissionModule { }
