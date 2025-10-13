
import { createReducer, on } from '@ngrx/store';
import * as Actions from '../actions/decommission.actions';
import { DecommissionModel } from '../../interface/decommission.model';

export const decommissionFeatureKey = 'decommission';

export interface State {
  model: DecommissionModel;
  currentStep: number;
  totalSteps: number;
}

export const initialState: State = {
  model: {},
  currentStep: 0,
  totalSteps: 0
};

export const reducer = createReducer(
  initialState,
  on(Actions.loadDraft, (s, { draft }) => ({ ...s, model: { ...s.model, ...draft } })),
  on(Actions.saveProgress, (s, { model }) => ({ ...s, model: { ...s.model, ...model } })),
  on(Actions.nextStep, (s) => ({ ...s, currentStep: Math.min(s.totalSteps - 1 || 8, s.currentStep + 1) })),
  on(Actions.prevStep, (s) => ({ ...s, currentStep: Math.max(0, s.currentStep - 1) })),
  on(Actions.setStep, (s, { step }) => ({ ...s, currentStep: Math.max(0, Math.min(s.totalSteps - 1 || 8, step)) })),
);
