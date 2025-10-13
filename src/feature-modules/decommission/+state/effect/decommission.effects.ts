
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import * as ActionsList from '../actions/decommission.actions';

@Injectable()
export class DecommissionEffects {
  save$ = createEffect(() => this.actions$.pipe(
    ofType(ActionsList.saveProgress),
    tap((action) => {
      try { localStorage.setItem('ait_decommission_draft', JSON.stringify(action.model)); }
      catch(e) { console.warn('Auto-save failed', e); }
    })
  ), { dispatch: false });

  constructor(private actions$: Actions) {}
}
