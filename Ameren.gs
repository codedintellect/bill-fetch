function mainEnergy() {
  exportSheet("ENERGY", ["PARCEL", "BUILDING", "SHORTHAND", "AMOUNT DUE", "LAST BILL", "DUE DATE", "PAST DUE", "PAST DATE", "UNBILLED BALANCE"]);
  buildings.forEach(house => {
    house["energy"].forEach(account => {
      let d = energy_data(account["account"]);
      addData("ENERGY", [house["parcel"], house["name"], account["shorthand"], "$"+d["amount"], "$"+d["currentBill"], d["dueDate"], "$"+d["pastDueAmount"], d["previousBillDueDate"], "$"+d["unbilledBalance"]]);
    });
  });
}

function energy_auth(v) {
  let energy_url = "https://www.ameren.com/api/ameren/PayBillVendor/";
  let data = UrlFetchApp.fetch(cors + energy_url + "verifyguestpayaccount", {
    "headers": {"Content-Type": "application/json"},
    "payload": `{"accountNumber":"${v}","zipCode":"62035"}`,
    "method": "POST", "mode": "cors"
  }).getHeaders()["cors-received-headers"];
  return JSON.parse(data)["set-cookie"];
}

function energy_data(id) {
  let energy_url = "https://www.ameren.com/api/ameren/PayBillVendor/";
  let data = UrlFetchApp.fetch(cors + energy_url + "getbillinformation", {
    "headers": {
      "Content-Type": "application/json",
      "x-cors-headers": JSON.stringify({"cookie": energy_auth(id)})
    },
    "payload": `{"accountNumber":"${id}","paymentSource":4,"companyCode":"18"}`,
    "method": "POST", "mode": "cors"
  }).getContentText();
  return JSON.parse(data);
}