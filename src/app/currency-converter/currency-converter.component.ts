import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { CurrencyConverterService } from './currency-converter.service';
import { Currency } from './models';
import { Subscription, interval } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css']
})
export class CurrencyConverterComponent implements OnInit, OnDestroy {

  currencyList: Currency[] = [
    { code: 'BRL', symbol: 'R$' },
    { code: 'BTC', symbol: '₿' },
    { code: 'EUR', symbol: '€' },
    { code: 'USD', symbol: '$' },
  ];
  form: FormGroup;
  convertedTime: Date;
  convertedValue: number;
  symbol: string;
  subscription: Subscription;
  scheduler: Subscription;
  errorMessage: string;

  constructor(
    public translate: TranslateService,
    private service: CurrencyConverterService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.subscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      const currency = event.lang === 'en' ? 'USD' : 'BRL';
      this.form.patchValue({
        from: currency,
        to: null
      });
    });
    this.form = this.formBuilder.group({
      value: [null, Validators.required],
      from: [null, Validators.required],
      to: [null, Validators.required],
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  public doConvert(): void {
    const { value, from, to } = this.form.value;
    this.fetch(value, from, to);
    this.schedule(value, from, to);
  }

  private fetch(value, from, to): void {
    this.service.doConvert(value, from, to).subscribe(
      val => {
        this.convertedValue = val;
        this.convertedTime = new Date();
        this.symbol = this.currencyList.find(c => c.code === to).symbol;
      },
      (err: HttpErrorResponse) => {
        // devia tratar todos os possíveis erros
        this.errorMessage = 'HOME.API_LIMIT_REACHED';
        this.clearScheduler();
      }
    );
  }

  private clearScheduler(): void {
    if (this.scheduler) {
      this.scheduler.unsubscribe();
    }
  }

  private schedule(value, from, to): void {
    this.clearScheduler();
    this.scheduler = interval(15000).subscribe(() => this.fetch(value, from, to));

  }

}
