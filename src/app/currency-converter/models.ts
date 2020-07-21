type ALLOWED_CURRENCYES = 'BRL' | 'USD' | 'EUR' | 'BTC';

export interface Currency {
  code: ALLOWED_CURRENCYES;
  symbol: 'R$' | '$' | '€' | '₿';
}

export interface ConversionResult {
  query: { count: number };
  results: { [k: string]: Converted };
}

export interface Converted {
  fr: ALLOWED_CURRENCYES;
  id: string;
  to: ALLOWED_CURRENCYES;
  val: number;
}
