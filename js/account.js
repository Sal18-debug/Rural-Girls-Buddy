//Runs on window load
window.onload=function(){
	//Get all controls
	var currentUser = JSON.parse(sessionStorage.getItem("AppCurrentUser"));
	var divCurrentUser = document.getElementById('divCurrentUser');
	var lblCurrentUserName = document.getElementById('lblCurrentUserName');
	var menuLogin = document.getElementById('menuLogin');
	var menuRegister = document.getElementById('menuRegister');
	var menuLogout = document.getElementById('menuLogout');
	var menuTracking = document.getElementById('menuTracking');

	//Displays the logged in users name
	if (divCurrentUser !== null){
		if (currentUser === null){
			divCurrentUser.style.display = "none";
		} else {
			divCurrentUser.style.display = "block";
			lblCurrentUserName.innerHTML = currentUser.name;
		}
	}

	//Check if a user is logged in and hide the appropriate menus
	if (currentUser === null){
		menuLogin.style.display = 'contents';	
		menuRegister.style.display = 'contents';	
		menuLogout.style.display = 'none';	
		menuTracking.style.display = 'none';	
	} else {
		menuLogin.style.display = 'none';	
		menuRegister.style.display = 'none';	
		menuLogout.style.display = 'contents';
		menuTracking.style.display = 'contents';		
	}
}

//Logs user out
function logout(){
	//Clear session storage (used to save logged in user) and take back to home page
	sessionStorage.setItem("AppCurrentUser", null);
	alert('SUCCESS: You have been logged out and will be returned to the home page');
	window.location = "index.html";
}

//Registers a new user
function registerNewUser(){
	//Get all controls
	var txtName = document.getElementById('name');
	var txtEmail = document.getElementById('mail');
	var txtPassword = document.getElementById('password');
	var txtConfirmPassword = document.getElementById('confirm');
	var txtAddress = document.getElementById('address');

	//Make sure that all the information is filled in, otherwise show a message
	if (txtName.value === "" || txtEmail.value === "" || txtPassword.value === "" || txtConfirmPassword.value === "" || txtAddress.value === ""){
		return alert('ERROR: All fields need to be filled in to register a new user.');
	}

	//Make sure that the passwords match
	if (txtPassword.value !== txtConfirmPassword.value){
		return alert('ERROR: Password and confirm password needs to match.');
	}

	//Make sure a user with entered username or email doesn't already exist
	getUser(txtEmail.value).then(function(userResult) {
  	return alert('ERROR: A user with this username or email already exists.');
	}).catch(function(err){
		//If user doesn't already exist, add it
		addNewUser(txtName.value, txtEmail.value, txtPassword.value, txtAddress.value).then(function(userResult){
			alert('SUCCESS: You have successfully registered as a new user, you will now be logged in.');
			//And then log it in
			loginUser(userResult);	
		});	
	});
}

//Logs a user in
function loginUser(user){
	//Set session storage and take to index page
	sessionStorage.setItem("AppCurrentUser", JSON.stringify(user));
	window.location = "index.html";
}

//User sign in request
function userSignIn(){
	//Get controls
	var txtEmail = document.getElementById('txtEmail');
	var txtPassword = document.getElementById('txtPassword');

	//Make sure everything is filed in
	if (txtEmail.value === "" || txtPassword.value === ""){
		return alert('ERROR: All fields need to be filled in to sign in');
	}

	//Make sure the user exists
	getUser(txtEmail.value).then(function(userResult) {
		if (userResult.password !== txtPassword.value){
			alert('ERROR: Incorrect password');
		} else {
			alert('SUCCESS: You are now successfully logged in.');
			//Then log it in
			loginUser(userResult);
		}
	}).catch(function(err){
		alert('ERROR: User does not exist');
	});
}