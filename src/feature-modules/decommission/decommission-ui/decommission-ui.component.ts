import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as Actions from '../+state/actions/decommission.actions';
import { selectModel } from '../+state/selector/decommission.selectors';
import { InfoDialogComponent } from './info-dialog.component';

@Component({
  selector: 'app-decommission-ui',
  templateUrl: './decommission-ui.component.html',
  styleUrls: ['./decommission-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DecommissionUiComponent implements OnInit {
  form = new FormGroup({});
  steps: any[] = [];
  model$ = this.store.select(selectModel);

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private store: Store
  ) {}

  ngOnInit(): void {
    // load JSON-driven steps
    this.http.get<any>('assets/config/decommission-form.json').subscribe(cfg => {
      this.steps = cfg.steps || [];
    });
  }

  openInfo(): void {
    this.http.get<any>('assets/config/decommission-links.json').subscribe(data => {
      this.dialog.open(InfoDialogComponent, { data, width: '520px' });
    });
  }

  // flatten grouped model and dispatch save
  onModelChange(model: any) {
    const flat: any = {};
    for (const k of Object.keys(model || {})) {
      if (model[k] && typeof model[k] === 'object') Object.assign(flat, model[k]);
    }
    this.store.dispatch(Actions.saveProgress({ model: flat }));
  }
}
