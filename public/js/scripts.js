$(document).ready(function() {

	// -----------------------------------------------------------------------------
	// DOM ELEMENT VARIABLES
	// -----------------------------------------------------------------------------

	// Auth related jQuery objects
	var $loginForm = $("#login-form");
	var $logoutLink = $("#logout-link");
	var $signupLink = $("#signup-link");
	var $signupForm = $("#signup-form");

	// Elements that appear when user is not logged in
	var $welcome = $("#welcome");

	// Elements for navigation
	var $homelink = $("#home-link");

	// -----------------------------------------------------------------------------
	// FUNCTIONS TO HANDLE USER EXPERIENCE FOR AUTH
	// -----------------------------------------------------------------------------

	//check if the user's logged in - in reality check if token is still valid
	if(Cookies.get("jwt_token")){
		console.log('logged in');
	  $loginForm.hide();
	  $signupLink.hide();
	  $welcome.hide();
	  $logoutLink.show();
	  getProjectsProtected();
	} else {
		console.log('not logged in');
		$loginForm.show();
		$signupLink.show();
		$welcome.show();
		$signupForm.hide();
		$logoutLink.hide();
		getProjects();
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
					$welcome.hide();
					getProjectsProtected();
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
		$welcome.hide();
		$signupForm.show();
	});


	// -----------------------------------------------------------------------------
	// EVENT HANDLERS FOR USER NAVIGATION
	// -----------------------------------------------------------------------------

	//Event listener and handler to returnn to index
	$homelink.click(function(e) {
		e.preventDefault();
		getProjectsProtected();
	})
});

// -----------------------------------------------------------------------------
// RENDERING FUNCTIONS
// -----------------------------------------------------------------------------

//This rendering function just shows the project previews
//If the user is not logged in, this version will render
var renderProjects = function(data) {

	var $homelink = $("#home-link");
	$homelink.hide();

	var $contain = $("#contain");
	$contain.empty();

	for (var i = 0; i < data.length; i++) {
		var $project = $("<div class='project-preview' data-attribute='" + data[i].id + "'><h3>" + data[i].title + "</h3><img src='" + data[i].image + "'></div>");
		$contain.append($project);
	}
}


// This rendering function includes the event listeners necessary to see the project show pages
// If the user is logged in, this version will render
var renderProjectsProtected = function(data) {

	var $homelink = $("#home-link");
	$homelink.hide();

	var $contain = $("#contain");
	$contain.empty();

	for (var i = 0; i < data.length; i++) {
		var $project = $("<div class='project-preview' data-attribute='" + data[i].id + "'><h3>" + data[i].title + "</h3></div>");
		var $img = $("<img>");
		$img.attr("src", data[i].image);
		$img.attr("class", "preview-image");
		$img.attr("data-attribute", data[i].id);
		$project.append($img);

		// class='preview-image' src='" + data[i].image + "'
		$project.click(function() {
			console.log("clicked");
			var target = $(event.target)
			console.log(target.attr("data-attribute"))
			getProject(target.attr("data-attribute"));
		})
		$contain.append($project);
	}
}

var renderProject = function(data) {
	var $contain = $("#contain");
	$contain.empty();

	var $project = $("<div class='project-full' data-attribute='" + data.id + "'><h3>" + data.title + "</h3><a href='" + data.url + "'><img class='full-image' src='" + data.image + "'></a><p>" + data.description + "</p><a href='" + data.github + "'>Github Repository</a></div>");
	$contain.append($project);

	var $homelink = $("#home-link");
	$homelink.show();
}


// -----------------------------------------------------------------------------
// AJAX FUNCTIONS
// -----------------------------------------------------------------------------

var testAuth = function() {
	$.ajax({
		url: '/users/test',
		method: 'GET'
	}).done(function(data) {
		console.log(data);
	});	
};

//This AJAX call will be used when the user IS NOT logged in
var getProjects = function() {
	$.ajax({
		url: "/projects",
		method: "GET"
	}).done(function(data) {
		console.log(data);
		renderProjects(data);
	})
};

//This AJAX call will be used when the user IS not logged in
var getProjectsProtected = function() {
	$.ajax({
		url: "/projects",
		method: "GET"
	}).done(function(data) {
		console.log(data);
		renderProjectsProtected(data);
	})
};

var getProject = function(project_id) {
	// var user_id = Cookies.get("userId");
	$.ajax({
		url: "/projects/" + project_id,
		method: "GET",
	}).done(function(data) {
		console.log(data);
		renderProject(data);
	})
}







