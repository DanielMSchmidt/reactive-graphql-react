import { useState, useEffect } from "react";

export default function useObservable(observable$, initialValue) {
  const [value, update] = useState(initialValue);
  const [error, updateError] = useState(null);

  useEffect(
    () => {
      const s = observable$.subscribe(update, updateError);
      return () => s.unsubscribe();
    },
    [observable$]
  );

  return [value, error];
}
