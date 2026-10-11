/* ============================================
   STRIUKĖS TAU — produktų duomenys
   KAINOS — GALUTINĖS, patvirtintos kliento.
   ============================================ */

const SEASONS = {
  'pavasaris-ruduo': 'Pavasaris / Ruduo',
  'ziema': 'Žiema'
};

const PRODUCTS = [
  {
    id: 'p01',
    name: 'Striukė su kupranugario užpildu',
    season: 'ziema',
    images: ['jacket-01.jpg','jacket-02.jpg','jacket-03.jpg','jacket-11.jpg'],
    colors: ['Tamsiai mėlyna', 'Tamsiai chaki'],
    tiers: [{min:5,max:10,price:65},{min:11,max:20,price:45},{min:21,max:null,price:42}],
    desc: 'Šilta, įprasto ilgio žieminė striukė su kupranugario vilnos užpildu. Prieinama dviem spalvomis: tamsiai mėlyna ir tamsiai chaki. Dydžiai – 48–58. Užsakymai nuo 5 vienetų, o kuo didesnis kiekis, tuo mažesnė vieneto kaina. Galime uždėti Jūsų įmonės logotipą, pristatymas visoje Lietuvoje nemokamas.'
  },
  {
    id: 'p03',
    name: 'Ilgas žieminis paltas su kailiuku',
    season: 'ziema',
    images: ['jacket-26.jpg','jacket-29.jpg','jacket-27.jpg','jacket-30.jpg','jacket-25.jpg','jacket-28.jpg'],
    colors: ['Chaki', 'Juoda'],
    tiers: [{min:5,max:10,price:95},{min:11,max:20,price:67},{min:21,max:null,price:62}],
    desc: 'Ilgas žieminis paltas, dengiantis iki kelių, su kupranugario vilnos užpildu ir nusegamu natūraliu kailiuku ant gobtuvo. Prieinamas chaki ir juoda spalvomis. Dydžiai – 48–58. Modelis nuotraukoje 197 cm ūgio. Užsakymai nuo 5 vienetų, o vieneto kaina mažėja didėjant kiekiui. Galime uždėti Jūsų įmonės logotipą, pristatymas visoje Lietuvoje nemokamas.'
  },
  {
    id: 'p07',
    name: 'Ilga žieminė striukė',
    season: 'ziema',
    images: ['jacket-20.jpg','jacket-21.jpg','jacket-22.jpg','jacket-23.jpg','jacket-24.jpg'],
    tiers: [{min:5,max:10,price:70},{min:11,max:20,price:50},{min:21,max:null,price:46}],
    desc: 'Ilga, dengianti iki šlaunų, pilnai šilta žieminė striukė su gobtuvu, juodos spalvos. Dydžiai – 48–58. Modelis nuotraukoje 197 cm ūgio. Užsakymai nuo 5 vienetų, o didesnis kiekis atpigina vieną striukę. Galime uždėti Jūsų įmonės logotipą, pristatymas visoje Lietuvoje nemokamas.'
  },
  {
    id: 'p02',
    name: 'Ilga parka',
    season: 'ziema',
    images: ['jacket-12.jpg'],
    tiers: [{min:5,max:10,price:85},{min:11,max:20,price:59},{min:21,max:null,price:55}],
    desc: 'Ilgesnio kirpimo juodos spalvos parka, dengianti iki šlaunų, su kupranugario vilnos užpildu. Skirta reprezentacinėms pareigoms, puikiai tinka klientų aptarnavimo ir vadovų komandoms. Dydžiai – 48–58. Modelis nuotraukoje 197 cm ūgio. Užsakymai nuo 5 vienetų, o kuo daugiau striukių užsakote, tuo mažesnė kaina už vienetą. Galime uždėti Jūsų įmonės logotipą, pristatymas visoje Lietuvoje nemokamas.'
  },
  {
    id: 'p13',
    name: 'Ilga parka su gobtuvu',
    season: 'ziema',
    images: ['jacket-52.jpg','jacket-53.jpg','jacket-54.jpg'],
    tiers: [{min:5,max:10,price:50},{min:11,max:20,price:35},{min:21,max:null,price:32}],
    desc: 'Ilgesnio kirpimo žieminė parka, dengianti iki kelių, su reguliuojamu gobtuvu, grafito pilkos spalvos. Solidus, santūrus modelis. Dydžiai – 48–58. Modelis nuotraukoje 197 cm ūgio. Užsakymai nuo 5 vienetų, o nuo 21 vieneto kaina už striukę mažiausia. Galime uždėti Jūsų įmonės logotipą, pristatymas visoje Lietuvoje nemokamas.'
  },
  {
    id: 'p12',
    name: 'Žieminė striukė su gobtuvu',
    season: 'ziema',
    featured: true,
    images: ['jacket-07.jpg','jacket-13.jpg','jacket-37.jpg','jacket-38.jpg','jacket-39.jpg','jacket-40.jpg','jacket-42.jpg','jacket-55.jpg'],
    sizes: ['48','50','52','54','56','58','60','62','64','66','68','70'],
    colors: ['Tamsiai mėlyna', 'Tamsiai chaki'],
    tiers: [{min:5,max:10,price:65},{min:11,max:20,price:45},{min:21,max:null,price:42}],
    desc: 'Vidutinio ilgio, pilnai šilta žieminė striukė su kupranugario vilnos užpildu ir reguliuojamu gobtuvu. Striukė lengva ir neišpūsta. Puikiai tinka tiek kasdieniam nešiojimui, tiek reprezentacinei aprangai. Prieinama dviem spalvomis: tamsiai mėlyna ir tamsiai chaki. Dydžiai – nuo 48 iki 70, todėl tinka visiems komandos nariams. Modelis nuotraukoje 197 cm ūgio. Užsakymai nuo 5 vienetų, o nuo 21 vieneto kaina už striukę mažiausia. Galime uždėti Jūsų įmonės logotipą, pristatymas visoje Lietuvoje nemokamas.'
  },
  {
    id: 'p06',
    name: 'Sportinė striukė',
    season: 'pavasaris-ruduo',
    images: ['jacket-17.jpg','jacket-18.jpg','jacket-19.jpg','jacket-31.jpg','jacket-32.jpg','jacket-33.jpg','jacket-34.jpg'],
    tiers: [{min:5,max:10,price:55},{min:11,max:20,price:39},{min:21,max:null,price:36}],
    desc: 'Įprasto ilgio sportinė striukė šviesesne, kupranugario spalva. Turi reguliuojamą gobtuvą ir kelias kišenes. Tinka pavasariui ir rudeniui. Dydžiai – 48–58. Modelis nuotraukoje 197 cm ūgio. Užsakymai nuo 5 vienetų, o kuo didesnis kiekis, tuo pigiau kainuoja vienas vienetas. Galime uždėti Jūsų įmonės logotipą, pristatymas visoje Lietuvoje nemokamas.'
  },
  {
    id: 'p04',
    name: 'Ilgesnio kirpimo striukė su gobtuvu',
    season: 'pavasaris-ruduo',
    featured: true,
    images: ['jacket-37.jpg','jacket-38.jpg','jacket-39.jpg','jacket-40.jpg','jacket-42.jpg','jacket-55.jpg'],
    sizes: ['48','50','52','54','56','58','60','62','64','66','68','70'],
    colors: ['Tamsiai mėlyna', 'Tamsiai chaki'],
    tiers: [{min:5,max:10,price:50},{min:11,max:20,price:35},{min:21,max:null,price:32}],
    desc: 'Ilgesnio kirpimo striukė su reguliuojamu gobtuvu ir krūtinės kišene. Dengia klubus, todėl patogiai tinka dėvėti ir su švarku. Prieinama dviem spalvomis: tamsiai mėlyna ir tamsiai chaki. Dydžiai – nuo 48 iki 70. Modelis nuotraukoje 197 cm ūgio. Tai mūsų dažniausiai užsakomas modelis pavasariui ir rudeniui. Užsakymai nuo 5 vienetų, o didesnis kiekis atpigina vieneto kainą. Galime uždėti Jūsų įmonės logotipą, pristatymas visoje Lietuvoje nemokamas.'
  },
  {
    id: 'p09',
    name: 'Bomber tipo striukė',
    season: 'pavasaris-ruduo',
    images: ['jacket-35.jpg','jacket-36.jpg'],
    tiers: [{min:5,max:10,price:40},{min:11,max:20,price:28},{min:21,max:null,price:26}],
    desc: 'Trumpo, sportiško kirpimo bomber tipo striukė (iki juosmens), tamsiai mėlynos spalvos. Tinka laisvalaikio ir kasdienei komandos aprangai pavasarį ir rudenį. Dydžiai – 48–58. Modelis nuotraukoje 197 cm ūgio. Užsakymai nuo 5 vienetų, o didesnis kiekis sumažina vieneto kainą. Galime uždėti Jūsų įmonės logotipą, pristatymas visoje Lietuvoje nemokamas.'
  },
  {
    id: 'p08',
    name: 'Trumpa rudeninė striukė',
    season: 'pavasaris-ruduo',
    images: ['jacket-31.jpg','jacket-32.jpg','jacket-33.jpg','jacket-34.jpg'],
    colors: ['Tamsiai mėlyna', 'Tamsiai chaki'],
    tiers: [{min:5,max:10,price:45},{min:11,max:20,price:31},{min:21,max:null,price:29}],
    desc: 'Trumpesnio kirpimo striukė su gobtuvu, siekianti klubus. Tinka kasdieniam biuro ir lauko naudojimui pavasarį ir rudenį. Prieinama dviem spalvomis: tamsiai mėlyna ir tamsiai chaki. Dydžiai – 48–58. Modelis nuotraukoje 197 cm ūgio. Užsakymai nuo 5 vienetų, o vieneto kaina mažėja didėjant kiekiui. Galime uždėti Jūsų įmonės logotipą, pristatymas visoje Lietuvoje nemokamas.'
  },
  {
    id: 'p05',
    name: 'Sportinė striukė',
    season: 'pavasaris-ruduo',
    images: ['jacket-14.jpg','jacket-15.jpg','jacket-16.jpg'],
    tiers: [{min:5,max:10,price:50},{min:11,max:20,price:35},{min:21,max:null,price:32}],
    desc: 'Įprasto ilgio, tamsiai mėlynos spalvos sportinė striukė su reguliuojamu gobtuvu. Universalus modelis pereinamajam sezonui, pavasariui ir rudeniui. Dydžiai – 48–58. Modelis nuotraukoje 197 cm ūgio. Užsakymai nuo 5 vienetų, o kuo didesnis kiekis, tuo mažesnė kaina už vienetą. Galime uždėti Jūsų įmonės logotipą, pristatymas visoje Lietuvoje nemokamas.'
  },
  {
    id: 'p14',
    name: 'Sportinė striukė',
    season: 'pavasaris-ruduo',
    featured: true,
    images: ['FINAL2_jacket-56.jpg','FINAL2_jacket-57.jpg'],
    colors: ['Tamsiai mėlyna', 'Tamsiai chaki'],
    tiers: [{min:5,max:10,price:51},{min:11,max:20,price:36},{min:21,max:null,price:33}],
    desc: 'Įprasto ilgio sportinė striukė su reguliuojamu gobtuvu ir krūtinės kišene. Tinka kasdieniam biuro ir lauko naudojimui. Prieinama dviem spalvomis: tamsiai mėlyna ir tamsiai chaki. Dydžiai – 48–58. Užsakymai nuo 5 vienetų, o didesnis kiekis atpigina vieną striukę. Galime uždėti Jūsų įmonės logotipą, pristatymas visoje Lietuvoje nemokamas.'
  },
  {
    id: 'p11',
    name: 'Vidutinio ilgio striukė',
    season: 'pavasaris-ruduo',
    images: ['jacket-43.jpg','jacket-44.jpg','jacket-46.jpg','jacket-47.jpg','jacket-48.jpg','jacket-49.jpg'],
    colors: ['Chaki', 'Mėlyna'],
    tiers: [{min:5,max:10,price:45},{min:11,max:20,price:31},{min:21,max:null,price:29}],
    desc: 'Vidutinio ilgio striukė, dengianti klubus, su reguliuojamu gobtuvu ir keliomis kišenėmis. Prieinama chaki ir mėlyna spalvomis. Tinka pavasariui ir rudeniui. Dydžiai – 48–58. Modelis nuotraukoje 197 cm ūgio. Užsakymai nuo 5 vienetų, o vieneto kaina mažėja didėjant kiekiui. Galime uždėti Jūsų įmonės logotipą, pristatymas visoje Lietuvoje nemokamas.'
  },
  {
    id: 'p10',
    name: 'Vidutinio ilgio striukė',
    season: 'pavasaris-ruduo',
    images: ['jacket-45.jpg','jacket-50.jpg','jacket-51.jpg'],
    tiers: [{min:5,max:10,price:45},{min:11,max:20,price:31},{min:21,max:null,price:29}],
    desc: 'Vidutinio ilgio striukė, dengianti klubus, su reguliuojamu gobtuvu, tamsiai žalios spalvos. Tinka pavasariui ir rudeniui. Dydžiai – 48–58. Modelis nuotraukoje 197 cm ūgio. Užsakymai nuo 5 vienetų, o kuo daugiau striukių užsakote, tuo pigiau kainuoja viena. Galime uždėti Jūsų įmonės logotipą, pristatymas visoje Lietuvoje nemokamas.'
  }
];

function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

function tierPriceFor(product, qty) {
  const t = product.tiers.find(t => qty >= t.min && (t.max === null || qty <= t.max));
  return t ? t.price : product.tiers[0].price;
}

/* Laipsniškas (pakopinis) kainos skaičiavimas — kaip mokesčių pakopos.
   Pirmi N vienetų visada kainuoja pagal 1-ą pakopą, tik virš to riboto
   kiekio papildomi vienetai kainuoja pagal kitą (pigesnę) pakopą.
   Tai pašalina situaciją, kai užsisakius MAŽIAU vienetų reikia mokėti DAUGIAU. */
function tierBreakdown(product, qty) {
  const tiers = product.tiers;
  let total = 0;
  let prevCap = 0;
  for (let i = 0; i < tiers.length; i++) {
    const t = tiers[i];
    const cap = t.max === null ? qty : Math.min(qty, t.max);
    if (qty <= prevCap) break;
    const bracketUnits = Math.max(0, cap - prevCap);
    if (bracketUnits > 0) {
      total += bracketUnits * t.price;
    }
    prevCap = cap;
    if (t.max !== null && qty <= t.max) break;
  }
  return { total: total, unit: qty > 0 ? total / qty : 0 };
}
