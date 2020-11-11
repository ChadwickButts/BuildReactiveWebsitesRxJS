import { interval } from 'rxjs';
import { tap } from 'rxjs/operators';

let outsideVar: number = 0;
interval(1000)
​ 	.pipe(
​ 	  tap(val => {
​ 	    console.log(​'inside tap'​, val);
​ 	    ​outsideVar = val * 100; // assignment works in tap
​ 	    ​// This return doesn't change the final value
        return val * 10;
​ 	  })
​ 	)
​ 	.subscribe(val => {
        console.log(​'inside subscribe'​, val);
        console.log(outsideVar);
    });