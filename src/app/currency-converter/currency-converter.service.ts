import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConversionResult } from './models';


@Injectable({
  providedIn: 'root'
})
export class CurrencyConverterService {
  private url = 'https://free.currconv.com/api/v7/convert';
  private apiKey = 'b81eefeb3062211ba6b5';

  constructor(private http: HttpClient) { }

  doConvert(value: number, from: string, to: string): Observable<number> {
    const key = `${from}_${to}`;
    const params = new HttpParams()
      .append('apiKey', this.apiKey)
      .append('q', key);

    return this.http.get<ConversionResult>(this.url, { params }).pipe(
      map(res => {
        const currentVal = res.results[key].val;
        if (currentVal) {
          return value * currentVal;
        }
      })
    );
  }
}
