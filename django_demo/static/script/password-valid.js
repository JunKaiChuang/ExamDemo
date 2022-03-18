const passValidInit = () => {
var myOldInput = document.getElementById("old-pass");
var myInput = document.getElementById("new-pass");
var myReInput = document.getElementById("re-new-pass");
var lower = document.getElementById("lower");
var upper = document.getElementById("upper");
var digit = document.getElementById("digit");
var special = document.getElementById("special");
var length = document.getElementById("length");
var form = document.getElementById("password-reset");

var togglePassword_old = document.getElementById('togglePassword-old');
togglePassword_old.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = myOldInput.getAttribute('type') === 'password' ? 'text' : 'password';
    myOldInput.setAttribute('type', type);
    // toggle the eye / eye slash icon
    this.classList.toggle('bi-eye');
});

var togglePassword_new = document.getElementById('togglePassword-new');
togglePassword_new.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = myInput.getAttribute('type') === 'password' ? 'text' : 'password';
    myInput.setAttribute('type', type);
    // toggle the eye / eye slash icon
    this.classList.toggle('bi-eye');
});

var togglePassword_re_new = document.getElementById('togglePassword-re-new');
togglePassword_re_new.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = myReInput.getAttribute('type') === 'password' ? 'text' : 'password';
    myReInput.setAttribute('type', type);
    // toggle the eye / eye slash icon
    this.classList.toggle('bi-eye');
});



myInput.onchange = ConfirmPassword;
myReInput.onkeyup = ConfirmPassword;

//Comfire password and re-enter password match
function ConfirmPassword() {
    myReInput.setCustomValidity("");
    if (myInput.value != myReInput.value) {
        myReInput.setCustomValidity("Re-enter Passwords do not match.");
    }
}

//Prevent submit refresh page
function handleForm(event) { event.preventDefault(); }
form.addEventListener('submit', handleForm);

// When the user clicks on the password field, show the message box
myInput.onfocus = function() {
  document.getElementById("message").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
myInput.onblur = function() {
  document.getElementById("message").style.display = "none";
}

// When the user starts to type something inside the password field
myInput.onkeyup = function() {
  // Validate lowercase letters
  var lowerCaseLetters = /[a-z]/g;
  if(myInput.value.match(lowerCaseLetters)) {
    lower.classList.remove("invalid");
    lower.classList.add("valid");
  } else {
    lower.classList.remove("valid");
    lower.classList.add("invalid");
  }

  // Validate capital letters
  var upperCaseLetters = /[A-Z]/g;
  if(myInput.value.match(upperCaseLetters)) {
    upper.classList.remove("invalid");
    upper.classList.add("valid");
  } else {
    upper.classList.remove("valid");
    upper.classList.add("invalid");
  }

  // Validate numbers
  var digits = /[0-9]/g;
  if(myInput.value.match(digits)) {
    digit.classList.remove("invalid");
    digit.classList.add("valid");
  } else {
    digit.classList.remove("valid");
    digit.classList.add("invalid");
  }

  // Validate specials
  var specialCharacters = [' ', '!', '"', '#', '\\$', '%', '&', '\'', '\\(', '\\)', '\\*', '\\+', ',', '-', '\\.', '/', ':', ';', '<', '=', '>', '\\?', '@', '\\[', '\\\\', '\\]', '\\^', '_','`','{','\\|', '}','~'].join('|');

  var specialCharactersRegexp = new RegExp(specialCharacters);
  if(myInput.value.match(specialCharactersRegexp)) {
    special.classList.remove("invalid");
    special.classList.add("valid");
  } else {
    special.classList.remove("valid");
    special.classList.add("invalid");
  }

  // Validate length
  if(myInput.value.length >= 8) {
    length.classList.remove("invalid");
    length.classList.add("valid");
  } else {
    length.classList.remove("valid");
    length.classList.add("invalid");
  }
}
}