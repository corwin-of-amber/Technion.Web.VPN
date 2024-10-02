chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  (async () => {
    self.tab = await chrome.tabs.query({ currentWindow: true, active: true });
    if (message.action == 'open') { sendResponse(await extractCookies()); }
    if (message.action == 'clear') clearCookies();
  })();
  return true; // to allow async response
});


async function extractCookies() {
  let cookies = await chrome.cookies.getAll({});
  console.log(cookies);
    // You can send the cookies to your server, save them to a file, or perform any other desired action
  return cookies;
}

async function clearCookies() {
  for (let c of await extractCookies())
    await chrome.cookies.remove({name: c.name, url: `https://${c.domain}${c.path}`});
}