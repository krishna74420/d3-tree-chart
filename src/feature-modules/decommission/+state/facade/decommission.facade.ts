import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as Actions from '../actions/decommission.actions';
import * as Selectors from '../selector/decommission.selectors';

@Injectable({
  providedIn: 'root'
})
export class DecommissionFacade {
  loading$ = this.store.pipe(select(Selectors.getLoading));
  error$ = this.store.pipe(select(Selectors.getError));
  success$ = this.store.pipe(select(Selectors.getSuccess));
  headerPath$ = this.store.pipe(select(Selectors.getHeaderPath));
  formConfig$ = this.store.pipe(select(Selectors.getFormConfig));
  links$ = this.store.pipe(select(Selectors.getLinks));
  currentStep$ = this.store.pipe(select(Selectors.getCurrentStep));
  completedSteps$ = this.store.pipe(select(Selectors.getCompletedSteps));
  formData$ = this.store.pipe(select(Selectors.getFormData));

  constructor(private store: Store) {}

  setLoading = (v: boolean) => this.store.dispatch(Actions.setLoading({ loading: v }));
  getLoading = () => this.loading$;

  setError = (show: boolean, msg: string) => this.store.dispatch(Actions.setError({ show, msg }));
  getError = () => this.error$;

  setSuccess = (show: boolean, msg: string) => this.store.dispatch(Actions.setSuccess({ show, msg }));
  getSuccess = () => this.success$;

  setHeaderPath = (path: string) => this.store.dispatch(Actions.setHeaderPath({ path }));
  getHeaderPath = () => this.headerPath$;

  loadConfig = () => this.store.dispatch(Actions.loadConfig());
  saveConfigSuccess = (formConfig: any, links: any) => this.store.dispatch(Actions.loadConfigSuccess({ formConfig, links }));
  loadConfigFailure = (error: any) => this.store.dispatch(Actions.loadConfigFailure({ error }));

  setCurrentStep = (i: number) => this.store.dispatch(Actions.setCurrentStep({ stepIndex: i }));
  markStepCompleted = (i: number) => this.store.dispatch(Actions.markStepCompleted({ stepIndex: i }));

  updateFormData = (model: any) => this.store.dispatch(Actions.updateFormData({ model }));

  submit = (model: any) => this.store.dispatch(Actions.submitDecommission({ model }));
  submitSuccess = () => this.store.dispatch(Actions.submitDecommissionSuccess());
  submitFailure = (err: any) => this.store.dispatch(Actions.submitDecommissionFailure({ error: err }));
}
