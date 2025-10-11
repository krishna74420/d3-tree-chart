import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DecommissionUiComponent } from './decommission-ui/decommission-ui.component';

const routes: Routes = [{ path: '', component: DecommissionUiComponent }];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class DecommissionRoutingModule { }
