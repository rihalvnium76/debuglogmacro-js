export interface Log {
  (...v: any): void;
  h(n: number): string;
  t(...v: any): void;
  s(...v: any): void;
}
export declare function LogFactory(tag: string, parentLog?: Log): Log;