import { interval } from 'rxjs';
import { tap } from 'rxjs/operators';


interval(1000)
​ 	.pipe(
​ 	  tap(val => {
​ 	    console.log(​'inside tap'​, val);
​ 	    ​// This return doesn't change the final value​
​ 	    ​return​ val * 100;
​ 	  })
​ 	)
​ 	.subscribe(val => console.log(​'inside subscribe'​, val));