
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DecommissionService } from './service/decommission.service';
import { DecommissionUiComponent } from './decommission-ui/decommission-ui.component';
import { DecommissionFacade } from './+state/facade/decommission.facade';
import { InfoDialogComponent } from './decommission-ui/info-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-decommission',
  standalone: true,
  imports: [CommonModule, DecommissionUiComponent, ReactiveFormsModule],
  templateUrl: './decommission.component.html',
  styleUrls: ['./decommission.component.scss']
})
export class DecommissionComponent implements OnInit {
  steps: any[] = [];
  fields: any[] = [];
  model: any = {};
  currentStep = 0;
  totalSteps = 0;

  constructor(private service: DecommissionService, private dialog: MatDialog, private facade: DecommissionFacade) {}

  ngOnInit(): void {
    this.service.loadFormConfig().subscribe(cfg => {
      this.steps = cfg.steps || [];
      this.totalSteps = this.steps.length;
      this.buildFieldsForStep(0);
    });

    const raw = localStorage.getItem('ait_decommission_draft');
    if (raw) {
      try { this.model = JSON.parse(raw); } catch {}
    }
  }

  buildFieldsForStep(index: number) {
    const step = this.steps[index];
    if (!step) { this.fields = []; return; }
    this.fields = step.fields || [];
  }

  onModelChange(m: any) {
    this.model = { ...this.model, ...m };
    this.facade.saveProgress(this.model);
    try { localStorage.setItem('ait_decommission_draft', JSON.stringify(this.model)); } catch {}
  }

  next() {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
      this.buildFieldsForStep(this.currentStep);
      this.facade.next();
    }
  }

  prev() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.buildFieldsForStep(this.currentStep);
      this.facade.prev();
    }
  }

  openInfo() {
    this.service.loadLinks().subscribe(data => {
      this.dialog.open(InfoDialogComponent, { data, width: '520px' });
    });
  }
}
