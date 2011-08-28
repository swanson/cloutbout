var contentArea = null;

function getContentWidth() {
	return contentArea.clientWidth;
}

function initApp() {
	var tabController = new TabController();
	
	var homeTab = createNavTab("Home", "./img/star_full.png");
	var homeViewStack = createViewStack();
	
	var teamTab = createNavTab("Team", "./img/users.png");
	var teamViewStack = createViewStack();
	
	var leagueTab = createNavTab("My League", "./img/wired.png");
	var leagueViewStack = createViewStack();
	
	var infoTab = createNavTab("Information", "./img/info.png");
	var infoViewStack = createViewStack();
	
	tabController.addSelectionListener(function(tab) {
		switch(tab) {
			case homeTab:
                if(homeViewStack.getViews().length == 0) {
					homeViewStack.pushView(createHomeTabView(homeViewStack));
				}

				break;
			case teamTab:
				if(teamViewStack.getViews().length == 0) {
					teamViewStack.pushView(createTeamTabView(teamViewStack));
				}
				
				break;
			case leagueTab:
                if(leagueViewStack.getViews().length == 0) {
					leagueViewStack.pushView(createLeagueTabView(leagueViewStack));
				}

                break;
			case infoTab:
                if(infoViewStack.getViews().length == 0) {
					infoViewStack.pushView(createInfoTabView(infoViewStack));
				}

				break;
		}
	});
		
    tabController.addTab(teamTab, teamViewStack);
	tabController.addTab(leagueTab, leagueViewStack);
	tabController.addTab(homeTab, homeViewStack);
	tabController.addTab(infoTab, infoViewStack);
	
	tabController.selectTab(teamTab);

}

function initLogin() {
	var body = document.getElementsByTagName("body")[0];
	body.style.textAlign = "center";
	
	var logoEl = createImgEl("logo", null, "./img/splash.png");
	var titleEl = createDivEl("viewTitle", null, "Fantasy Football for Twitter");
	var txtEl = createDivEl("txtBlock", null, "To get started, just Sign In with your Twitter ID!");
	var loginBtnEl = createImgEl("loginBtn", null, "https://si0.twimg.com/images/dev/buttons/sign-in-with-twitter-d.png");
	
    loginBtnEl.addEventListener("click", function() {
		location = "/signin";
	}, false);


	body.appendChild(logoEl);
	body.appendChild(titleEl);
	body.appendChild(txtEl);
	body.appendChild(loginBtnEl);	
}

function onLoad() {
	callGetMethod("/user/logged_in", function(res) {
		if(res.logged_in) {
			initApp();
		} else {
			initLogin();
		}
	});
}

// Controller

function TabController() {
	var navBar = createDivEl("navBar");
	var content  = createDivEl("content");
	var tabMap = new Map();
	var me = this;
	var listeners = new Array();
	var backBtn = createImgEl("backBtn", null, "./img/back.png");
	navBar.appendChild(backBtn);
	backBtn.style.display = "none";
	var activeStack = null;
	var activeTab = null;
	
	contentArea = content;
	
	var size = function() {
		content.style.height = "" + (window.innerHeight - 40) + "px";
	};
	
	setTimeout(size, 100);
	
	window.addEventListener("resize", size, false);
	
	backBtn.addEventListener("click", function(event) {
		activeStack.popView();
	}, false);
	
	this.addSelectionListener = function(listener) {
		listeners.push(listener);
	};
	
	var fireSelectionEvent = function(tab) {
		for(var i in listeners) {
			listeners[i](tab);
		}
	};
	
	this.selectTab = function(tab) {
		if(activeTab) {
			activeTab.style.background = "";
			activeTab.style.borderTop = "";
		}
		
		activeStack = tabMap.get(tab);
		activeTab = tab;
		
		var viewStacks = tabMap.getValues();
		
		for(var i in viewStacks) {
			viewStacks[i].style.display = (activeStack == viewStacks[i]) ? "" : "none";
		}
		
		backBtn.style.display = (activeStack.getViews().length > 1) ? "" : "none";
		
		activeTab.style.background = "rgba(255, 255, 255, 0.6)";
		activeTab.style.borderTop = "solid 1px white";
		
		fireSelectionEvent(tab);
	};
	
	this.addTab = function(tab, viewStack) {
		navBar.appendChild(tab);
		content.appendChild(viewStack);
		tabMap.put(tab, viewStack);
		viewStack.style.display = "none";
		
		tab.addEventListener("click", function(event) {
			me.selectTab(tab);
		});
		
		viewStack.addStackListener(function() {
			backBtn.style.display = (viewStack.getViews().length > 1) ? "" : "none";
		});
	};
	
	var body = document.getElementsByTagName("body")[0];
	body.appendChild(navBar);
	body.appendChild(content);
}

function createViewStack() {
	var stack = createDivEl("viewStack");
	var topView = null;
	var views = new Array();
	var offset = 0;
	
	var listeners = new Array();
	
	stack.addStackListener = function(listener) {
		listeners.push(listener);
	};
	
	var fireStackEvent = function() {
		for(var i in listeners) {
			listeners[i]();
		}
	};
	
	var size = function() {
		offset = (views.length - 1) * getContentWidth();
		stack.style.left = "-" + offset + "px";
	};
	
	window.addEventListener("resize", size, false);
	
	stack.pushView = function(view) {
		offset = views.length * getContentWidth();
		views.push(view);
		topView = view;
		stack.appendChild(view);
		stack.style.left = "-" + offset + "px";
		fireStackEvent();
	};
	
	stack.popView = function() {
		var rem = topView;
		setTimeout(function() {rel(rem);}, 500);
		
		views.pop();
		topView = views[views.length - 1];
		offset = (views.length - 1) * getContentWidth();
		
		if(offset == 0) {
			stack.style.left = "";
		} else {
			stack.style.left = "-" + offset + "px";
		}
		
		fireStackEvent();
	};
	
	stack.getViews = function() {
		return views;
	};
	
	return stack;
}

// Views 

function createPlayerPickerView(defaultPlayer, teamID, slotNum, onSubmit) {
	var view = createDivEl("view");
	var loadingEl = createDivEl("loading", null, "Loading...");
	var titleEl = createDivEl("viewTitle", null, "Edit Roster Entry #" + slotNum);
	var handleFieldEl = createTextInputEl("80%");
	var suggestEl = createDivEl("viewTitle", null, "Suggestions");
	var submitBtnEl = createDivEl("submitBtn", null, "Submit");
	
	var tiles = new Array();
	
	handleFieldEl.value = defaultPlayer.name;
	
	view.appendChild(loadingEl);
	
	var createTileListener = function(user) {
		return function(event) {
			handleFieldEl.value = "@" + user.screen_name;
		};
	};
	
	submitBtnEl.addEventListener("click", function(event) {
		submitBtnEl.innerHTML = "Please Wait...";
		
		callPostMethod("/team/" + teamID + "/add_player",  handleFieldEl.value, function() {
			onSubmit();
		});
	}, false);
	
	callGetMethod("/user/get_following", function(users) {
		rel(loadingEl);
		
		view.appendChild(titleEl);
		view.appendChild(handleFieldEl);
		view.appendChild(suggestEl);
		
		var tile = null;
		
		for(var i in users) {
			tile = createUserTile(users[i], false, createTileListener(users[i]));
			tiles.push(tile);
			view.appendChild(tile);
		}
		
		if(tile) {
			tile.style.borderBottom = "solid 1px #777";
		}
		
		view.appendChild(submitBtnEl);
	});
	
	return view;
}

function createLeagueTabView(viewStack) {
	var view = createDivEl("view");
	var loadingEl = createDivEl("loading", null, "Loading...");
	var titleEl = createDivEl("viewTitle", null, "DinoSorbet League");	
	var teamTiles = new Array();
	var playerTiles = new Array();
	
	var refresh = function() {
		view.innerHTML = "";
		view.appendChild(loadingEl);
		
		callGetMethod("/league/1/show_teams", function(teams) {
			rel(loadingEl);
			view.appendChild(titleEl);
			
			var tile = null;
			var players = null;
			
			for(var i in teams) {
				tile = createTeamTile(teams[i].team, true, false);
				teamTiles.push(tile);
				view.appendChild(tile);
				tile.style.background = "#777";
				tile.style.color = "white";
				
				//teams[i].name
				//teams[i].current_score;
				
				players = teams[i].team.current_roster.players;
				
				for(var j in players) {
					tile = createPlayerTile(players[j], true, false, function() {});
					playerTiles.push(tile);
					view.appendChild(tile);
				}
			}
			
			if(tile) {
				tile.style.borderBottom = "solid 1px #777";
			}
		});
	};
	
	view.appendChild(loadingEl);
	
	refresh();
	
	return view;
}

function createHomeTabView(viewStack) {
	var view = createDivEl("view");
	
	view.innerHTML = "<a href='/signin'>Sign In With Twitter</a>";
	
	return view;
}

function createHomeTabView(viewStack) {
	var view = createDivEl("view");
	var playerTiles = new Array();
	var titleEl = createDivEl("viewTitle", null, "Top Scoring This Week");
	var loadingEl = createDivEl("loading", null, "Loading...");
	
	var refresh = function() {
		view.innerHTML = "";
		view.appendChild(loadingEl);
		
		callGetMethod("/leaderboard/players", function(players) {
			rel(loadingEl);
			view.appendChild(titleEl);
			
			var playerTile = null;
			
			for(var i in players) {
				playerTile = createPlayerTile(players[i].player, true, false, function() {});
				view.appendChild(playerTile);
				playerTiles.push(playerTile);
			}
			
			if(playerTile) {
				playerTile.style.borderBottom = "solid 1px #777";
			}
		});
	};
	
	refresh();
	
	return view;
}

function createInfoTabView(viewStack) {
	var view = createDivEl("view");
	
	var whatIsEl = createDivEl("viewTitle", null, "What Is CloutBout?");
	var scoreEl = createDivEl("viewTitle", null, "How Do Scores Work?");
	
	var aboutEl = createDivEl("txtBlock", null, "CloutBout takes the fun and competition of fantasy football to the Twitter gridiron. <br/><br/>Pick your team of five Twitter all-stars and face off against your friend&#39;s squad.<br/><br/>Matches end weekly, so get started today! Just sign in with Twitter --- no extra registration required!");
	var rulesEl = createDivEl("txtBlock", null, "A player accumulates points from: <br /><br />" +
			"Tweets: 1 point <br />" +
			"Getting Retweeted: 1.5 points <br />" +
			"Tweeting links: 0.25 point<br />" +
			"Mentioning: 0.1 point<br />" +
			"#Hash tagging: 0.1 point");

	view.appendChild(whatIsEl);
	view.appendChild(aboutEl);
	view.appendChild(scoreEl);
	view.appendChild(rulesEl);
	
	return view;
}

function createTeamTabView(viewStack) {
	var view = createDivEl("view");
	var loadingEl = createDivEl("loading", null, "Loading...");
	var titleEl = null;
	var playerTiles = new Array();
	var teamID = 0;
	
	view.appendChild(loadingEl);
	
	var refresh = function() {
		view.innerHTML = "";
		view.appendChild(loadingEl);
		
		callGetMethod("/user/get_team", function(data) {
            team = data.team;
			teamID = team.id;
			
			callGetMethod("/team/" + teamID + "/roster", function(data) {
				rel(loadingEl);
				
				titleEl = createDivEl("viewTitle", null, team.name);	
				view.appendChild(titleEl);
				
				var playerTile = null;
				
				for(var i in data) {
					playerTile = createPlayerTile(data[i].player, false, true, createTileListener(data[i].player, (parseInt(i) + 1)));
					view.appendChild(playerTile);
					playerTiles.push(playerTile);
				}
				
				if(playerTile) {
					playerTile.style.borderBottom = "solid 1px #777";
				}
			});
		});
	};
	
	var createTileListener = function(player, slotNum) {
		return function(event) {
			viewStack.pushView(createPlayerPickerView(player, teamID, slotNum, function() {
				refresh();
				viewStack.popView();
			}));
		};
	};
	
	refresh();
	
	return view;
}

// View - Tiles

function createUserTile(user, btn, onClick) {
	var tileEl = createDivEl("playerTile row");
	
	var imgEl = createImgEl("playerImg", null, user.profile_image_url);
	tileEl.appendChild(imgEl);
	
	var nameEl = createDivEl("playerName", null, "@" + user.screen_name);
	tileEl.appendChild(nameEl);
    nameEl.style.top = "12px";
	
	if(btn) {
		var btnEl = createImgEl("diveBtn", null, "./img/next.png");	
		tileEl.appendChild(btnEl);
	}
	
	if(onClick) {
		tileEl.addEventListener("click", onClick, false);
	}
	
	return tileEl;
}

function createPlayerTile(player, score, btn, onClick) {
	var tileEl = createDivEl("playerTile row");
	
    image_url = "http://api.twitter.com/1/users/profile_image?screen_name=" +
        player.name.substring(1) + "&size=bigger";

	var imgEl = createImgEl("playerImg", null, image_url);
	tileEl.appendChild(imgEl);
	
	var nameEl = createDivEl("playerName", null, player.name);
	tileEl.appendChild(nameEl);
	
	if(score) {
		var scoreEl = createDivEl("playerScore", null, "Score: " + player.current_score);
		tileEl.appendChild(scoreEl);
	} else {
        nameEl.style.top = "12px";
    }
	
	if(btn) {
		var btnEl = createImgEl("diveBtn", null, "./img/next.png");	
		tileEl.appendChild(btnEl);
		tileEl.addEventListener("click", onClick, false);
	}
	
	return tileEl;
}

function createTeamTile(team, score, btn) {
	var tileEl = createDivEl("teamTile row");
	
	var imgEl = createImgEl("teamImg", null, team.image_url);
	//tileEl.appendChild(imgEl);
	
	var nameEl = createDivEl("teamName", null, team.name);
	tileEl.appendChild(nameEl);
	
	if(score) {
		var scoreEl = createDivEl("teamScore", null, "Score: " + team.current_score);
		tileEl.appendChild(scoreEl);
	}
	
	if(btn) {
		var btnEl = createDivEl("diveBtn");	
		tileEl.appendChild(btnEl);
	}

	return tileEl;
}

// View - Tabs

function createNavTab(title, img) {
	var tabEl = createDivEl("tab");
	var imgEl = createImgEl("tabImg", title, img);
		
	tabEl.appendChild(imgEl);
	
	tabEl.getTitle = function() {
		return title;
	};
	
	return tabEl;
}

// View - Elements

function createDivEl(className, id, content) {
	var ret = document.createElement("div");
	
	if(className) {
		ret.className = className;	
	}
	
	if(id) {
		ret.id = id;	
	}
	
	if(content) {
		if(content instanceof HTMLElement) {
			ret.appendChild(content);
		} else {
			ret.innerHTML = content;
		}	
	}

	return ret;
}

function createImgEl(className, id, src) {
	var ret = document.createElement("img");
	
	if(className) {
		ret.className = className;	
	}
	
	if(id) {
		ret.id = id;	
	}
	
	if(src) {
		ret.src = src;	
	}

	return ret;
}

function createTextInputEl() {
	var input = document.createElement("input");
	input.setAttribute("type", "text"); 
	input.style.width = "80%";
	input.style.marginLeft = "7%";
	input.style.fontSize = "18px";
	return input;
}

// Models

function Team(pId, pOwner, pLid, pName, pIurl, pLws, pCs, pCr, pFr) {
	this.id = (pId) ? pId : 0; // int
	this.owner = (pOwner) ? pOwner : null; // User
	this.league_id = (pLid) ? pLid : 0; // int
	this.name = (pName) ? pName : ""; // string
	this.image_url = (pIurl) ? pIurl : ""; // string
	this.last_week_score = (pLws) ? pLws : 0; // int
	this.current_score = (pCs) ? pCs: 0; // int
	this.current_roster = (pCr) ? pCr : new Array(); // Player[]
	this.future_roster = (pFr) ? pFr : new Array(); // Player[]
}

function League(pId, pName, pTeams, pComm) {
	this.id = (pId) ? pId : 0; // int
	this.name = (pName) ? pName : ""; // string
	this.teams = (pTeams) ? pTeams : new Array(); // Team[]
	this.commissioner = (pComm) ? pComm : null; // User
}

function User(pId, pHandle, pIurl) {
	this.id = (pId) ? pId: 0 ; // int
	this.handle = (pHandle) ? pHandle : ""; // string
	this.image_url = "https://si0.twimg.com/profile_images/506638865/meSmall_normal.PNG"; // string
}

function Player(pId, pHandle, pLws, pCs) {
	this.id = (pId) ? pId : 0; // int
	this.handle = (pHandle) ? pHandle : ""; // string
	this.last_week_score = (pLws) ? pLws : 0; // int
	this.current_score = (pCs) ? pCs : 0; // int
	this.image_url = "https://si0.twimg.com/profile_images/506638865/meSmall_normal.PNG"; // string
}

// Communication

function callGetMethod(methodURL, callback) {
	// Create & setup the request object.
	var req = new XMLHttpRequest();
	req.open("GET", methodURL, true);
	req.setRequestHeader("Cache-Control", "no-cache");
	req.setRequestHeader("Pragma", "no-cache");
	
//	// Setup the callback.
	req.onreadystatechange = function() {
		if(req.readyState == 4) {
			if(req.status == 200) {
				if(req.responseText != null) {
					callback(JSON.parse(req.responseText));
				} else {
					callback(new ComError());
				}
			} else {
				callback(new ComError());
			}
		}
	};
	
	try {
		// Send the request.
		req.send(null);
	} catch (err) {
		callback(new ComError());
	}
}

function callPostMethod(methodURL, inputData, callback) {
	// Create & setup the request object.
	var req = new XMLHttpRequest();
	req.open("POST", methodURL, true);
	req.setRequestHeader("Cache-Control", "no-cache");
	req.setRequestHeader("Pragma", "no-cache");
	req.setRequestHeader("Content-type", "application/json");
    
    var tokens = document.getElementsByTagName("meta");
	var token = null;
	
	for(var i in tokens) {
		if(tokens[i].name == "csrf-token") {
			token = tokens[i].content;
		}
	}
	
	req.setRequestHeader("X-CSRF-Token", token);

	
	if(!callback) {
		var callback = function() {};
	}
	
	// Setup the callback.
	req.onreadystatechange = function() {
		if(req.readyState == 4) {
			if(req.status == 200) {
				if(req.responseText != null) {
					callback(JSON.parse(req.responseText));
				} else {
					callback(new ComError());
				}
			} else {
				callback(new ComError());
			}
		}
	};
	
	try {
		// Send the request.
		req.send(JSON.stringify(inputData));
	} catch (err) {
		callback(new ComError());
	}
}

function ComError() {
	
}

// Utility

function rel(id) {
	if(id instanceof HTMLElement) {
		var e = id;
	} else {
		var e = el(id);	
	}
	
	try {
		if(e != null) {
			e.parentElement.removeChild(e);
		}	
	} catch(e) {}
	
}

/*
 * A simple Map class definition. Based on code from:
 * http://freecode-freecode.blogspot.com/2007/06/hashmap-object-in-javascript-like.html
 */
function Map() {
	var me = this;
    var keys = new Array();
    var values = new Array();
	
    this.put = function(key, val) {
		var elementIndex = me.indexOf(key);
		
		if(elementIndex == -1) {
			keys.push(key);
			values.push(val);
		} else {
			values[elementIndex] = val;
		}
	};
	
    this.get = function(key) {
		var result = null;
		var elementIndex = me.indexOf(key);

		if(elementIndex != -1) {   
			result = values[elementIndex];
		}  
		
		return result;
	};
	
	this.getKey = function(value) {
		var result = null;
		var elementIndex = me.indexOfValue(value);
		
		if(elementIndex != -1) {
			result = keys[elementIndex];
		}
		
		return result;
	};
	
	this.getValues = function() {
		return values;
	};
	
	this.getKeys = function() {
		return keys;
	};
	
    this.getSize = function() {
		return keys.length;  
	};  
	
    this.clear = function() {
		for(var i = 0; i < me.keys.length; i++) {
			keys.pop(); 
			values.pop();   
		}
	};
	
    this.remove = function(key) {
		var elementIndex = me.indexOf(key);
		var ret = me.get(key);
		
		if(elementIndex != -1) {
			keys.splice(elementIndex, 1);
			values.splice(elementIndex, 1);
		}  
		
		return ret;
	};
	
	this.indexOf = function(key) {
		var result = -1;

		for(var i = 0; i < keys.length; i++) {
			if(keys[i] == key) {
				result = i;
				break;
			}
		}
		
		return result;
	};
	
	this.indexOfValue = function(value) {
		var result = -1;

		for(var i = 0; i < values.length; i++) {
			if(values[i] == value) {
				result = i;
				break;
			}
		}
		
		return result;
	};
}
