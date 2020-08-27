const { playType } = require('./constContainer')
const format = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
}).format;

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = caculateThisAmount(perf, play);
    volumeCredits = calulateVolumeCredits(volumeCredits, perf, play);
    result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result;
}

function caculateThisAmount(perf, play) {
  let thisAmount = 0;
  switch (play.type) {
    case playType.TRAGEDY:
      thisAmount = 40000;
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
      }
      return thisAmount;
    case playType.COMEDY:
      thisAmount = 30000;
      if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
      }
      thisAmount += 300 * perf.audience;
      return thisAmount;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
}

function calulateVolumeCredits(volumeCredits, perf, play) {
  let result = volumeCredits + Math.max(perf.audience - 30, 0);
  if ('comedy' === play.type) {
    result += Math.floor(perf.audience / 5);
  }
  return result;
}

function convertStatementToHtml(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `<h1>Statement for ${invoice.customer}</h1>\n`+'<table>\n' +
  '<tr><th>play</th><th>seats</th><th>cost</th></tr>';


  //   '<tr><td>Hamlet</td><td>55</td><td>$650.00</td></tr>\n' +
  //   '<tr><td>As You Like It</td><td>35</td><td>$580.00</td></tr>\n' +
  //   '<tr><td>Othello</td><td>40</td><td>$500.00</td></tr>\n' +
  //   '</table>\n' +
  //   '<p>Amount owed is <em>$1,730.00</em></p>\n' +
  //   '<p>You earned <em>47</em> credits</p>\n');
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = caculateThisAmount(perf, play);
    volumeCredits = calulateVolumeCredits(volumeCredits, perf, play);
    result += `<tr><td>${play.name}</td><td>${perf.audience}</td><td>${format(thisAmount / 100)}</td></tr>\n`;
    totalAmount += thisAmount;
  }
  result += `</table>\n<p>Amount owed is <em>${format(totalAmount / 100)}</em></p>\n`;
  result += `<p>You earned <em>${volumeCredits}</em> credits</p>\n`;
  return result;
}

module.exports = {
  statement,
  convertStatementToHtml
};
