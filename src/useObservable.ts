import { useState, useEffect } from "react";
import { Observable } from "rxjs";

export default function useObservable<T, E>(
  observable$: Observable<T>,
  initialValue: T | null = null
): [T, E] {
  const [value, update] = useState(initialValue);
  const [error, updateError] = useState(null);

  useEffect(() => {
    const s = observable$.subscribe(update, updateError);

    return () => s.unsubscribe();
  }, [observable$]);

  return [value, error];
}
