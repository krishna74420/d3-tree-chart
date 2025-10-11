import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import * as ActionsList from '../actions/decommission.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class DecommissionEffects {
  save$ = createEffect(() => this.actions$.pipe(
    ofType(ActionsList.saveProgress),
    tap((action) => {
      try { localStorage.setItem('ait_decommission_draft', JSON.stringify(action.model)); }
      catch(e) { console.warn('Auto-save failed', e); }
    })
  ), { dispatch: false });

  loadOnInit$ = createEffect(() => this.actions$.pipe(
    ofType('[App] Init'),
    tap(() => {
      const raw = localStorage.getItem('ait_decommission_draft');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          this.store.dispatch(ActionsList.loadDraft({ draft: parsed }));
        } catch {}
      }
    })
  ), { dispatch: false });

  constructor(private actions$: Actions, private store: Store) {}
}
