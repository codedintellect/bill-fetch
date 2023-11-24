function mainAlton() {
  let accounts = {
    // REDACTED PERSONAL INFORMATION
  };
  let options = getOptions();
  for (const [k, v] of Object.entries(accounts)) {
    let value = get(v, options);
    console.log(value);
  }
}

function get(url, options) {
  let response = UrlFetchApp.fetch(url, options).getContentText();
  let element = response.substring(response.indexOf('id="Amount"')).split(">")[0];
  return element.split('value="')[1].split('"')[0];
}

function getOptions() {
  let cookies = UrlFetchApp.fetch("https://bsaonline.com/").getAllHeaders()["Set-Cookie"];
  let cookie = "";
  for (let c of cookies) {
    if (cookie.length > 0) cookie += " ";
    cookie += c.split(" ")[0];
  }
  var options = {
    "headers" : {"Cookie" : cookie},
  };
  return options;
}
