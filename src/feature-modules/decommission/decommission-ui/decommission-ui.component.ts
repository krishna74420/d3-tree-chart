import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from './info-dialog.component';
import { DecommissionService } from '../service/decommission.service';

@Component({
  selector: 'app-decommission-ui',
  templateUrl: './decommission-ui.component.html',
  styleUrls: ['./decommission-ui.component.scss']
})
export class DecommissionUiComponent implements OnInit {
  form = new FormGroup({});
  model: any = {};
  fields: FormlyFieldConfig[] = [];
  steps: any[] = [];
  currentStep = 0;
  totalSteps = 0;

  constructor(private dialog: MatDialog, private service: DecommissionService) {}

  ngOnInit() {
    this.service.loadSteps().subscribe(data => {
      this.steps = data.steps;
      this.totalSteps = this.steps.length;
      this.buildForm(this.currentStep);
    });
  }

  buildForm(index: number) {
    const step = this.steps[index];
    if (!step) return;

    switch (step.type) {
      case 'input':
        this.fields = [{ key: step.label, type: 'input', templateOptions: { label: step.question, required: true } }];
        break;
      case 'radio':
        this.fields = [{
          key: step.label,
          type: 'radio',
          templateOptions: {
            label: step.question,
            required: true,
            options: [
              { value: 'Yes', label: 'Yes' },
              { value: 'No', label: 'No' },
              { value: 'NA', label: 'N/A' }
            ]
          }
        }];
        break;
      case 'checkbox':
        this.fields = [{
          key: step.label,
          type: 'checkbox',
          templateOptions: { label: step.question }
        }];
        break;
      case 'static':
        this.fields = [{
          template: '<div class="instructions">Did you hear that? They’ve shut down the main reactor... (final instructions)</div>'
        }];
        break;
    }
  }

  openInfo() { this.dialog.open(InfoDialogComponent); }

  next() {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
      this.buildForm(this.currentStep);
    }
  }

  back() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.buildForm(this.currentStep);
    }
  }
}
