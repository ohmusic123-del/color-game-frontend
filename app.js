const API = "https://color-game-backend1.onrender.com";
let token = "";

function setAmt(a){ amount.value = a }

async function register(){
  alert((await fetch(API+"/register",{
    method:"POST",
    headers:{ "Content-Type":"application/json"},
    body:JSON.stringify({
      mobile:mobile.value,
      password:password.value
    })
  })).status===200?"Registered":"User exists");
}

async function login(){
  const res = await fetch(API+"/login",{
    method:"POST",
    headers:{ "Content-Type":"application/json"},
    body:JSON.stringify({
      mobile:mobile.value,
      password:password.value
    })
  });
  const data = await res.json();
  token = data.token;
  wallet.innerText = data.wallet;
  auth.style.display="none";
  game.style.display="block";
}

async function bet(color){
  const res = await fetch(API+"/bet",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":token
    },
    body:JSON.stringify({
      color,
      amount:+amount.value
    })
  });
  const data = await res.json();
  if(data.wallet!==undefined)
    wallet.innerText=data.wallet;
  else alert(data.message);
}
