function mainWater() {
  exportSheet("WATER", ["PARCEL", "BUILDING", "AMOUNT DUE", "DUE DATE", "PAST DUE", "PAST DATE", "UNBILLED BALANCE"]);
  buildings.forEach(house => {
    let auth = water_auth(house["water"]["username"], house["water"]["password"]);
    if (!auth) throw "No auth token";
    let curr = water_data(auth);
    console.log(curr)
    if (!curr && ~ curr["contractAccountNumber"]) throw "No contract number (HOW?)";
    let past = water_history(auth, curr["contractAccountNumber"])
    console.log(past);
    Utilities.sleep(500);
  });
}

function water_auth(username, password) {
  console.log("WATER AUTH");
  let data = UrlFetchApp.fetch(cors + "https://login.awapps.com/api/submitLogin", {
    "headers": {"Content-Type": "application/json"},
    "payload": `{"loginId":"${username}","password":"${password}"}`,
    "method": "POST", "mode": "cors"
  }).getContentText();
  return JSON.parse(data)["access_token"];
}

function water_data(a) {
  let data = UrlFetchApp.fetch(cors + "https://mywaterv2.amwater.com/api/mso/data", {
    "headers": {"Authorization": `bearer ${a}`, "Content-Type": "application/json"},
    "payload": '{"pipelineId":"com::apporchid::cloudseer::mso::myaccountsummarypipeline","requestParameters":{"@class":"com.apporchid.common.UIRequestParameters","keyValueMap":{"queryParams":null}}}',
    "method": "POST", "mode": "cors"
  }).getContentText();
  let obj = JSON.parse(data)["data"][0]["additionalInformation"]["IntermediaryPageDetails"][0];
  return obj;
}

function water_history(a, contractAccountNumber) {
  let lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth()-1);
  let data = UrlFetchApp.fetch(cors + "https://mywaterv2.amwater.com/api/vux/microapp", {
    "headers": {"Authorization": `bearer ${a}`, "Content-Type": "application/json"},
    "payload": `{"applicationId": "com::amwater::enhancedportal::billingandpaymentshistorycontainerapp","microApplicationId": "billingAndPaymentsHistoryTable","renderType": "DATA","keyValueMap": {"connectionContractNumber": "${contractAccountNumber}","billMonth": "","fromDate": "${date(lastMonth)}","toDate": "${date()}","transactionType": "","pipelineId": "collectiveparentaccountpipeline"},"@class": "com.apporchid.common.UIRequestParameters"}`,
    "method": 'POST', "mode": 'cors'
  }).getContentText();
  return JSON.parse(data)["data"];
}

function date(d = new Date()) {
  return Utilities.formatDate(d, "GMT+6", "yyyyMMdd");
}