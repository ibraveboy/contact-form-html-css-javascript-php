// this function fires when user press hamburger button
// It toggles the expansion of menu
function toggleMenu(e) {
  var toggler = e.currentTarget;
  if (toggler.className.includes('expand')) {
    toggler.classList.remove('expand');
    var menu = document.querySelector('.navbar .menu');
    if (menu) {
      menu.style.height = '';
    }
  } else {
    toggler.classList.add('expand');
    var menu = document.querySelector('.navbar .menu');
    var menuItems = document.querySelectorAll('.navbar .menu li');
    var totalHeight = 0;
    menuItems.forEach(item => {
      totalHeight += item.clientHeight;
    })
    if (menu && totalHeight) {
      menu.style.height = `${totalHeight}px`;
    }
  }
}

// input change handler to show error if required field is empty

function onInputChangeHandler(e) {
  var inputElem = e.currentTarget;
  var oldErrorMessageNode = inputElem.parentElement.querySelector('.danger');
  if (oldErrorMessageNode) {
    oldErrorMessageNode.parentElement.removeChild(oldErrorMessageNode);
  }
  if (inputElem.value) {
    inputElem.classList.remove('invalid');
  } else {
    var errorMessageNode = document.createElement('small');
    errorMessageNode.innerText = 'This field is required.';
    errorMessageNode.classList.add('danger');
    inputElem.classList.add('invalid');
    inputElem.parentElement.appendChild(errorMessageNode);
  }
}

// toSnakeCase will transform the values to snake case
function toSnakeCase(key) {
  switch (key) {
    case 'fullName':
      return 'full_name';
      break;
    default:
      return key;
  }
  return key;
}

// the function to submit the form using ajax
function onFormSubmitHandler(e) {
  e.preventDefault();
  document.querySelectorAll('.invalid').forEach(input => {
    input.classList.remove('invalid');
  });
  document.querySelectorAll('.danger').forEach(errorElem => {
    errorElem.parentElement.removeChild(errorElem);
  });
  var ajaxLoader = document.querySelector('.ajax-loader');
  var formElem = e.currentTarget;
  var fullName = formElem['full_name'].value;
  var address = formElem['address'].value;
  var phone = formElem['phone'].value;
  var education = formElem['qualification'].value;
  var applyFor = formElem['apply_for'].value;
  var to = formElem['to'].value;
  var errors = {};
  var requiredValues = {
    fullName,
    phone,
  };
  Object.keys(requiredValues).forEach(key => {
    if (!requiredValues[key].trim()) {
      errors[toSnakeCase(key)] = 'This field is required.';
    }
  });
  if (Object.keys(errors).length) {
    Object.keys(errors).forEach(elemId => {
      var errorMessageNode = document.createElement('small');
      errorMessageNode.innerText = errors[elemId];
      errorMessageNode.classList.add('danger');
      document.querySelector(`#${elemId}`).classList.add('invalid');
      document.querySelector(`#${elemId}`).parentElement.appendChild(errorMessageNode);
    });
    return false;
  }
  ajaxLoader.style.visibility = 'visible';
  ajaxLoader.style.display = 'inline-block';
  fetch('/Final/message.php', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      fullName,
      address,
      phone,
      education,
      applyFor,
      to,
    }),
  })
  .then(res => res.json())
  .then(res => {
    ajaxLoader.style = '';
    if (res.status === 'failed') {
      alert(res.message);
    }
  })
  .catch(err => {
    setTimeout(() => {
      ajaxLoader.style = '';
      alert('Something went wrong.');
    },1000)
  });
}

// it sets the date that is on the topbar
var dateElem = document.querySelector('#date');
if (dateElem) {
  var dateInParts = (new Date()).toDateString().split(' ');
  dateInParts[0] = dateInParts[0] + ',';
  dateInParts[2] = dateInParts[2] + 'th,';
  dateElem.innerHTML = dateInParts.join(' ')
}