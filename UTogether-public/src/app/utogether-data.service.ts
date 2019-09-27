import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Event } from './event-list/event-list.component';

@Injectable({
  providedIn: 'root'
})
export class UTogetherDataService {
  private apiBaseUrl = 'http://localhost:3000/api';

  public getEvents(): Promise<Event[]> {
    const lng: number = -0.7992599;
    const lat: number = 51.378091;
    const maxDistance: number = 20;
    const url: string = `${this.apiBaseUrl}/events?lng=${lng}&lat=${lat}&maxDistance=${maxDistance}`;
    return this.http
      .get(url)
      .toPromise()
      .then(response => response as Event[])
      .catch(this.handleError);
  }
  
  private handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }
  
  
  constructor(private http: HttpClient) { }
}
