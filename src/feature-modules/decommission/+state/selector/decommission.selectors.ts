
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { decommissionFeatureKey, State } from '../reducer/decommission.reducer';

const selectFeature = createFeatureSelector<State>(decommissionFeatureKey);

export const selectModel = createSelector(selectFeature, (s) => s.model);
export const selectCurrentStep = createSelector(selectFeature, (s) => s.currentStep);
export const selectTotalSteps = createSelector(selectFeature, (s) => s.totalSteps);
