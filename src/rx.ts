import { Observable, Observer } from "rxjs";
import { tap } from "rxjs/operators";
import { LogLike } from "@codianz/loglike";

function anytos(a: any){
  switch(typeof a){
    case "number": return a.toString();
    case "bigint": return a.toString();
    case "boolean": return a.toString();
    case "function":  return "(function)";
    case "symbol": return "(symbol)";
    case "undefined": return "(undefined)";
    case "string" : return a;
    case "object": {
      if(typeof a["toString"] === "function"){
        return a.toString();
      }
      break;
    }
  }
  return "(unknown)";
}

let log_index = 0;

export function doSubscribe(log: LogLike, s: string, o: Observable<unknown>) {
  const index = ++log_index;

  log.debug(`[${s}:#${index}] start subscribe`);
  o.subscribe({
    next: (j) => {
      log.debug(`[${s}:#${index}] on next\n${anytos(j)}`);
    },
    error: (err) => {
      log.debug(`[${s}:#${index}] on error\n${anytos(err)}`);
    },
    complete: () => {
      log.debug(`[${s}:#${index}] on completed`);
    }
  });
}

export function readySetGo<T>(ready: () => void, observable: Observable<T>) {
  return new Observable<T>((observer) => {
    observable.subscribe({
      next: (v) => {
        observer.next(v);
      },
      error: (err) => {
        observer.error(err);
      },
      complete: () => {
        observer.complete();
      }
    });
    ready();
  });
}

let peep_index = 0;

export function peep<T>(log: LogLike, s: string) {
  const index = ++peep_index;
  return tap<T>({
    next: (j) => {
      log.debug(`[${s}:#${index}] on next\n${anytos(j)}`);
    },
    error: (err) => {
      log.debug(`[${s}:#${index}] on error\n${anytos(err)}`);
    },
    complete: () => {
      log.debug(`[${s}:#${index}] on completed`);
    }
  });
}
