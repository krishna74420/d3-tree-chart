import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-decommission-ui',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, FormlyMaterialModule, MatButtonModule, MatIconModule, MatDialogModule, MatToolbarModule],
  templateUrl: './decommission-ui.component.html',
  styleUrls: ['./decommission-ui.component.scss']
})
export class DecommissionUiComponent implements OnChanges {
  @Input() loading: boolean = false;
  @Input() steps: any[] = [];
  @Input() currentStep: number = 0;
  @Input() totalSteps: number = 0;
  @Input() fields: any[] = [];
  @Input() model: any = {};

  // local mutable model for Formly to avoid "object not extensible" errors
  localModel: any = {};

  @Output() modelChange = new EventEmitter<any>();
  @Output() nextStep = new EventEmitter<void>();
  @Output() prevStep = new EventEmitter<void>();
  @Output() goToStep = new EventEmitter<number>();
  @Output() openInfo = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model']) {
      // create a shallow clone so Formly can modify it
      this.localModel = this.model ? JSON.parse(JSON.stringify(this.model)) : {};
    }
  }

  stepCompleted(i:number){
    const step=this.steps[i];
    if(!step) return false;
    const keys=(step.fields||[]).map((f:any)=>f.key);
    for(const k of keys){ if(this.localModel && this.localModel[k]!==undefined && this.localModel[k]!==null && this.localModel[k]!=='') return true; }
    return false;
  }

  bubbleClass(index: number) {
    const s = this.stepCompleted(index) ? 'completed' : (index===this.currentStep ? 'current' : 'pending');
    return {
      'bubble-completed': s === 'completed',
      'bubble-current': s === 'current',
      'bubble-pending': s === 'pending'
    };
  }

  onModelChange(ev: any) {
    // propagate changes up via event with the updated values
    this.modelChange.emit(ev);
  }
}
