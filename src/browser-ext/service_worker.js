chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  (async () => {
    self.tab = await chrome.tabs.query({ currentWindow: true, active: true });
    if(message.popupOpen) { sendResponse(await extractCookies()); }
  })();
  return true; // to allow async response
});


async function extractCookies() {
  let cookies = await chrome.cookies.getAll({});
  console.log(cookies);
    // You can send the cookies to your server, save them to a file, or perform any other desired action
  return cookies;
}