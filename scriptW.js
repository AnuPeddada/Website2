
const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convertBtn');
const result = document.getElementById('result');
const errorMsg = document.getElementById('error');

const fromSelector = document.getElementById('fromSelector');
const toSelector = document.getElementById('toSelector');
const fromFlagImg = document.getElementById('fromFlag');
const toFlagImg = document.getElementById('toFlag');
const fromCurrencyText = document.getElementById('fromCurrencyText');
const toCurrencyText = document.getElementById('toCurrencyText');
const fromDropdown = document.getElementById('fromDropdown');
const toDropdown = document.getElementById('toDropdown');

const chaChingSound = document.getElementById('chaChing');

const currencies = ["USD", "EUR", "GBP", "INR", "JPY", "CAD", "AUD"];
const currencyFlags = {
  USD: "us", EUR: "eu", GBP: "gb", INR: "in", JPY: "jp", CAD: "ca", AUD: "au"
};

const exampleItems = {
  USD: { item: "a coffee", price: 5 },
  EUR: { item: "a sandwich", price: 4 },
  GBP: { item: "a pastry", price: 3 },
  INR: { item: "a chai tea", price: 100 },
  JPY: { item: "a snack", price: 500 },
  CAD: { item: "a donut", price: 3 },
  AUD: { item: "a latte", price: 5 }
};

function populateDropdown(dropdown, textEl, flagImg) {
  dropdown.innerHTML = '';
  currencies.forEach(currency => {
    const item = document.createElement('div');
    const flag = document.createElement('img');
    flag.src = `https://flagcdn.com/24x18/${currencyFlags[currency]}.png`;
    flag.alt = `${currency} flag`;
    const span = document.createElement('span');
    span.textContent = currency;
    item.appendChild(flag);
    item.appendChild(span);

    item.addEventListener('click', () => {
      textEl.textContent = currency;
      flagImg.src = flag.src;
      dropdown.style.display = 'none';
    });

    dropdown.appendChild(item);
  });
}

populateDropdown(fromDropdown, fromCurrencyText, fromFlagImg);
populateDropdown(toDropdown, toCurrencyText, toFlagImg);

fromSelector.addEventListener('click', () => {
  fromDropdown.style.display = fromDropdown.style.display === 'block' ? 'none' : 'block';
  toDropdown.style.display = 'none';
});
toSelector.addEventListener('click', () => {
  toDropdown.style.display = toDropdown.style.display === 'block' ? 'none' : 'block';
  fromDropdown.style.display = 'none';
});

document.addEventListener('click', (e) => {
  if (!fromSelector.contains(e.target)) fromDropdown.style.display = 'none';
  if (!toSelector.contains(e.target)) toDropdown.style.display = 'none';
});

async function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrencyText.textContent;
  const to = toCurrencyText.textContent;

  if (!amount || isNaN(amount)) {
    errorMsg.textContent = "Please enter a valid amount.";
    result.textContent = "";
    result.classList.remove('show');
    return;
  }

  errorMsg.textContent = "";
  result.textContent = "Converting...";
  result.classList.remove('show');

  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();
    const rate = data.rates[to];
    const convertedAmount = (amount * rate).toFixed(2);

    chaChingSound.play();

    const itemInfo = exampleItems[from] || { item: "an item", price: 1 };
    const timesItem = (amount / itemInfo.price).toFixed(1);

    result.textContent = `Wow! ${amount} ${from} is about ${convertedAmount} ${to}. 
    That's roughly the equivalent of ${timesItem} ${itemInfo.item}(s) back home!`;
    result.classList.add('show');

  } catch (error) {
    result.textContent = "";
    errorMsg.textContent = "Failed to fetch exchange rates.";
    console.error(error);
  }
}

convertBtn.addEventListener('click', convertCurrency);
