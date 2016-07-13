$(document).ready(function() {

	// -----------------------------------------------------------------------------
	// DOM ELEMENT VARIABLES
	// -----------------------------------------------------------------------------

	// Auth related jQuery objects
	var $loginForm = $("#login-form");
	var $logoutLink = $("#logout-link");
	var $signupLink = $("#signup-link");
	var $signupForm = $("#signup-form");
	var $profileEditForm = $("#profile-edit-form");

	// Elements that appear when user is not logged in
	var $welcome = $("#welcome");

	// Elements for navigation
	var $homeLink = $("#home-link");
	var $profileLink = $("#profile-link");
	var $profileEditLink = $("#profile-edit-link");
	var $newProjectLink = $("#new-project-link");

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
	  $profileLink.show();
	  getProjectsProtected();
	} else {
		console.log('not logged in');
		$loginForm.show();
		$signupLink.show();
		$welcome.show();
		$signupForm.hide();
		$logoutLink.hide();
		$profileLink.hide();
		$profileEditLink.hide();
		$newProjectLink.hide();
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
					$profileLink.show();
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

	// Event listener and handler to signup link
	$signupLink.click(function(e) {
		e.preventDefault();
		$loginForm.hide();
		$logoutLink.hide();
		$signupLink.hide();
		$welcome.hide();
		$signupForm.show();
	});

	//Event listener and hanlder to edit profile form
	$("#profile-edit-form").submit(function(e) {
		// e.stopImmediatePropagation();
		// e.preventDefault();
		console.log("edit form submit");
		var user_id = Cookies.get("userId");
		console.log(user_id);
		return false;
		$.ajax({
			url: '/users' + user_id,
			method: 'PUT',
			data: {
				username: $profileEditForm.find("[name=username]").val(),
				email: $profileEditForm.find("[name=email]").val()
			}
		}).done(function(data) {
			renderProfile(data);
		});
	})


	// -----------------------------------------------------------------------------
	// EVENT HANDLERS FOR USER NAVIGATION AND FORMS NOT RELATED TO USER AUTH
	// -----------------------------------------------------------------------------

	//Event listener and handler to return to index
	$homeLink.click(function(e) {
		e.preventDefault();
		$profileEditLink.hide();
		$newProjectLink.hide();
		$profileLink.show();
		getProjectsProtected();
	})

	//Event listener and handler to show the user profile
	$profileLink.click(function(e) {
		e.preventDefault();
		$profileEditLink.show();
		$newProjectLink.show();
		var user_id = Cookies.get("userId");
		console.log(user_id);
		getProfile(user_id);
	})

	//Event listener and handler to edit the user profile
	$profileEditLink.click(function(e) {
		e.preventDefault();
		console.log("edit profile clicked");
		var user_id = Cookies.get("userId");
		getProfileForEdit(user_id);
	})

	//Event listener and handler to create a new project
	$newProjectLink.click(function(e) {
		e.preventDefault();
		console.log("new project");
		var user_id = Cookies.get("userId");
		renderNewProject(user_id);
	})

	//Event listener and hanlder to create new project
	$("#new-project-form").click(function(e) {
		e.preventDefault();
		console.log("submitting new project");
		var user_id = Cookies.get("userId");
		$.ajax({
			url: '/users' + user_id + '/new-project',
			method: 'POST',
			data: {
				title: $("#new-project-form").find("[name=title]").val(),
				image: $("#new-project-form").find("[name=image]").val(),
				description: $("#new-project-form").find("[name=description]").val(),
				github: $("#new-project-form").find("[name=github]").val(),
				url: $("#new-project-form").find("[name=url]").val()
			}
		}).done(function(data) {
			renderProfile(data);
		});
	})

	//Event listener and hanlder to render data to edit a project
	// $("#edit-project-link").click(function(e) {
	// 	e.preventDefault();
	// 	// var user_id = Cookies.get("userId");
	// 	getProjectForEdit(project_id);
	// })

});

// -----------------------------------------------------------------------------
// RENDERING FUNCTIONS
// -----------------------------------------------------------------------------

//This rendering function just shows the project previews
//If the user is not logged in, this version will render
var renderProjects = function(data) {

	var $homeLink = $("#home-link");
	$homeLink.hide();

	var $contain = $("#contain");
	$contain.empty();

	for (var i = 0; i < data.length; i++) {
		var $project = $("<div class='project-preview' data-attribute='" + data[i].id + "'><h3>" + data[i].title + "</h3></div>");
		var $img = $("<img>");
		$img.attr("src", data[i].image);
		$img.attr("class", "preview-image");
		$img.attr("data-attribute", data[i].id);
		$project.append($img);
		$contain.append($project);
	}
}


// This rendering function includes the event listeners necessary to see the project show pages
// If the user is logged in, this version will render
var renderProjectsProtected = function(data) {

	var $homeLink = $("#home-link");
	$homeLink.hide();

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

	var $project = $("<div class='project-full' data-attribute='" + data.id + "'><h3>" + data.title + "</h3><a href='" + data.url + "'><img class='full-image' src='" + data.image + "'></a><p>" + data.description + "</p><a href='" + data.github + "'>Github Repository</a></br></div>");
	var $editProjectLink = $("<a id='edit-project-link' data-attribute='" + data.id + "' href='#'>Edit This Project</a>");
	$editProjectLink.click(function() {
			console.log("clicked");
			var target = $(event.target)
			console.log(target.attr("data-attribute"))
			getProjectForEdit(target.attr("data-attribute"));
		})
	$project.append($editProjectLink);
	$contain.append($project);

	var $homeLink = $("#home-link");
	$homeLink.show();
}

var renderProfile = function(data) {
	var $contain = $("#contain");
	$contain.empty();

	var $profile = $("<h2>" + data.profile.username + "'s Projects</h2>");
	$contain.append($profile);

	for (var i = 0; i < data.projects.length; i++) {
		var $project = $("<div class='project-preview' data-attribute='" + data.projects[i].id + "'><h3>" + data.projects[i].title + "</h3></div>");
		var $img = $("<img>");
		$img.attr("src", data.projects[i].image);
		$img.attr("class", "preview-image");
		$img.attr("data-attribute", data.projects[i].id);
		$project.append($img);

		$project.click(function() {
			console.log("clicked");
			var target = $(event.target)
			console.log(target.attr("data-attribute"))
			getProject(target.attr("data-attribute"));
		})
		$contain.append($project);
	}

	var $homeLink = $("#home-link");
	$homeLink.show();

	var $profileLink = $("#profile-link");
	$profileLink.hide();
}

var renderEditProfile = function(data) {
	var $contain = $("#contain");
	$contain.empty();

	var $homeLink = $("#home-link");
	$homeLink.show();

	var $form = $("<form action='/users/" + data.profile.id + "' id='profile-edit-form'><h2>Edit Your Profile</h2></form>");
	var $username = $("<label for='username'>Username</label><input type='text' id='username-edit' name='username' value='" + data.profile.username + "'>");
	$form.append($username);
	var $email = $("<label for='email'>Email</label><input type='text' id='email-edit' name='email' value='" + data.profile.email + "'>");
	$form.append($email);
	var $hidden = $("<input type='hidden' name='_method' value='PUT'/>");
	$form.append($hidden);
	var $editButton = $("<input type='Submit' value='EDIT' class='btn'>");
	$form.append($editButton);

	$contain.append($form);
}

var renderNewProject = function(data) {
	console.log(data);
	var $contain = $("#contain");
	$contain.empty();

	var $homeLink = $("#home-link");
	$homeLink.show();

	var $form = $("<form action='/users/" + data + "/new-project' id='new-project-form' method='post'><h2>New Project</h2></form>");
	var $title = $("<label for='title'>Title: </label><input type='text' id='title' name='title'></br>");
	$form.append($title);
	var $image = $("<label for='image'>Image URL: </label><input type='text' id='image' name='image'></br>");
	$form.append($image);
	var $description = $("<label for='description'>Description: </label><input type='text' id='description' name='description'></br>");
	$form.append($description);
	var $github = $("<label for='github'>Github Repository: </label><input type='text' id='github' name='github'></br>");
	$form.append($github);
	var $url = $("<label for='url'>Project URL: </label><input type='text' id='url' name='url'></br>");
	$form.append($url);
	var $addButton = $("<input type='Submit' value='ADD' class='btn'>");
	$form.append($addButton);

	$contain.append($form);
}

var renderEditProject = function(data) {
	console.log(data);
	var $contain = $("#contain");
	$contain.empty();

	var $homeLink = $("#home-link");
	$homeLink.show();

	var user_id = Cookies.get("userId");

	var $form = $("<form action='/users/" + user_id + "/projects/" + data.id + "/edit' id='edit-project-form'><h2>Edit Project</h2></form>");
	var $title = $("<label for='title'>Title: </label><input type='text' id='title' name='title' value='" + data.title + "'></br>");
	$form.append($title);
	var $image = $("<label for='image'>Image URL: </label><input type='text' id='image' name='image' value='" + data.image + "'></br>");
	$form.append($image);
	var $description = $("<label for='description'>Description: </label><input type='text' id='description' name='description' value='" + data.description + "'></br>");
	$form.append($description);
	var $github = $("<label for='github'>Github Repository: </label><input type='text' id='github' name='github' value='" + data.github + "'></br>");
	$form.append($github);
	var $url = $("<label for='url'>Project URL: </label><input type='text' id='url' name='url' value='" + data.url + "'></br>");
	$form.append($url);
	var $addButton = $("<input type='Submit' value='ADD' class='btn'>");
	$form.append($addButton);

	$contain.append($form);
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

var getProjectForEdit = function(project_id) {
	// var user_id = Cookies.get("userId");
	$.ajax({
		url: "/projects/" + project_id,
		method: "GET",
	}).done(function(data) {
		console.log(data);
		renderEditProject(data);
	})
}

var getProfile = function(user_id) {
	$.ajax({
		url: "/users/" + user_id,
		method: "GET",
	}).done(function(data) {
		console.log(data);
		renderProfile(data);
	})
}

var getProfileForEdit = function(user_id) {
	$.ajax({
		url: "/users/" + user_id,
		method: "GET",
	}).done(function(data) {
		console.log(data);
		renderEditProfile(data);
	})
}




