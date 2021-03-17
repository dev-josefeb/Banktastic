'use strict';

const account1 = {
  owner: 'John Smith Cooper',
  transactions: [500, -350, 560, 800, -60, 1130, 2270, -300],
  interestRate: 2.1,
  pin: 1111,
};

const account2 = {
  owner: 'Robert Miller',
  transactions: [1000, 200, -150, 5790, 525, -1000, 10500, -90],
  interestRate: 1.6,
  pin: 2222,
};

const account3 = {
  owner: 'Sarah Jones',
  transactions: [500, -100, -40, 600, -50, 95, 455, -65],
  interestRate: 3.75,
  pin: 3333,
};

const account4 = {
  owner: 'Marta James Peterson',
  transactions: [1430, 900, -700, 250, -90],
  interestRate: 0.4,
  pin: 4444,
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

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // Prevent form from reloading from login (submit)

  const username = inputLoginUsername.value;
  const password = Number(inputLoginPin.value);

  activeAccount = accounts.find(el => el.username === username && el.pin === password);

  clearInputFields();
  displayWelcomeUI();
  displayTransactions(activeAccount?.transactions);
  displayBalance(activeAccount);
  displaySummary(activeAccount);
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

const displayWelcomeUI = function () {
  labelWelcome.textContent = `Welcome back, ${activeAccount.owner.split(' ')[0]}`;
  containerApp.style.opacity = 100;
};

const clearInputFields = function () {
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
};

const displayTransactions = function (transactions) {
  containerTransactions.innerHTML = '';

  for (let [index, transaction] of transactions.entries()) {
    const transactionType = transaction > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="transactions__row">
    <div class="transactions__type transactions__type--${transactionType}">${index + 1}- ${transactionType}</div>
    <div class="transactions__value">${transaction}€</div>
    </div>`;
    containerTransactions.insertAdjacentHTML('afterbegin', html);
  }
};

const displayBalance = function (account) {
  labelBalance.textContent = account.transactions.reduce((acc, cur) => acc + cur) + '€';
};

const displayTotalDeposits = function (account) {
  labelSumIn.textContent = account.filter(val => val > 0).reduce((acc, el) => (acc += el)) + '€';
};

const displayTotalWithdrawals = function (account) {
  labelSumOut.textContent =
    account
      .filter(val => val < 0)
      .map(val => val * -1)
      .reduce((acc, el) => (acc += el)) + '€';
};

const displayInterest = function (account) {
  labelSumInterest.textContent =
    account.transactions
      .map(val => val * account.interestRate * 0.01)
      .filter(val => val >= 1)
      .reduce((acc, el) => (acc += el))
      .toFixed(2) + '€';
};

const displaySummary = function (account) {
  displayTotalDeposits(account.transactions);
  displayTotalWithdrawals(account.transactions);
  displayInterest(account);
};

generateUsernames(accounts);
