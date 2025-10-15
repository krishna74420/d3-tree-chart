import { createAction, props } from '@ngrx/store';
import { DecommissionModel } from '../../interface/decommission.model';

export const setLoading = createAction('[Decommission] Set Loading', props<{ loading: boolean }>());

export const getLoading = createAction('[Decommission] Get Loading');

export const setError = createAction('[Decommission] Show/Hide Error', props<{ show: boolean; msg: string }>());

export const setSuccess = createAction('[Decommission] Show/Hide Success', props<{ show: boolean; msg: string }>());

export const setHeaderPath = createAction('[Decommission] Set Header Path', props<{ path: string }>());

export const getHeaderPath = createAction('[Decommission] Get Header Path');

export const loadConfig = createAction('[Decommission] Load Config');

export const loadConfigSuccess = createAction('[Decommission] Load Config Success', props<{ formConfig: any; links: any }>());

export const loadConfigFailure = createAction('[Decommission] Load Config Failure', props<{ error: any }>());

export const setCurrentStep = createAction('[Decommission] Set Current Step', props<{ stepIndex: number }>());

export const markStepCompleted = createAction('[Decommission] Mark Step Completed', props<{ stepIndex: number }>());

export const updateFormData = createAction('[Decommission] Update Form Data', props<{ model: Partial<DecommissionModel> }>());

export const submitDecommission = createAction('[Decommission] Submit', props<{ model: DecommissionModel }>());

export const submitDecommissionSuccess = createAction('[Decommission] Submit Success');

export const submitDecommissionFailure = createAction('[Decommission] Submit Failure', props<{ error: any }>());
