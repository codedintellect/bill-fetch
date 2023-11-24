function mainTaxes() {
  let year = new Date().getFullYear();
  buildings.forEach(house => {
    let url = `http://reweb1.co.madison.il.us/parcel/view/${house["parcel"]}/${year - 1}`;
    console.log(url);
    let data =  UrlFetchApp.fetch(url);
    for (const match of data.getContentText().matchAll(/<a id="Billing1" class="anchor"><\/a>([\s\S]+?(?=<\/table))/g)){ 
      if (match[0].indexOf("Billing1") > -1) {
        Logger.log(match[0])
      }
    }
  });
}
