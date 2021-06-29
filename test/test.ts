import { interval, of, timer } from "rxjs";
import { map, mergeMap, take, takeLast } from "rxjs/operators";
import * as ll from "@codianz/loglike";
import * as rx from "../src";
import { peep, SlidingWindow } from "../src";

function asyncFunction(n: number) {
  return interval(n * 1000)
  .pipe(take(1))
  .pipe(map(() => {
    return n;
  }))
}

rx.doSubscribe(
  ll.Console,
  "tests",
  of(Array.from(new Array(10)).map((v,i) => i))
  .pipe(mergeMap((arr) => {
    const ifr = new rx.InflowRestriction(5, ll.Console);
    return ifr.enterWithArray("enterWithArray", arr, (n) => {
      return asyncFunction(n)
    })
  }))
  .pipe(peep(ll.Console, "enterWithArray"))
  .pipe(takeLast(1))
  .pipe(mergeMap(() => {
    const obCouner = timer(0, 500).pipe(take(20))
    return SlidingWindow(5, obCouner)
  }))
  .pipe(peep(ll.Console, "SlidingWindow"))
);
