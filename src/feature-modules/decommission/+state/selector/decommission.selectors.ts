import { createFeatureSelector, createSelector } from '@ngrx/store';
import { decommissionFeatureKey, DecommissionState } from '../reducer/decommission.reducer';

export const selectDecommissionState = createFeatureSelector<DecommissionState>(decommissionFeatureKey);

export const getLoading = createSelector(selectDecommissionState, (s) => s.loading);
export const getError = createSelector(selectDecommissionState, (s) => s.Error);
export const getSuccess = createSelector(selectDecommissionState, (s) => s.Success);
export const getHeaderPath = createSelector(selectDecommissionState, (s) => s.headerPath);
export const getFormConfig = createSelector(selectDecommissionState, (s) => s.formConfig);
export const getLinks = createSelector(selectDecommissionState, (s) => s.links);
export const getCurrentStep = createSelector(selectDecommissionState, (s) => s.currentStepIndex);
export const getCompletedSteps = createSelector(selectDecommissionState, (s) => s.completedSteps);
export const getFormData = createSelector(selectDecommissionState, (s) => s.formData);
