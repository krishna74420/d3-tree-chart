import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LinksService {
  private url = 'assets/config/decommission-links.json';
  constructor(private http: HttpClient) {}
  getGlobalLinks(): Observable<any> { return this.http.get(this.url); }
}
