
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DecommissionService {
  constructor(private http: HttpClient) {}

  loadFormConfig(): Observable<any> {
    return this.http.get('assets/config/decommission-form.json');
  }

  loadLinks(): Observable<any> {
    return this.http.get('assets/config/decommission-links.json');
  }
}
