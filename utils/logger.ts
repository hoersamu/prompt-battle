/* eslint-disable no-console */
export class Logger {
  private static shouldLog() {
    return import.meta.dev;
  }

  public static log(...params: Parameters<typeof console.log>) {
    if (this.shouldLog())
      console.log(...params);
  };

  public static warn(...params: Parameters<typeof console.warn>) {
    if (this.shouldLog())
      console.warn(...params);
  };

  public static error(...params: Parameters<typeof console.error>) {
    console.error(...params);
  };
}
