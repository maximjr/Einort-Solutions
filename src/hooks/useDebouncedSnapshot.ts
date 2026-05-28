import { useEffect, useRef } from 'react';
import { onSnapshot, Query, DocumentData, QuerySnapshot, CollectionReference } from 'firebase/firestore';

export function useDebouncedSnapshot(
  query: Query<DocumentData> | CollectionReference<DocumentData> | null,
  onData: (snapshot: QuerySnapshot<DocumentData>) => void,
  delay: number = 800,
  onError?: (error: Error) => void
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onDataRef = useRef(onData);
  const onErrorRef = useRef(onError);

  // Always keep latest callback refs
  useEffect(() => {
    onDataRef.current = onData;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    if (!query) return;

    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          onDataRef.current(snapshot);
        }, delay);
      },
      (err) => {
        if (onErrorRef.current) onErrorRef.current(err);
      }
    );

    return () => {
      unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, delay]); // Make sure query is memoized in the component using useMemo
}

