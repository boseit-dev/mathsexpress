interface AppConfig {
  readonly name: string;
  readonly version: string;
  readonly locale: string;
  /** True while the app runs on development sample data instead of real accounts. */
  readonly usesSampleData: boolean;
}

export const appConfig: AppConfig = {
  name: 'MathsExpress',
  version: __APP_VERSION__,
  locale: 'en-AU',
  // Phase 1 has no backend: every screen reads development sample data (src/data/sample).
  usesSampleData: true,
};
