import { fromEvent } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

let draggable = <HTMLElement>document.querySelector("#draggable");

let mouseDown$ = fromEvent<MouseEvent>(draggable, 'mousedown');
let mouseMove$ = fromEvent<MouseEvent>(draggable, 'mousemove');
let mouseUp$ = fromEvent<MouseEvent>(draggable, 'mouseup');

mouseDown$.subscribe(() => {
    mouseMove$.pipe(
        map(event => {
            event.preventDefault();
            return {
                x: event.clientX,
                y: event.clientY
            }
        }),
        takeUntil(mouseUp$)
    ).subscribe(pos => {
        draggable.style.left = pos.x + 'px';
        draggable.style.top = pos.y + 'px';
    });
});