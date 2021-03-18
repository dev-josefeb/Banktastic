'use strict';

const account1 = {
  owner: 'John Smith Cooper',
  transactions: [500, -350, 560, 800, -60, 1130, 2270, -300],
  interestRate: 2.1,
  pin: 1111,
  transactionDates: ['2019-11-18T21:31:17.178Z', '2019-12-23T07:42:02.383Z', '2020-01-28T09:15:04.904Z', '2020-04-01T10:17:24.185Z', '2020-05-08T14:11:59.604Z', '2020-05-27T17:01:17.194Z', '2021-03-14T23:36:17.929Z', '2021-03-17T10:51:36.790Z'],
  currency: 'EUR',
  locale: 'en-GB', // de-DE
};

const account2 = {
  owner: 'Robert Miller',
  transactions: [1000, 200, -150, 5790, 525, -1000, 10500, -90],
  interestRate: 1.6,
  pin: 2222,
  transactionDates: ['2019-11-01T13:15:33.035Z', '2019-11-30T09:48:16.867Z', '2019-12-25T06:04:23.907Z', '2020-01-25T14:18:46.235Z', '2020-02-05T16:33:06.386Z', '2020-04-10T14:43:26.374Z', '2020-06-25T18:49:59.371Z', '2020-07-26T12:01:20.894Z'],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Sarah Jones',
  transactions: [500, -100, -40, 600, -50, 95, 455, -65],
  interestRate: 3.75,
  pin: 3333,
  transactionDates: ['2017-11-01T13:15:33.035Z', '2017-11-30T09:48:16.867Z', '2017-12-25T06:04:23.907Z', '2018-01-25T14:18:46.235Z', '2019-02-05T16:33:06.386Z', '2020-04-10T14:43:26.374Z', '2020-06-25T18:49:59.371Z', '2020-07-26T12:01:20.894Z'],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Marta James Peterson',
  transactions: [1430, 900, -700, 250, -90],
  interestRate: 0.4,
  pin: 4444,
  transactionDates: ['2019-11-15T21:31:17.178Z', '2019-12-13T07:42:02.383Z', '2020-01-18T09:15:04.904Z', '2020-04-02T10:17:24.185Z', '2020-05-07T14:11:59.604Z', '2020-05-17T17:01:17.194Z', '2020-07-11T23:36:17.929Z', '2020-07-12T10:51:36.790Z'],
  currency: 'EUR',
  locale: 'de-DE', // de-DE
};

const accounts = [account1, account2, account3, account4];

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const containerApp = document.querySelector('.app');
const containerTransactions = document.querySelector('.transactions');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

let activeAccount;
let activeAccountBalance;
let isSorted;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent form from reloading from login (submit)

  const username = inputLoginUsername.value;
  const password = +inputLoginPin.value;

  activeAccount = accounts.find(el => el.username === username && el.pin === password);

  clearInputFields();
  displayWelcomeUI();
  updateUI(activeAccount);
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent form from reloading from login (on submit)

  const transferUsername = inputTransferTo.value;
  const transferAmount = +(+inputTransferAmount.value).toFixed(2);
  const transferUser = accounts.find(el => el.username === transferUsername);

  if (transferAmount <= 0 || transferAmount > activeAccountBalance || transferUser?.username === activeAccount.username || !transferUser) return;

  activeAccount.transactions.push(-transferAmount);
  activeAccount.transactionDates.push(new Date().toISOString());
  transferUser.transactions.push(transferAmount);
  transferUser.transactionDates.push(new Date().toISOString());

  updateUI(activeAccount);
  clearInputFields();
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = +inputLoanAmount.value;

  if (loanAmount <= 0 || !activeAccount.transactions.some(tr => tr >= loanAmount * 0.1)) return;

  activeAccount.transactions.push(loanAmount);
  activeAccount.transactionDates.push(new Date().toISOString());
  updateUI(activeAccount);
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const inputUsername = inputCloseUsername.value;
  const inputUserPin = +inputClosePin.value;

  if (inputUsername !== activeAccount.username || inputUserPin !== activeAccount.pin) return;

  accounts.splice(
    accounts.findIndex(el => el === activeAccount),
    1
  );

  labelWelcome.textContent = 'Log in to get started';
  containerApp.style.opacity = 0;
});

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  isSorted = !isSorted;
  displayTransactions(activeAccount, isSorted);
  colorAlternateRows();
});

const generateUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(value => value[0])
      .join('');
  });
};

const clearInputFields = function () {
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
};

const clearTransferFields = function () {
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
};

const displayWelcomeUI = function () {
  labelWelcome.textContent = `Welcome back, ${activeAccount.owner.split(' ')[0]}`;
  containerApp.style.opacity = 100;
};

const displayDate = function () {
  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  };

  labelDate.textContent = new Intl.DateTimeFormat(activeAccount.locale, options).format(now);
};

const formatTransactionDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayTransactions = function (account, sort = false) {
  containerTransactions.innerHTML = '';

  let trans = sort ? account.transactions.slice().sort((a, b) => a - b) : account.transactions;

  for (let [index, transaction] of trans.entries()) {
    const transactionType = transaction > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(account.transactionDates[index]);
    const displayDate = formatTransactionDate(date, activeAccount.locale);

    const formattedTransaction = formatCurrency(transaction, account.locale, account.currency);

    const html = `
    <div class="transactions__row">
    <div class="transactions__type transactions__type--${transactionType}">${index + 1}- ${transactionType}</div>
    <div class="transactions__date">${displayDate}</div>
    <div class="transactions__value">${formattedTransaction}</div>
    </div>`;
    containerTransactions.insertAdjacentHTML('afterbegin', html);
  }
};

const displayBalance = function (account) {
  activeAccountBalance = account.transactions.reduce((acc, cur) => acc + cur);
  labelBalance.textContent = formatCurrency(activeAccountBalance.toFixed(2), account.locale, account.currency);
};

const displayTotalDeposits = function (account) {
  let deposits = account.transactions
    .filter(val => val > 0)
    .reduce((acc, el) => (acc += el))
    .toFixed(2);

  labelSumIn.textContent = formatCurrency(deposits, account.locale, account.currency);
};

const displayTotalWithdrawals = function (account) {
  let withdrawals = account.transactions
    .filter(val => val < 0)
    .map(val => val * -1)
    .reduce((acc, el) => (acc += el))
    .toFixed(2);
  labelSumOut.textContent = formatCurrency(withdrawals, account.locale, account.currency);
};

const displayInterest = function (account) {
  let interest = account.transactions
    .map(val => val * account.interestRate * 0.01)
    .filter(val => val >= 1)
    .reduce((acc, el) => (acc += el))
    .toFixed(2);

  labelSumInterest.textContent = formatCurrency(interest, account.locale, account.currency);
};

const displaySummary = function (account) {
  displayTotalDeposits(account);
  displayTotalWithdrawals(account);
  displayInterest(account);
};

const updateUI = function (account) {
  displayDate();
  displayTransactions(activeAccount);
  displayBalance(activeAccount);
  displaySummary(activeAccount);
  colorAlternateRows();
  clearTransferFields();
};

generateUsernames(accounts);

const colorAlternateRows = function () {
  [...document.querySelectorAll('.transactions__row')].forEach((row, i) => (row.style.backgroundColor = `${i % 2 === 0 ? 'white' : '#f3f3f3'}`));
};
