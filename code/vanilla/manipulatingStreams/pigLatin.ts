import { from, fromEvent } from "rxjs";
import { map, mergeMap, reduce, tap } from "rxjs/operators";

let textbox = <HTMLElement>document.querySelector('#text-input');
let results = <HTMLElement>document.querySelector('#results');

function pigLatinify(word) {
    if (word.length < 2) {
        return word;
    }  
    return word.slice(1) + '-' + word[0].toLowerCase() + 'ay';
}

let keyUp$ = fromEvent(textbox, 'keyup').pipe(
    map(event => event.target['value']),
    mergeMap(wordString => from(
            wordString.split(/\s+/)
        ).pipe(
            tap(console.log),
            map(pigLatinify),
            reduce((bigString, newWord) => bigString + ' ' + newWord, '')
        )
    )
);
keyUp$.subscribe(translated => console.log(translated));

// Reduce example

from([1,2,3]).pipe(
    reduce((accumulator, value) => accumulator + value, 0)
).subscribe(console.log);