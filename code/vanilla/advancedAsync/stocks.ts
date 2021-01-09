declare var Chart;

import { merge, fromEvent, of, combineLatest } from 'rxjs';
import { scan, map, tap } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';

let config = {
  type: 'line',
  data: {
    labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    datasets: []
  },
  options: {
    legend: {
      onClick: () => { }
    },
    animation: false,
    responsive: true,
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      xAxes: [{
        display: true,
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Value'
        }
      }]
    }
  }
};

let colorMap = {
  ABC: 'rgb(255, 99, 132)',
  DEF: 'rgb(75, 192, 192)',
  GHI: 'rgb(54, 162, 235)',
  JKL: 'rgb(153, 102, 255)'
};

let ctx = document.querySelector('canvas').getContext('2d');
let stockChart = new Chart(ctx, config);

let abcEl = <HTMLElement>document.querySelector('.abc');
let defEl = <HTMLElement>document.querySelector('.def');
let ghiEl = <HTMLElement>document.querySelector('.ghi');
let jklEl = <HTMLElement>document.querySelector('.jkl');

let endpoint = 'ws://localhost:3000/api/advancedAsync/stock-ws';
let stockStream$ = webSocket(endpoint).pipe(
  scan((accumulatedData: any, nextItem: any) => {
    accumulatedData.push(nextItem);
    if (accumulatedData.length > 10) {
      accumulatedData.shift();
    }
    return accumulatedData;
  }, []),
  map(newDataSet => {
    let intermediary = newDataSet.reduce((prev, datum) => {
      datum.forEach(d => {
        if (!prev[d.label]) {
          prev[d.label] = [];
        }
        prev[d.label].push(d.price);
      })
      return prev;
    }, {});
    return Object.keys(intermediary).map(key => {
      return {
        label: key,
        data: intermediary[key],
        fill: false,
        backgroundColor: colorMap[key],
        borderColor: colorMap[key]
      }
    })
  }),
);

function makeCheckboxStream(checkboxEl, stockName) {
  return merge(
    fromEvent(checkboxEl, 'change'),
    of({target: { checked: true }})
  )
  .pipe(
    map(e => e.target.checked), 
    map(isEnabled => ({
      isEnabled,
      stock: stockName
    }))
  );
}

let settings$ = combineLatest(
  makeCheckboxStream(abcEl, 'abc'),
  makeCheckboxStream(defEl, 'def'),
  makeCheckboxStream(ghiEl, 'ghi'),
  makeCheckboxStream(jklEl, 'jkl')
).pipe(
  map(stockBoxes => { 
    return stockBoxes
    .filter(stockBox => stockBox.isEnabled === true)
    .map(stockBox => stockBox.stock);
    })
);

combineLatest(
  settings$,
  stockStream$,
).pipe(
  map(stocks => {
    return stocks[1].filter(stockHistory => {
      return stocks[0].includes(stockHistory.label.toLowerCase());
    })
  })
).subscribe(newDataSet => {
  config.data.datasets = newDataSet;
  stockChart.update();
}, err => console.error(err))