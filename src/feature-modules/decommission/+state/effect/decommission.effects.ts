import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ActionsList from '../actions/decommission.actions';
import { DecommissionService } from '../../service/decommission.service';
import { DecommissionFacade } from '../facade/decommission.facade';
import { switchMap, tap, delay, catchError } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Injectable()
export class DecommissionEffects {
  constructor(private actions$: Actions, private svc: DecommissionService, private facade: DecommissionFacade) {}

  loadConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionsList.loadConfig),
      switchMap(() => {
        this.facade.setLoading(true);
        return forkJoin({ formConfig: this.svc.getFormConfig(), links: this.svc.getLinks() }).pipe(
          tap(res => {
            this.facade.saveConfigSuccess(res.formConfig, res.links);
            this.facade.setError(false, '');
            this.facade.setLoading(false);
          }),
          catchError(err => {
            this.facade.setLoading(false);
            this.facade.setError(true, `${err?.message ?? err}`);
            return of(ActionsList.loadConfigFailure({ error: err }));
          })
        );
      })
    ),
    { dispatch: false }
  );

  submit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActionsList.submitDecommission),
      switchMap(({ model }) => {
        this.facade.setLoading(true);
        // simulate saving in store (no HTTP) and return success
        return of(true).pipe(
          delay(600),
          tap(() => {
            this.facade.setLoading(false);
            this.facade.submitSuccess();
            this.facade.setSuccess(true, 'Decommission submitted successfully');
          })
        );
      })
    ),
    { dispatch: false }
  );
}
