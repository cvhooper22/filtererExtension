// marks if this child index of a game log row has a link
const SRIndexHasLink = {
  1: true,
  2: true,
  4: true,
};

function onStartMessage (message, sender) {
  console.log('*** in content.js ***');
  console.log('message is: ', message);
  console.log('sender is: ', sender);
  console.log('url is', location.href);
  const gameRowsList = document.querySelectorAll('table#gamelog > tbody > tr');
  const gameRows = Array.from(gameRowsList);
  const gameTotal = gameRows.length;
  const totals =  gameRows.reduce((agg, row, idx) => {
    const stats = Array.from(row.children);
    stats.forEach((statEl, statIdx) => {
      if (statIdx > 6) {
        const stat = statEl.getAttribute('data-stat');
        const val = +statEl.textContent;
        if (idx === 0) {
          console.log('statEl', statEl);
          console.log('stat', stat);
          console.log('val', val);
        }
        if (!stat.includes('pct')) {
          const currVal = agg[stat];
          if (!currVal) {
            agg[stat] = val;
          } else {
            agg[stat] += val;
          }
        }
      }
    });
    return agg;
  }, {});
  totals['fg_pct'] = totals.fg / totals.fga;
  totals['fg2_pct'] = totals.fg2 / totals.fg2a;
  totals['fg3_pct'] = totals.fg3 / totals.fg3a;
  totals['ft_pct'] = totals.ft / totals.fta;
  console.log('totals', totals);
  const totalsRow = document.querySelector('table#gamelog > tfoot > tr');
  Array.from(totalsRow.children).forEach((totalStatEl, idx) => {
    if (idx === 1) {
      // games total cell
      totalStatEl.textContent = `${gameTotal} Games`;
    } else if (idx > 6) {
      const statName = totalStatEl.getAttribute('data-stat');
      let val = totals[statName];
      if (statName.includes('pct')) {
        val = val.toFixed(3).slice(1);
      }
      totalStatEl.textContent = val;
    }
  });
}

function getSite() {
  const windowUrl = location.href;
  console.log('the windowUrl is: ', windowUrl);
  let site = '';
  if (windowUrl.includes('sports-reference')) {
    site = 'SR';
  } else if (windowUrl.includes('kenpom')) {
    site = 'KP';
  } else if (windowUrl.includes('haslametrics')) {
    site = 'H';
  }
  return site;
}

async function init () {
  console.log('init iin content.js');
  const response = await chrome.runtime.sendMessage({action: "init", site: getSite()});
  // do something with response here, not outside the function
  console.log(response);
}

chrome.runtime.onMessage.addListener(onStartMessage);
// init();
