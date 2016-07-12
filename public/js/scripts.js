$(document).ready(function() {

	// Auth related jQuery objects
	var $loginForm = $("#login-form");
	var $logoutLink = $("#logout-link");
	var $signupLink = $("#signup-link");
	var $signupForm = $("#signup-form");

	//check if the user's logged in - in reality check if token is still valid
	if(Cookies.get("jwt_token")){
		console.log('logged in');
	  $loginForm.hide();
	  $signupLink.hide();
	  $logoutLink.show();
	} else {
		console.log('not logged in');
		$loginForm.show();
		$signupLink.show();
		$signupForm.hide();
		$logoutLink.hide();
	}

	// Event listener and handler to login
	$loginForm.submit(function(e){
	  e.preventDefault();
	  $.ajax({
	  	url: "/auth",
	    method: "POST",
	    data: {
	    	username: $loginForm.find("[name=username]").val(),
	    	password: $loginForm.find("[name=password]").val()
	    }
	  }).success(function(data){
	    console.log(data);
	    if(data.token){
	      Cookies.set("jwt_token", data.token);
	      Cookies.set("userId", data.userId);
	     		$signupForm.hide();
					$signupLink.hide();
					$loginForm.hide();
					$logoutLink.show();
					// location.reload();
	    } else {
	      console.log("ERROR LOGGING IN");
	    }
	  });
	});

	// Event listener and handler to signup
	$signupForm.submit(function(e) {
		e.preventDefault();
		console.log('sending ajax to signup');
		console.log($signupForm.find("[name=username]").val());
		console.log($signupForm.find("[name=email]").val());
		console.log($signupForm.find("[name=password]").val());
		$.ajax({
			url: '/users',
			method: 'POST',
			data: {
				username: $signupForm.find("[name=username]").val(),
				email: $signupForm.find("[name=email]").val(),
				password: $signupForm.find("[name=password]").val()
			}
		}).done(function(data) {
			// if the response is true;
			if(data) {
				redirectLogin();
			}
		});
	});

	// Event Listener and handler to logout
	$logoutLink.click(function(e){
    Cookies.remove("jwt_token");
    location.reload();
	});

	// Rendering functions
	var signedUp = function() {
		$signupForm.hide();
		$signupLink.hide();
		$loginForm.show();
	}

	var redirectLogin = function() {
		$signupForm.hide();
		$signupLink.hide();
		$loginForm.show();
	}

	// Event listener and handler to signup
	$signupLink.click(function(e) {
		e.preventDefault();
		$loginForm.hide();
		$logoutLink.hide();
		$signupLink.hide();
		$signupForm.show();
	});
});

var testAuth = function() {
	$.ajax({
		url: '/users/test',
		method: 'GET'
	}).done(function(data) {
		console.log(data);
	});	
};