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
	var $aboutLink = $("#about-link");

	// -----------------------------------------------------------------------------
	// FUNCTIONS TO HANDLE USER EXPERIENCE FOR AUTH
	// -----------------------------------------------------------------------------

	//check if the user's logged in - in reality check if token is still valid
	if(Cookies.get("jwt_token")){
		console.log('logged in');
	  $loginForm.hide();
	  $signupLink.hide();
	  $signupForm.hide();
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
	    // console.log(data);
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
		// console.log('sending ajax to signup');
		// console.log($signupForm.find("[name=username]").val());
		// console.log($signupForm.find("[name=email]").val());
		// console.log($signupForm.find("[name=password]").val());
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
		// console.log(user_id);
		getProfile(user_id);
	})

	//Event listener and handler to edit the user profile
	$profileEditLink.click(function(e) {
		e.preventDefault();
		// console.log("edit profile clicked");
		var user_id = Cookies.get("userId");
		getProfileForEdit(user_id);
	})

	//Event listener and handler to create a new project
	$newProjectLink.click(function(e) {
		e.preventDefault();
		// console.log("new project");
		var user_id = Cookies.get("userId");
		renderNewProject(user_id);
	})

	//Event listener and handler for the about page link
	$aboutLink.click(function(e) {
		e.preventDefault();
		$welcome.hide();
		if (Cookies.get("jwt_token")) {
			$homeLink.show();
		}
		renderAbout();
	})


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
			// console.log("clicked");
			var target = $(event.target)
			// console.log(target.attr("data-attribute"))
			getProject(target.attr("data-attribute"));
		})
		$contain.append($project);
	}
}

//This rendering function is the project show page equivalent
var renderProject = function(data) {
	var $contain = $("#contain");
	$contain.empty();

	var $project = $("<div class='project-full' data-attribute='" + data.id + "'></div>");
	var $title = $("<h3>" + data.title + "</h3>");
	$project.append($title);
	var $image = $("<a href='" + data.url + "'><img class='full-image' src='" + data.image + "'></a>");
	$project.append($image);
	var $description = $("<p>Description: " + data.description + "</p></br>");
	$project.append($description);
	var $github = $("<a href='" + data.github + "'>Github Repository</a></br></br>");
	$project.append($github);
	for (var i = 0; i < data.comments.length; i++) {
		var $comment = $("<div class='comment'><p class='comment-text'>" + data.comments[i].content + "</p></div>");
		if (Cookies.get("userId") == data.comments[i].userId) {
			var $commentDeleteButton = $("<button data-project='" + data.id + "' data-comment='" + data.comments[i].id + "' class='btn delete-btn'>DELETE</button>");
			$commentDeleteButton.click(function() {
				console.log("clicked");
				var target = $(event.target);
				var comment_id = target.attr("data-comment");
				console.log("commentId: " + comment_id);
				var project_id = target.attr("data-project");
				console.log("projectId: " + project_id);
				var user_id = Cookies.get("userId");
				console.log("userID: " + user_id);
				deleteComment(user_id, project_id, comment_id);
			})
			$comment.append($commentDeleteButton);
		}
		$project.append($comment);
	};
	// If the project was created by the user logged in, they can see the edit link
	if (Cookies.get("userId") == data.userId) {
		var $editProjectLink = $("<a id='edit-project-link' data-attribute='" + data.id + "' href='#'>Edit This Project</a></br></br>");
		$editProjectLink.click(function() {
			// console.log("clicked");
			var target = $(event.target)
			// console.log(target.attr("data-attribute"))
			getProjectForEdit(target.attr("data-attribute"));
		})
		$project.append($editProjectLink);
		var $commentLink = $("<a id='comment-link' data-attribute='" + data.id + "' href='#'>Comment on This Project</a>");
		$commentLink.click(function(e) {
			e.preventDefault();
			var target = $(event.target);
			var project_id = target.attr("data-attribute");
			// console.log("project id: " + project_id);
			var user_id = Cookies.get("userId");
			renderCommentForm(user_id, project_id);
		})
		$project.append($commentLink);
	} else {
		//If the user logged in did not create the project, they can still comment on it
		var $commentLink = $("<a id='comment-link' data-attribute='" + data.id + "' href='#'>Comment on This Project</a>");
		$commentLink.click(function(e) {
			e.preventDefault();
			var target = $(event.target);
			var project_id = target.attr("data-attribute");
			// console.log("project id: " + project_id);
			var user_id = Cookies.get("userId");
			renderCommentForm(user_id, project_id);
		})
		$project.append($commentLink);
	}
	$contain.append($project);

	var $homeLink = $("#home-link");
	$homeLink.show();
}

//This renders the user's profile, which is presently just the projects they have added and their username
//From this "view" only they can add new projects or update their profiles
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
			// console.log("clicked");
			var target = $(event.target)
			// console.log(target.attr("data-attribute"))
			getProject(target.attr("data-attribute"));
		})
		$contain.append($project);
	}

	var $homeLink = $("#home-link");
	$homeLink.show();

	var $profileLink = $("#profile-link");
	$profileLink.hide();
}

//This renders the form to allow the user to edit his/her profile
var renderEditProfile = function(data) {
	var $contain = $("#contain");
	$contain.empty();

	var $homeLink = $("#home-link");
	$homeLink.show();

	var $form = $("<form action='/users/" + data.profile.id + "' id='profile-edit-form'><h2>Edit Your Profile</h2></form>");
	var $username = $("<label for='username'>Username: </label><input type='text' id='username-edit' name='username' value='" + data.profile.username + "'></br>");
	$form.append($username);
	var $email = $("<label for='email'>Email: </label><input type='text' id='email-edit' name='email' value='" + data.profile.email + "'></br>");
	$form.append($email);
	var $hidden = $("<input type='hidden' name='_method' value='PUT'/>");
	$form.append($hidden);
	var $editButton = $("<input type='Submit' value='EDIT' class='btn'>");
	$form.append($editButton);

	var profileEditFormSubmit = function() {
		var $profileEditForm = $("#profile-edit-form")
		$profileEditForm.submit(function(e) {
			e.stopImmediatePropagation();
			e.preventDefault();
			// console.log("edit form submit");
			var user_id = Cookies.get("userId");
			// console.log(user_id);
			// return false;
			$.ajax({
				url: '/users/' + user_id,
				method: 'PUT',
				data: {
					username: $profileEditForm.find("[name=username]").val(),
					email: $profileEditForm.find("[name=email]").val()
				}
			}).done(function(data) {
				// console.log(data);
				renderProfile(data);
			});
		})
	};

	$contain.append($form);
	profileEditFormSubmit();
}

//This renders the form to allow the user to create a new project
var renderNewProject = function(data) {
	// console.log(data);
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
	var $github = $("<label for='github'>Github: </label><input type='text' id='github' name='github'></br>");
	$form.append($github);
	var $url = $("<label for='url'>Project URL: </label><input type='text' id='url' name='url'></br>");
	$form.append($url);
	var $addButton = $("<input type='Submit' value='ADD' class='btn'>");
	$form.append($addButton);

	$contain.append($form);

	var $newProjectForm = $("#new-project-form")
	$newProjectForm.submit(function(e) {
		e.stopImmediatePropagation();
		e.preventDefault();
		// console.log("submitting new project");
		var user_id = Cookies.get("userId");
		$.ajax({
			url: '/users/' + user_id + '/new-project',
			method: 'POST',
			data: {
				title: $newProjectForm.find("[name=title]").val(),
				image: $newProjectForm.find("[name=image]").val(),
				description: $newProjectForm.find("[name=description]").val(),
				github: $newProjectForm.find("[name=github]").val(),
				url: $newProjectForm.find("[name=url]").val()
			}
		}).done(function(data) {
			renderProject(data);
		});
	})
};

//This renders the form to allow a user to edit one of his or her projects
//If this is rendered, the user can also delete
var renderEditProject = function(data) {
	// console.log(data);
	var $contain = $("#contain");
	$contain.empty();

	var $homeLink = $("#home-link");
	$homeLink.show();

	var user_id = Cookies.get("userId");

	var $form = $("<form action='/users/" + user_id + "/projects/" + data.id + "/edit' id='edit-project-form' data-attribute='" + data.id + "'><h2>Edit Project</h2></form>");
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
	var $addButton = $("<input type='Submit' value='EDIT' class='btn'></br></br>");
	$form.append($addButton);

	$contain.append($form);

	var $editProjectForm = $("#edit-project-form")
	$editProjectForm.submit(function(e) {
		e.preventDefault();
		// console.log("editing project");
		var target = $(event.target);
		// console.log(target.attr("data-attribute"))
		$.ajax({
			url: '/users/project/' + target.attr("data-attribute"),
			method: 'PUT',
			data: {
				title: $editProjectForm.find("[name=title]").val(),
				image: $editProjectForm.find("[name=image]").val(),
				description: $editProjectForm.find("[name=description]").val(),
				github: $editProjectForm.find("[name=github]").val(),
				url: $editProjectForm.find("[name=url]").val()
			}
		}).done(function(data) {
			renderProject(data);
		});
	})

	//This button and functionality allows the user to delete a project
	var $deleteButton = $("<button id='delete' data-attribute='" + data.id + "' class='btn'>Delete This Project</button>");
	$contain.append($deleteButton);

	$("#delete").click(function(e) {
		e.preventDefault();
		// console.log("deleting project");
		var target = $(event.target);
		// console.log(target.attr("data-attribute"));
		var user_id = Cookies.get("userId");
		$.ajax({
			url: '/users/' + user_id + '/projects/' + target.attr("data-attribute") + '/delete',
			method: 'DELETE'
		}).done(function() {
			getProjectsProtected();
		})
	})
};

//This renders the form to allow a user to comment on a project
var renderCommentForm = function(user_id, project_id) {
	var $form = $("<form action='/users/" + user_id + "/project/" + project_id + "/comment' id='comment-form' method='post'><h4>Comment</h4></form>");
	var $content = $("<label for='content'>Your comment: </label><input type='text' id='content' name='content'></br>");
	$form.append($content);
	var $addButton = $("<input type='Submit' value='ADD COMMENT' class='btn'>");
	$form.append($addButton);

	$("#contain").append($form);

	var $commentForm = $("#comment-form")
	$commentForm.submit(function(e) {
		e.preventDefault();
		// console.log("commenting on a project");
		$.ajax({
			url: '/users/' + user_id + '/project/' + project_id + '/comment',
			method: 'POST',
			data: {
				content: $commentForm.find("[name=content]").val()
			}
		}).done(function(data) {
			renderProject(data);
		});
	})
}

//This render's the about "page"
var renderAbout = function() {
	var $contain = $("#contain");
	$contain.empty();

	var $about = $("<p class='about'>developer.connect() is a community forum where web developers can share projects they are working on, view projects created by others and comment on those projects. If you want to become involved, please sign up at the link above.</p>");
	$contain.append($about);
}


// -----------------------------------------------------------------------------
// AJAX FUNCTIONS
// -----------------------------------------------------------------------------

var testAuth = function() {
	$.ajax({
		url: '/users/test',
		method: 'GET'
	}).done(function(data) {
		// console.log(data);
	});	
};

//This AJAX call will be used when the user IS NOT logged in
var getProjects = function() {
	$.ajax({
		url: "/projects",
		method: "GET"
	}).done(function(data) {
		// console.log(data);
		renderProjects(data);
	})
};

//This AJAX call will be used when the user IS not logged in
var getProjectsProtected = function() {
	$.ajax({
		url: "/projects",
		method: "GET"
	}).done(function(data) {
		// console.log(data);
		renderProjectsProtected(data);
	})
};

//This AJAX call will get the data to render an individual project
var getProject = function(project_id) {
	// var user_id = Cookies.get("userId");
	$.ajax({
		url: "/projects/" + project_id,
		method: "GET",
	}).done(function(data) {
		// console.log(data);
		// console.log("project's user id: " + data.userId);
		renderProject(data);
	})
}

//This AJAX call will get the data to allow a user to edit a project via the edit form
var getProjectForEdit = function(project_id) {
	// var user_id = Cookies.get("userId");
	$.ajax({
		url: "/projects/" + project_id,
		method: "GET",
	}).done(function(data) {
		// console.log(data);
		renderEditProject(data);
	})
}

//This AJAX call will get the user's profile to render their profile "view"
var getProfile = function(user_id) {
	$.ajax({
		url: "/users/" + user_id,
		method: "GET",
	}).done(function(data) {
		// console.log(data);
		renderProfile(data);
	})
}

//This AJAX call will get the user's profile data (minus password) and allow them to edit it via the edit form
var getProfileForEdit = function(user_id) {
	$.ajax({
		url: "/users/" + user_id,
		method: "GET",
	}).done(function(data) {
		// console.log(data);
		renderEditProfile(data);
	})
}

//This AJAX will allow a user to delete a comment if they wrote the comment and refresh the project show "view"
var deleteComment = function(user_id, project_id, comment_id) {
	$.ajax({
		url: "/users/" + user_id + "/project/" + project_id + "/comment/" + comment_id,
		method: "DELETE"
	}).done(function(data) {
		renderProject(data);
	})
}




