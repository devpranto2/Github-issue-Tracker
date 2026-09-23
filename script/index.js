const handleSignBtn = (e) => {
  e.preventDefault();

  const userName = document.getElementById("user-name");
  const loginName =userName.value;
  const passWord = document.getElementById("password");
  const loginPassword =passWord.value;
  console.log(loginName);
  console.log(loginPassword);
  if(loginName === "admin" && loginPassword ==="admin123"){
    window.location.assign("home.html");
  }else{
    alert("Wrong information")
  }
};

const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", handleSignBtn);