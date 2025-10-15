import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { takeUntil, tap } from 'rxjs/operators';
import { DecommissionUiComponent } from './decommission-ui/decommission-ui.component';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { DecommissionFacade } from './+state/facade/decommission.facade';

@Component({
  selector: 'app-decommission',
  templateUrl: './decommission.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DecommissionUiComponent, MatDialogModule, MatIconModule],
})
export class DecommissionComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  modalSize = 'md';
  type: string = '';
  showMessage: any;
  steps: any[] = [];
  fields: any[] = [];
  model: any = {};
  currentStep: number = 0;
  totalSteps: number = 0;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild('mesgpopup') errorMessage: TemplateRef<any>;

  private modalRef: MatDialogRef<any>;
  private decommissionFacade = inject(DecommissionFacade);
  private modalService = inject(MatDialog);

  constructor() {}

  ngOnInit() {
    document.title = 'AIT Decommission';
    this.decommissionFacade.setError(false, '');
    this.decommissionFacade.setLoading(false);
    this.decommissionFacade.setHeaderPath('AIT Decommission');
    this.decommissionFacade.loadConfig();
    this.subscribe();
  }

  private subscribe(): void {
    this.decommissionFacade.getLoading().pipe(takeUntil(this.destroy$)).subscribe(v => (this.loading = v));

    this.decommissionFacade.getError().pipe(takeUntil(this.destroy$)).subscribe((err) => {
      this.showMessage = err;
      if (this.showMessage && this.showMessage.show) {
        this.type = 'error';
        this.launchModal();
      }
    });

    this.decommissionFacade.getSuccess().pipe(takeUntil(this.destroy$)).subscribe((suc) => {
      if (suc && suc.show) {
        this.type = 'success';
        this.showMessage = suc;
        this.launchModal();
      }
    });

    this.decommissionFacade.formConfig$.pipe(takeUntil(this.destroy$)).subscribe(cfg => {
      if (cfg && cfg.steps) {
        this.steps = cfg.steps;
        this.totalSteps = this.steps.length;
        this.buildFieldsForStep(this.currentStep);
      }
    });

    this.decommissionFacade.formData$.pipe(takeUntil(this.destroy$)).subscribe(fd => (this.model = fd || {}));

    this.decommissionFacade.currentStep$.pipe(takeUntil(this.destroy$)).subscribe(s => {
      this.currentStep = s || 0;
      this.buildFieldsForStep(this.currentStep);
    });
  }

  buildFieldsForStep(index: number) {
    const step = this.steps[index];
    this.fields = (step && step.fields) ? step.fields : [];
  }

  onModelChange(m: any) {
    this.decommissionFacade.updateFormData(m);
  }

  next() {
    this.decommissionFacade.markStepCompleted(this.currentStep);
    if (this.currentStep < this.totalSteps - 1) {
      this.decommissionFacade.setCurrentStep(this.currentStep + 1);
    } else {
      // last step -> submit (simulated by effect)
      this.decommissionFacade.submit(this.model);
    }
  }

  prev() {
    if (this.currentStep > 0) {
      this.decommissionFacade.setCurrentStep(this.currentStep - 1);
    }
  }

  goToStep(i: number) {
    this.decommissionFacade.setCurrentStep(i);
  }

  openInfo() {
    this.decommissionFacade.links$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.modalRef = this.modalService.open(DialogComponent, { width: '520px', data: { title: data?.title, templateRef: null, links: data?.links, description: data?.description } });
    });
  }

  launchModal() {
    const modalOptions = {
      width: '28vw',
      data: {
        title: this.type === 'success' ? 'Success' : 'Api Results',
        templateRef: this.errorMessage,
      },
    };
    this.modalRef = this.modalService.open(DialogComponent, modalOptions);

    this.modalRef.afterClosed().pipe(tap(() => this.onModalClosed()), takeUntil(this.destroy$)).subscribe();
  }

  onModalClosed = () => {
    this.decommissionFacade.setError(false, '');
    this.decommissionFacade.setSuccess(false, '');
  };

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
