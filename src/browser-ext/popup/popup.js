async function refreshCookie() {
  let resp = await chrome.runtime.sendMessage({action: 'open'});
  console.log(resp);
  let dsid = undefined;
  for (let cookie of resp) {
    if (cookie.name === 'DSID')
       document.querySelector('#data').innerText = dsid = cookie.value;
  }
  if (dsid)
    fetch(`http://trillian:2002/?dsid=${dsid}`);
}

function clearCookies() {
  chrome.runtime.sendMessage({action: 'clear'});
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#clear').addEventListener('click', clearCookies);

  refreshCookie();
});