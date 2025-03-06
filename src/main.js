import "./style.css";
import cuentasGeneradas from "./generarCuentas.js";

document.querySelector("#app").innerHTML = `
    <nav>
      <p class="welcome">Log in to get started</p>
      <img src="logo.png" alt="Logo" class="logo" />
      <form class="login" >
        <input
          type="text"
          placeholder="user"
          class="login__input login__input--user"
        />
        <!-- In practice, use type="password" -->
        <input
          type="text"
          placeholder="PIN"
          maxlength="4"
          class="login__input login__input--pin"
        />
        <button class="login__btn">&rarr;</button>
      </form>
    </nav>
    <main class="app">
      <!-- BALANCE -->
      <div class="balance">
        <div>
          <p class="balance__label">Current balance</p>
          <p class="balance__date">
            As of <span class="date">05/03/2037</span>
          </p>
        </div>
        <p class="balance__value">0000€</p>
      </div>
      <!-- MOVEMENTS -->
      <div class="movements">
        <div class="movements__row">
          <div class="movements__type movements__type--deposit">2 deposit</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">4 000€</div>
        </div>
        <div class="movements__row">
          <div class="movements__type movements__type--withdrawal">
            1 withdrawal
          </div>
          <div class="movements__date">24/01/2037</div>
          <div class="movements__value">-378€</div>
        </div>
      </div>
      <!-- SUMMARY -->
      <div class="summary">
        <p class="summary__label">In</p>
        <p class="summary__value summary__value--in">0000€</p>
        <p class="summary__label">Out</p>
        <p class="summary__value summary__value--out">0000€</p>
        <p class="summary__label">Interest</p>
        <p class="summary__value summary__value--interest">0000€</p>
        <button class="btn--sort">&downarrow; SORT</button>
      </div>
      <!-- OPERATION: TRANSFERS -->
      <div class="operation operation--transfer">
        <h2>Transfer money</h2>
        <form class="form form--transfer">
          <input type="text" class="form__input form__input--to" />
          <input type="number" class="form__input form__input--amount" />
          <button class="form__btn form__btn--transfer">&rarr;</button>
          <label class="form__label">Transfer to</label>
          <label class="form__label">Amount</label>
        </form>
      </div>
      <!-- OPERATION: LOAN -->
      <div class="operation operation--loan">
        <h2>Request loan</h2>
        <form class="form form--loan">
          <input type="number" class="form__input form__input--loan-amount" />
          <button class="form__btn form__btn--loan">&rarr;</button>
          <label class="form__label form__label--loan">Amount</label>
        </form>
      </div>
      <!-- OPERATION: CLOSE -->
      <div class="operation operation--close">
        <h2>Close account</h2>
        <form class="form form--close">
          <input type="text" class="form__input form__input--user" />
          <input
            type="password"
            maxlength="6"
            class="form__input form__input--pin"
          />
          <button class="form__btn form__btn--close">&rarr;</button>
          <label class="form__label">Confirm user</label>
          <label class="form__label">Confirm PIN</label>
        </form>
      </div>
      <!-- LOGOUT TIMER -->
      <p class="logout-timer">
        You will be logged out in <span class="timer">05:00</span>
      </p>
    </main>
`;
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Variables
let currentAccount;

// Creamos el campo username para todas las cuentas de usuarios
// Usamos forEach para modificar el array original, en otro caso map
const createUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner // Juan Sanchez
      .toLowerCase() //  juan sanchez
      .split(" ") // ['juan', 'sanchez']
      .map((name) => name[0]) // ['j', 's']
      .join(""); // js
  });
};
createUsernames(cuentasGeneradas);

btnLogin.addEventListener("click", function (e) {
  // Evitamos que el formulario se envíe
  e.preventDefault();
  // Recogemos el username y el pin, y se compara con los datos de las cuentas
  const inputUsername = inputLoginUsername.value;
  const inputPin = Number(inputLoginPin.value);
  const account = cuentasGeneradas.find(
    (account) => account.username === inputUsername
  );
  if (account && account.pin === inputPin) {
    // Si el usuario y el pin son correctos, se realiza un mensaje de bienvenida y que se vea la aplicación
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Welcome back, ${account.owner.split(" ")[0]}`;
    // Se limpia el formulario
    inputLoginUsername.value = inputLoginPin.value = "";
    // Se cargan los datos (movimientos de la cuenta)
    updateUI(account);
    // Guardamos los datos de la cuenta para conocer quién está conectado
    currentAccount = account;
  } else {
    // Mostramos una alerta con el login incorrecto
    alert("Login incorrecto.")
  }
});
const updateUI = function ({ movements }) {
  // Mostrar los movimientos de la cuenta
  displayMovements(movements);
  // Mostrar el balance de la cuenta
  displayBalance(movements);
  // Mostrar el total de los movimientos de la cuenta
  // Ingresos y gastos
  displaySummary(movements);
};
const displayMovements = function (movements) {
  // Vaciamos el HTML
  containerMovements.innerHTML = "";
  // Recorremos el array de movimientos
  movements.forEach((mov, i) => {
    // Creamos el HTML para cada movimiento y lo guardamos en una variable
    const type = mov > 0 ? "deposit" : "withdrawal";
    // Creamos el HTML
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${
          type === "withdrawal" ? "withdrawal" : "deposit"
        }</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;
    // Insertamos el HTML en el DOM
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
const displayBalance = function (movements) {
  // Calculamos suma de ingresos y retiradas de efectivo
  const balance = movements.reduce((total, movement) => total + movement, 0);
  // Actualizamos el DOM:
  labelBalance.textContent = `${balance.toFixed(2)} €`;
};

const displaySummary = function (movements) {
  // Calculamos los ingresos
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((sum, mov) => sum + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  // Calculamos los gastos
  const outflows = movements
    .filter(mov => mov < 0)
    .reduce((sum, mov) => sum + Math.abs(mov), 0);
  labelSumOut.textContent = `${outflows.toFixed(2)}€`;

  // Calculamos los intereses (suponiendo que se apliquen solo a depósitos y con una tasa media del 1.5%)
  const interestRate = 1.5 / 100;
  const interest = movements
    .filter(mov => mov > 0)
    .map(dep => dep * interestRate)
    .reduce((sum, int) => sum + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

btnTransfer.addEventListener('click', function (e) {
  // Evitamos que el formulario se envíe
  e.preventDefault();
  // Se obtiene la cantidad y el nombre de usuario al que se quiere hacer la transferencia
  const amount = Number(inputTransferAmount.value);
  const transferUsername = inputTransferTo.value.trim();
  // Buscar la cuenta del receptor usando el username (iniciales)
  const transferAccount = cuentasGeneradas.find(
    (account) => account.username === transferUsername
  );
  // Obtener la cuenta actual del usuario autenticado
  const transferCurrentAccount = cuentasGeneradas.find(
    account => account.username === currentAccount.username
  );
  // Verificar si la cuenta del receptor existe
  if (!transferAccount) {
    // Mostrar un mensaje de error
    alert("El nombre de usuario del receptor no es válido.");
    return;
  }
  // Verificar si la cuenta actual existe
  if (!transferCurrentAccount) {
    // Mostrar un mensaje de error
    alert("Hubo un problema con tu cuenta.");
    return;
  }
  // Calcular el saldo del remitente (sumando los movimientos)
  const currentBalance = transferCurrentAccount.movements.reduce((acc, mov) => acc + mov, 0);
  // Verificar las condiciones para la transferencia
  if (
    amount > 0 && // La cantidad debe ser positiva
    transferAccount && // La cuenta del receptor debe existir
    currentBalance >= amount && // El saldo del remitente debe ser suficiente
    transferAccount.username !== transferCurrentAccount.username // No se puede transferir a uno mismo
  ) {
    // Realizar la transferencia
    currentAccount.movements.push(-amount);  // Retirar de la cuenta del remitente
    transferAccount.movements.push(amount);  // Depositar en la cuenta del receptor
    // Actualizar la interfaz de usuario
    updateUI(transferCurrentAccount);
    // Limpiar los campos del formulario
    inputTransferAmount.value = inputTransferTo.value = "";
  }
  // En caso de que no se verifiquen las condiciones
  else {
    // Mostramos una alerta por pantalla
    alert('No se pudo realizar la transferencia. Verifica los datos.');
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  
  // Obtenemos el monto del préstamo
  const loanAmount = Number(inputLoanAmount.value);

  // Comprobamos si el monto es positivo y no supera el 200% del balance actual
  const currentBalance = currentAccount.movements.reduce((acc, mov) => acc + mov, 0);
  const maxLoanAmount = currentBalance * 2;

  if (loanAmount > 0 && loanAmount <= maxLoanAmount) {
    // Si el préstamo es válido, se agrega el préstamo como un movimiento positivo
    currentAccount.movements.push(loanAmount); // Añadir el préstamo al saldo de la cuenta

    // Actualizamos la interfaz de usuario
    updateUI(currentAccount);

    // Limpiamos el campo de entrada del préstamo
    inputLoanAmount.value = "";
  } else {
    // Si el préstamo no es válido, mostramos un mensaje de error
    alert(`El préstamo no puede superar el 200% del saldo actual o su cuenta no tiene fondo.`);
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  
  // Obtenemos los datos del formulario de cierre de cuenta
  const closeUsername = inputCloseUsername.value;
  const closePin = Number(inputClosePin.value);

  // Verificamos si el nombre de usuario y el PIN coinciden con los datos de la cuenta actual
  if (currentAccount.username === closeUsername && currentAccount.pin === closePin) {
    // Eliminamos la cuenta de la lista de cuentas disponibles
    const accountIndex = cuentasGeneradas.findIndex(account => account.username === currentAccount.username);
    if (accountIndex !== -1) {
      cuentasGeneradas.splice(accountIndex, 1); // Elimina la cuenta de cuentasGeneradas
    }

    // Confirmamos el cierre de cuenta
    alert("Tu cuenta ha sido cerrada con éxito.");

    // Ocultamos la aplicación y mostramos el formulario de login
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";

    // Limpiamos los campos de entrada de login y close
    inputLoginUsername.value = inputLoginPin.value = "";
    inputCloseUsername.value = inputClosePin.value = "";

    // Reseteamos la variable de cuenta actual
    currentAccount = null;
  } else {
    // Si el nombre de usuario o PIN son incorrectos, mostramos un mensaje de error
    alert("Datos incorrectos. No se pudo cerrar la cuenta.");
  }
});