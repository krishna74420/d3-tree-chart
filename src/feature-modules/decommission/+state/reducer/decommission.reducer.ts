import { createReducer, on } from '@ngrx/store';
import * as Actions from '../actions/decommission.actions';
import { DecommissionModel } from '../../interface/decommission.model';

export const decommissionFeatureKey = 'decommission';

export interface DecommissionState {
  loading: boolean;
  Error: { show: boolean; msg: string } | null;
  Success: { show: boolean; msg: string } | null;
  headerPath: string;
  formConfig: any | null;
  links: any | null;
  currentStepIndex: number;
  completedSteps: number[];
  formData: Partial<DecommissionModel>;
}

export const initialState: DecommissionState = {
  loading: false,
  Error: null,
  Success: null,
  headerPath: '',
  formConfig: null,
  links: null,
  currentStepIndex: 0,
  completedSteps: [],
  formData: {}
};

const _decommissionReducer = createReducer(
  initialState,
  on(Actions.setLoading, (s, { loading }) => ({ ...s, loading })),
  on(Actions.setError, (s, payload) => ({ ...s, Error: { show: payload.show, msg: payload.msg } })),
  on(Actions.setSuccess, (s, payload) => ({ ...s, Success: { show: payload.show, msg: payload.msg } })),
  on(Actions.setHeaderPath, (s, { path }) => ({ ...s, headerPath: path })),
  on(Actions.loadConfigSuccess, (s, { formConfig, links }) => ({ ...s, formConfig, links })),
  on(Actions.setCurrentStep, (s, { stepIndex }) => ({ ...s, currentStepIndex: stepIndex })),
  on(Actions.markStepCompleted, (s, { stepIndex }) => ({ ...s, completedSteps: Array.from(new Set([...s.completedSteps, stepIndex])) })),
  on(Actions.updateFormData, (s, { model }) => ({ ...s, formData: { ...s.formData, ...model } })),
  on(Actions.submitDecommissionSuccess, (s) => ({ ...s, Success: { show: true, msg: 'Decommission submitted successfully' } })),
  on(Actions.submitDecommissionFailure, (s, { error }) => ({ ...s, Error: { show: true, msg: error } }))
);

export function DecommissionReducer(state: any | undefined, action: any) {
  return _decommissionReducer(state, action);
}
