import { fromEvent, merge, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, filter, distinctUntilChanged, debounceTime, tap, switchMap, catchError, pluck } from 'rxjs/operators';


let endpoint = `http://localhost:3000/api/advancedAsync/stackoverflow/`;
let searchBar = <HTMLElement>document.querySelector('input');
let resultsArea = <HTMLElement>document.querySelector('.results');
let loadingEl = <HTMLElement>document.querySelector('.loader');

function displayResults(results) {
  resultsArea.innerHTML = '';
  let listEl = document.createElement('ul');
  results.forEach(question => {
    let li = document.createElement('li');
    let a = document.createElement('a');
    a.href = question.link;
    a.innerHTML = question.title;
    li.appendChild(a);
    listEl.appendChild(li);
  });
  resultsArea.appendChild(listEl);
}

fromEvent(searchBar, 'keyup').pipe(
  pluck('target', 'value'),
  filter((query: string) => query.length > 3),
  distinctUntilChanged(),
  debounceTime(333),
  tap(() => loadingEl.style.display = 'block'),
  switchMap(query => ajax(endpoint + query)),
  catchError((error, caught$) => merge(of(error), caught$)),
  tap(() => loadingEl.style.display = 'none')
).subscribe(function updatePageOrErr(results){
  if (results.error) {
    alert(results.error);
  } else {
    displayResults(results.data)
  }
}, err => alert(err.message)
)
