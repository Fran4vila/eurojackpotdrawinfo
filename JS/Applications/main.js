var data; // JSON with the information provided form the site
const setOfTemplates = ["headerDatePicker", "contentInfo"];
const days_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const days_names_short = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var mainApp = $('#mainApp');

function getData () {
	// This Ajax request is not allowed because of Cross Domain which is disabled in server
	$.ajax({
		'url': 'https://media.lottoland.com/api/drawings/euroJackpot',
		'type': 'GET',
		'dataType': 'json',
		'success': function(response) {
			console.log(response);
		}
	}).done( function (response) {
		data = response;
		getTemplates();
	}).fail( function () {
		// We get a local copy of the data
		getLocalCopy();
	});
}
function getLocalCopy () {
	$.getJSON( "data/info.json", function( response ) {
		data = response;
		getTemplates();
	});
}
function getTemplates () {
	$.get('./templates/templates.html', function(res){
        //store the template
        var auxLength = setOfTemplates.length;
        for (var i = 0; i < auxLength; i++) {
            createTemplate(res, setOfTemplates[i]);
        }
		build();
    });
}
function createTemplate(data, templateId) {
    //get the correct template
    var template = $(data).find("div#" + templateId + "");
    ich.addTemplate(templateId, template.html());
}

function build () {

}