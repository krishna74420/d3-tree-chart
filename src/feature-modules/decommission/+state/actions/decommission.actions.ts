import { createAction, props } from '@ngrx/store';
import { DecommissionModel } from '../../interface/decommission.model';

export const loadDraft = createAction('[Decommission] Load Draft', props<{ draft: DecommissionModel }>());

export const saveProgress = createAction('[Decommission] Save Progress', props<{ model: DecommissionModel }>());

export const nextStep = createAction('[Decommission] Next Step');
export const prevStep = createAction('[Decommission] Prev Step');
export const setStep = createAction('[Decommission] Set Step', props<{ step: number }>());

export const submit = createAction('[Decommission] Submit', props<{ model: DecommissionModel }>());

export const savedToStorage = createAction('[Decommission] Saved To Storage');
