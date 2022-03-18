
const GenMemberModel = (source) => {
    return ({
        id : source.user_id,
        name : source.name,
        loginsCount : source.logins_count,
        lastLogin : source.last_login,
        created : source.created_at
    });
}

const Membership_REST = async(model, method, uid) => {
  var param = uid + '/';

  const formData = new FormData();
  for ( var key in model ) {
    formData.append(key, model[key]);
  }
  const data = new URLSearchParams(formData);

  var init = {};

  if(method === "GET" || method === "DELETE") {
    init = {
        method: method,
        headers: {}
    }
  }
  else {
    init = {
        method: method,
        body: data,
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    if(method === "POST") param = "";
  }

  var response = await fetch('/membership/member/' + param, init)
  .then(res => {
    if (!res.ok) {
        // make the promise be rejected if we didn't get a 2xx response
        const err = new Error("Not 2xx response");
        err.response = res;
        throw err;
    } else {
      // go the desired response
      console.log('Member ' + method + ' done!')
      return res;
    }
  })
  .catch(err => {
    console.log('error is', err);
    return undefined
    });

  if(response){
    return response.json();
  }
  else{
    return undefined;
  }
}


/**
 * Get user detail. (For update database.)
 */
const GetUserDetail = async (id) => {

  const result = await fetch('/auth0api/user_detail/' + id + '/', {
    method: 'GET',
    headers: {}
  })
  .then(response => {
    if (response.ok) {
      return response.json()
    } else if(response.status === 404) {
      return Promise.reject('error 404')
    } else {
      return Promise.reject('some other error: ' + response.status)
    }
  })
  .then(async data => {
    console.log('auth0 user data is', data);
    const uid = data.user_id;
    const model = GenMemberModel(data);
    Membership_REST(model, 'GET', uid)
    .then(member =>{
        if (!member) {
            console.log('Member not exists, POST data.')
            Membership_REST(model, 'POST', uid);
        }
        else{
            console.log('Member exists, PUT data.')

            //update member data from Auth0 API, /user .
            member.lastLogin = model.lastLogin;
            member.loginsCount = model.loginsCount;
            member.lastSession = new Date().toISOString();
            Membership_REST(member, 'PUT', uid)
            .then(res => {
                if(res){
                    eachElement(".user-name", (e) => {
                      e.value = res.name;
                      e.innerText = res.name;
                    });
                }
            });
        }
    });

    return data;
    })
  .catch(error => console.log('error is', error));

  return result;
};

const reSendMail = async () =>{
  const user = await auth0.getUser();
  const formData = new FormData();

  formData.append("user_id", user.sub);

  const data = new URLSearchParams(formData);

  const csrf_token = getCookie('csrftoken');

  const result = await fetch('/auth0api/resend_mail/', {
    method: 'POST',
    body: data,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': csrf_token
    }
  })
  .then(response => {
    if (response.ok) {
      return response.json()
    } else if(response.status === 404) {
      return Promise.reject('error 404')
    } else {
      return Promise.reject('some other error: ' + response.status)
    }
  })
}

const getCookie = (name) => {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const updateName = async() => {
  setElementDisabled('saveNameBtn', true)
  setWaitIcon(true);

  const name = document.getElementById("inputName").value

  const user = await auth0.getUser();
  const uid = user.sub;

  const model = {
    id : user.sub,
    name : name,
    lastSession : new Date().toISOString()
  }

  await Membership_REST(model, 'PUT', uid)
  .then(res => {
    if(res){
        eachElement(".user-name", (e) => (e.innerText = name));
    }
  });

  setElementDisabled('saveNameBtn', false)
  setWaitIcon(false);
}

const reSetPass = async() => {
  setElementDisabled('reSetPassBtn', true)
  setWaitIcon(true);

  const oldPass = document.getElementById("old-pass").value
  const newPass = document.getElementById("new-pass").value
  const rePass = document.getElementById("re-new-pass").value

  const user = await auth0.getUser();
  const name = user.name;
  const uid = user.sub;
  const formData = new FormData();

  formData.append("user_id", user.sub);
  formData.append("username", name);
  formData.append("password", newPass);
  formData.append("old_password", oldPass);

  const data = new URLSearchParams(formData);

  const csrf_token = getCookie('csrftoken');

  const result = await fetch('/auth0api/re_set_password/', {
    method: 'POST',
    body: data,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': csrf_token
    }
  })
  .then(response => {
    if (response.ok) {
      $('#myModal').modal('hide')
      clearResetPassword();
    }
    return response.json();
  });

  alert(result);
  setElementDisabled('reSetPassBtn', false)
  setWaitIcon(false);
}
