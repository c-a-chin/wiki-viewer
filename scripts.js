// shrink search bar function
function shrinkInput(){
	$("input").addClass("shrinkInput");
	// remove focus after shrink to change input bar to search icon, and remove animation classes after they finish
	setTimeout(() => {
		$("input").focusout();
		setTimeout(() => {
			$("input").removeClass("shrinkInput");
			moveInput();
			setTimeout(() => {
				// set location of search functionality after initial search
				$("img").removeClass("moveInput");
				$("input").removeClass("moveInput");

				$("#search").css({
					 transform: 'translateY(-30vh) translateX(-35vw)',
					 MozTransform: 'translateY(-30vh) translateX(-35vw)',
					 WebkitTransform: 'translateY(-30h) translateX(-35vw)',
					 msTransform: 'translateY(-30vh) translateX(-35vw)'
				});

				// remove previous "on keyup" function, change to just search instead of moving search functionality around page
				$("input").off("keyup");
				$("input").on("keyup", (event) => {
					// if enter key is pressed
					if(event.keyCode === 13){
						$("input").focusout();
						// clear previous results
						$(".result").remove();
						$(".no-results").remove();
						searchWiki($("input").val());
					}
				})
			}, 3000);
		}, 500);
	}, 500);
};
// move search bar/search icon function
function moveInput(){
	$("img").addClass("moveInput");
	$("input").addClass("moveInput");
};




// trigger search on "enter" key instead of a button
$("input").on("keyup", (event) => {
	// if "enter" key is pressed
	if(event.keyCode === 13){
		shrinkInput();
		searchWiki($("input").val());
	};
});

// animations to fade out/in search icon/search input
$("img").on("click",() =>{
	$("img").fadeOut(500, () =>{
		$("input").fadeIn(500);
		$("input").focus();
	});
	
});
$("input").focusout(() =>{
	$("input").fadeOut(500, () =>{
		$("img").fadeIn(500);
	});
});


// create search result html to append to page
function newResult(data){
	// take search result as json data, convert to html for page
	var pageId = data.pageid;
	// get url for wiki page
	var url = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=info&inprop=url&origin=*&pageids=" + pageId;
	fetch(url)
	.then(function(response){
		response.json().then(function(urlData){
			var result = `
				<a class="link" href="${urlData.query.pages[pageId].fullurl}" target="_blank">
					<div class="result">
						<h5>${data.title}</h5> <p><em>${data.snippet}</em></p>
					</div>
				</a>
				`;
			// append new result to results div, then immediately .hide() so that we can fade it in
			$("#results").append(result);
			$(".result").hide();
			// add on mouse hover effect
			$(".result").mouseenter(function(){
				$(this).css("background-color", "rgba(255,255,255,0.6)");
			});
			$(".result").mouseleave(function(){
				$(this).css("background-color", "rgba(255,255,255,0)");
			});
			// fade in
			$(`.result`).fadeIn(1000);
		});
	});

};


// populate search results
function populateSearchResults(data){
	// takes data as json from wiki api response, create new result for each result in json list
	for(var i=0; i<data.length; i++){
		newResult(data[i]);
	};	
};

// search wikipedia and display results function
function searchWiki(search){
	var url = "https://en.wikipedia.org/w/api.php?action=query&origin=*&list=search&format=json&utf8=&srsearch=" + search;
	url = url.replace(/ /g, "%20");

	fetch(url)
	.then(response => {

		response.json().then(data => {
			// if no results found
			if(data.query.searchinfo.totalhits == 0){
				$("#results").append(`
					<div class="no-results">No Results Found :(</div>
				`);
			} else {
				populateSearchResults(data.query.search);
			};
		});
	});
}