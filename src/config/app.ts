interface AppConfig {
  readonly name: string;
  readonly version: string;
  readonly locale: string;
  /** True while parts of the app (home-page tasks, progress, rewards) show sample data. */
  readonly usesSampleData: boolean;
}

export const appConfig: AppConfig = {
  name: 'MathsExpress',
  version: __APP_VERSION__,
  locale: 'en-AU',
  // Accounts and classes are real; home-page tasks, progress and rewards are sample data.
  usesSampleData: true,
};
