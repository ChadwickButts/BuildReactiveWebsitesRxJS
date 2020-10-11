import { fromEvent, interval, Observable } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

let startButton = document.querySelector("#start-button");
let stopButton = document.querySelector("#stop-button");
let lapButton = document.querySelector("#lap-button");
let resultsArea = document.querySelector<HTMLElement>('.output'); // this is defining the return type of the queryselector (typescript)

let tenthSecondRxJs$ = interval(100);
let startClick$ = fromEvent(startButton, 'click');
let stopClick$ = fromEvent(stopButton, 'click');
let lapClick$ = fromEvent(lapButton, 'click');

let tenthSecondCustom$ = new Observable(observer => {
    let counter = 0;
    observer.next(counter);

    let intervalTimer = setInterval(() => {
        counter++;
        observer.next(counter);
    }, 100);

    return function unsubscribe() { clearInterval(intervalTimer) };
});

// multiple clicks of start button causes multiple streams to start 
startClick$.subscribe(() => {
    let count = 0;
    let lap = false;

    lapClick$.subscribe(() => {
        lap = !lap;
    });

    tenthSecondRxJs$.pipe(
        map(num => num / 10),
        takeUntil(stopClick$)
    ).subscribe(
        num => {
            if (!lap) {
                resultsArea.innerText = num + 's';
            }
        });
});




