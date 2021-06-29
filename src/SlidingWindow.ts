import { Observable } from "rxjs";

export function SlidingWindow<T>(
  count: number,
  src: Observable<T>
): Observable<T[]> {
  return new Observable<T[]>((s) => {
    const arr = new Array<T>();
    const subscription = src.subscribe({
      next: (v) => {
        if (s.closed) {
          subscription.unsubscribe();
        }
        arr.push(v);
        if (arr.length == count) {
          s.next([...arr]);
          arr.shift();
        }
      },
      error: (err) => {
        s.error(err);
      },
      complete: () => {
        s.complete();
      }
    });
  });
}
