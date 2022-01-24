var optionsDiv = document.getElementById('optionsDiv');
var loginBtn = document.getElementById('loginBtn');
var createBtn = document.getElementById('createBtn');

var loginDiv = document.getElementById('loginDiv');
var loginUsername = document.getElementById('loginUsername');
var loginPassword = document.getElementById('loginPassword');
var loginDisplayText = document.getElementById('loginDisplayText');
var loginSubmit = document.getElementById('loginSubmit');

var createDiv = document.getElementById('createDiv');
var createUsername = document.getElementById('createUsername');
var createEmail = document.getElementById('createEmail');
var createPassword = document.getElementById('createPassword');
var employerCode = document.getElementById('employerCode');
var createDisplayText = document.getElementById('createDisplayText');
var createSubmit = document.getElementById('createSubmit');

fetch('/bypass', { method: 'GET' })
  .then(response => response.text())
  .then(text => {
    if (text == "1") {
      location.href = '/dashboard'
    }
  })

loginBtn.addEventListener('click', function () {
  loginDiv.style.display = "block";
  optionsDiv.style.display = "none";
});
createBtn.addEventListener('click', function () {
  createDiv.style.display = "block";
  optionsDiv.style.display = "none";
});

loginSubmit.addEventListener('click', function () {
  if (loginUsername.value && loginPassword.value) {
    fetch('/login', { method: 'POST', body: loginUsername.value + ':' + loginPassword.value })
      .then(response => response.text())
      .then(text => {
        if (text == "Login Successful") {
          location.href = '/dashboard'
        } else {
          loginDisplayText.innerText = text;
        }
      })
  } else {
    loginDisplayText.innerText = 'Login fields invalid.'
  }
});

createSubmit.addEventListener('click', function () {
  if (createUsername.value && createEmail.value && createPassword.value && employerCode.value) {
    let data = `${createUsername.value}:${createEmail.value}:${createPassword.value}:${employerCode.value}`
    fetch('/create', { method: 'POST', body: data })
      .then(response => response.text())
      .then(text => {
        if (text == "Create Successful") {
          location.href = '/dashboard'
        } else {
          createDisplayText.innerText = text;
        }
      })
  } else {
    createDisplayText.innerText = 'Create fields invalid.'
  }
});