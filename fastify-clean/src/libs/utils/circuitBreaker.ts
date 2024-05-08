import { handleAll, retry, timeout, TimeoutStrategy, wrap } from 'cockatiel';
import { secondsToMilliseconds } from 'date-fns';

export function createCircuitBreaker(maxAttempts = 3, maxTimeoutSeconds = 3) {
  const retryPolicy = retry(handleAll, { maxAttempts });

  const timeoutPolicy = timeout(
    secondsToMilliseconds(maxTimeoutSeconds),
    TimeoutStrategy.Aggressive,
  );

  const circuitBreaker = wrap(retryPolicy, timeoutPolicy);

  return circuitBreaker;
}
