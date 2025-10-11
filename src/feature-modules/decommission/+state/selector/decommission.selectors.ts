import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featureKey, State } from '../reducer/decommission.reducer';

const selectFeature = createFeatureSelector<State>(featureKey);

export const selectModel = createSelector(selectFeature, (s) => s.model);
export const selectCurrentStep = createSelector(selectFeature, (s) => s.currentStep);
export const selectTotalSteps = createSelector(selectFeature, (s) => s.totalSteps);
