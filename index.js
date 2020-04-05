const conf = require("./conf.json");

function calculate({ sellerCountry, buyerCountry, wineType, alcohol, pricePerBottle, qty, litersPerBottle }) {
  const sellerCountryConf = conf[sellerCountry];
  const buyerCountryConf = conf[buyerCountry];
  const delivery = sellerCountryConf.deliverySameCountry[sellerCountry === buyerCountry];
  const { stripeCommission, vat } = buyerCountryConf;

  const exciseDutie = getExciseDutieValue(buyerCountryConf.exciseDuties[wineType], alcohol);
  const exciseDutieCalc = (exciseDutie / 100) * (qty * litersPerBottle);

  let result = (pricePerBottle + delivery + stripeCommission) * qty + exciseDutieCalc;
  const vatCalc = result * (vat / 100);
  result += vatCalc;

  console.log(`
  Seller country: ${sellerCountry};
  Buyer country: ${buyerCountry};
  Qty: ${qty};
  Volume: ${litersPerBottle};
  Price per bottle: ${pricePerBottle} euro;
  Wine type: ${wineType};
  Alcohol: ${alcohol}%;
  --------------------------------------------
  Delivery: ${delivery} euro;
  Stripe commission: ${stripeCommission} euro;
  Excise dutie per 100 litters: ${exciseDutie} euro;
  Excise dutie per ${litersPerBottle} litters: ${exciseDutieCalc} euro;
  VAT (${vat}%): ${vatCalc} euro`);

  return result;
}

function getExciseDutieValue(exciseDuties, alcohol) {
  const foundDutie = exciseDuties.find(item => {
    return alcohol >= item.min && alcohol <= item.max;
  });

  if (foundDutie) return foundDutie.val;

  return 0;
}

const test = calculate({
  sellerCountry: "france",
  buyerCountry: "germany",
  wineType: "sparkling",
  alcohol: 15,
  pricePerBottle: 15,
  qty: 1,
  litersPerBottle: 0.75
});

console.log(`
  ====================================
  TOTAL PRICE:  ${test}`);
