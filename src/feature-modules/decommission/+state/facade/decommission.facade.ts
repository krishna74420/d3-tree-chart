
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as Actions from '../actions/decommission.actions';
import { selectModel, selectCurrentStep, selectTotalSteps } from '../selector/decommission.selectors';

@Injectable({ providedIn: 'root' })
export class DecommissionFacade {
  model$ = this.store.select(selectModel);
  currentStep$ = this.store.select(selectCurrentStep);
  totalSteps$ = this.store.select(selectTotalSteps);

  constructor(private store: Store) {}

  saveProgress(model: any) { this.store.dispatch(Actions.saveProgress({ model })); }
  next() { this.store.dispatch(Actions.nextStep()); }
  prev() { this.store.dispatch(Actions.prevStep()); }
  setStep(step: number) { this.store.dispatch(Actions.setStep({ step })); }
  submit(model: any) { this.store.dispatch(Actions.submit({ model })); }
}
