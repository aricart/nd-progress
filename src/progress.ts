/**
 * A generic interface wrapper for a progress bar
 */
export interface Progress {
  /**
   * Updates the bar by the specified amount
   * @param n
   */
  update(n: number): Promise<void>;

  /**
   * Writes a message on top of the bar
   * @param s
   */
  message(s: string): Promise<void>;

  /**
   * Logs a message with a timestamp
   * @param s
   */
  log(s: string): Promise<void>;

  /**
   * Stops the progress bar
   */
  stop(): void;
}
