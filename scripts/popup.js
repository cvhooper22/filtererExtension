const state = {
  site: '',
  SR: {
    gameData: [],
  },
  KP: {},
  H: {},
};

function onInit(message, sender, sendResponse) {
  console.log('init received');
  console.log('message: ', message);
  console.log('sender', sender);
  sendResponse({received: true});
}

chrome.runtime.onMessage.addListener(onInit);

document.getElementById('totalsButton').addEventListener('click', async function() {
  console.log('clicked button');
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  chrome.tabs.sendMessage(tab.id, {action: "calculateTotals"});
});