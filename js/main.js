var data, lastDate; // JSON with the information provided form the site
const setOfTemplates = ["headerDatePicker", "contentInfo", "messages"];
const days_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const days_names_short = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const results_table = {
	'rank1': {
		'tier': 'Tier I',
		'combination': '5 Numbers, 2 Euronumbers',
		'numbers': 5,
		'euroNumbers': 2
	},
	'rank2': {
		'tier': 'Tier II',
		'combination': '5 Numbers, 1 Euronumber',
		'numbers': 5,
		'euroNumbers': 1
	},
	'rank3': {
		'tier': 'Tier III',
		'combination': '5 Numbers, 0 Euronumbers',
		'numbers': 5,
		'euroNumbers': 0
	},
	'rank4': {
		'tier': 'Tier IV',
		'combination': '4 Numbers, 2 Euronumbers',
		'numbers': 4,
		'euroNumbers': 2
	},
	'rank5': {
		'tier': 'Tier V',
		'combination': '4 Numbers, 1 Euronumber',
		'numbers': 4,
		'euroNumbers': 1
	},
	'rank6': {
		'tier': 'Tier VI',
		'combination': '4 Numbers, 0 Euronumbers',
		'numbers': 4,
		'euroNumbers': 0
	},
	'rank7': {
		'tier': 'Tier VII',
		'combination': '3 Numbers, 2 Euronumbers',
		'numbers': 3,
		'euroNumbers': 2
	},
	'rank8': {
		'tier': 'Tier VIII',
		'combination': '2 Numbers, 2 Euronumbers',
		'numbers': 2,
		'euroNumbers': 2
	},
	'rank9': {
		'tier': 'Tier IX',
		'combination': '3 Numbers, 1 Euronumber',
		'numbers': 3,
		'euroNumbers': 1
	},
	'rank10': {
		'tier': 'Tier X',
		'combination': '3 Numbers, 0 Euronumbers',
		'numbers': 3,
		'euroNumbers': 0
	},
	'rank11': {
		'tier': 'Tier XI',
		'combination': '1 Numbers, 2 Euronumbers',
		'numbers': 1,
		'euroNumbers': 2
	},
	'rank12': {
		'tier': 'Tier XII',
		'combination': '2 Numbers, 1 Euronumber',
		'numbers': 2,
		'euroNumbers': 1
	}
};

/**
 * Get JSON with the info of the last dates.
 */
var getData = () => {
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
/**
 * Method to get the local copy of the JSON
 */
var getLocalCopy = () => {
	$.getJSON( "data/info.json", function( response ) {
		data = response;
		getTemplates();
	});
}
/**
 * Create the different templates we will use.
 */
var getTemplates = () => {
	$.get('./templates/templates.html', function(res){
        //store the template
        var auxLength = setOfTemplates.length;
        for (var i = 0; i < auxLength; i++) {
            createTemplate(res, setOfTemplates[i]);
        }
		build();
    });
}
/**
 * Includes the templates in the variable ich
 */
var createTemplate = (data, templateId) => {
    //get the correct template
    var template = $(data).find("div#" + templateId + "");
    ich.addTemplate(templateId, template.html());
}
/**
 * Build the site.
 */
var build = () => {
	createHeader();
	createContent();
	createMessages();
}
/**
 * Create the header of the site.
 */
var createHeader = () => {
	var info = { 'headerText': "EuroJackpot Results & Winning Numbers" };
    $('#jackpotContainer').append(ich["headerDatePicker"](info));
	// Create the Select box
	lastDate = data.last.date;
	var auxLastDate = new Date(lastDate.year, lastDate.month, lastDate.day);
	var selDay = $('#datePickerSelectedDay');
	var selYear = $('#datePickerSelectedYear');
	selDay.append($("<option>").attr('value',auxLastDate).text(`${days_names_short[auxLastDate.getDay()]} ${auxLastDate.getDate()} ${month_names_short[auxLastDate.getMonth()]}`));
	selYear.append($("<option>").attr('value',lastDate.year).text(lastDate.year));
	// We show last 10 dates
	for (var i=0; i<10; i++) {
		auxLastDate.setDate(auxLastDate.getDate() -7);
		selDay.append($("<option>").attr('value',auxLastDate).text(`${days_names_short[auxLastDate.getDay()]} ${auxLastDate.getDate()} ${month_names_short[auxLastDate.getMonth()]}`));
		selYear.append($("<option>").attr('value',lastDate.year).text(lastDate.year--));
	}
	// We disable the select because AJAX is not working and we don't have more information about other dates
	selDay.attr('disabled', true);
	selYear.attr('disabled', true);
}
/**
 * Create the content of the site.
 */
var createContent = () => {
	var info = {
        'subTitle': "EuroJackpot",
        'selectedDate': `Results for ${getSelectedDateText(data.last.date)}`
    };
	$('#jackpotContainer').append(ich["contentInfo"](info));
	$('#jackpotContainer').append($('<div>Select your combination to check if you are a new rick!</div>'));
	// We include the numbers
	$('#numberContainer').html(getNumbersByDate(data.last));
	// Summary of results
	createTable();
}
/**
 * Method to build a date.
 * @param {object} selectDate info of the selected.
 * @return {string} The result of building the date.
 */
var getSelectedDateText = (selectDate) => {
	var date = new Date(selectDate.year, selectDate.month, selectDate.day);
	return `${days_names[date.getDay()-1]} ${date.getDate()} ${month_names_short[date.getMonth()]} ${date.getFullYear()}`;
}
/**
 * Creates a list of numbers.
 * @param {object} selectDate info of the selected.
 * @return {HTML element} List with the numbers for a date.
 */
var getNumbersByDate = (selectDate) => {
	var auxCombination = $('<ul id="ballsList" class="ballsContainer"></ul>');
	auxCombination.on('click', checkCombination.bind(this));
	const length = selectDate.numbers.length;
	for (var i=0; i<length; i++) {
		auxCombination.append(`<li id='ball${i}' class="ballNumber normal"> ${selectDate.numbers[i]} </li>`);
	}
	auxCombination.append(`<li id="extraBall1" class="ballNumber extra"> ${selectDate.euroNumbers[0]} </li>`);
	auxCombination.append(`<li id="extraBall2" class="ballNumber extra"> ${selectDate.euroNumbers[1]} </li>`);
	return auxCombination;
}
/**
 * Method to select/unselect balls and check prizes
  * @param {event} event information of the clicked element 
 */
var checkCombination = (event) => {
	// Enabled / Disable selection
	var auxElem = $(`#${event.target.id}`);
	if (auxElem.hasClass("ballNumber")) {
		if (auxElem.hasClass("ballSelected"))
			auxElem.removeClass('ballSelected');
		else
			auxElem.addClass('ballSelected');
		checkResult();
	}
}
/**
 * Checking if the combination selected is in the table to highlight it
 */
 var checkResult = () => {
	var numbersCont = $('#ballsList').children('.normal.ballSelected').length;
	var euroNumbersCont = $('#ballsList').children('.extra.ballSelected').length;
	// We reset the prize shown
	if ($('.currentPrize'))
		$('.currentPrize').removeClass('currentPrize');
	$.each(results_table, (tier) => {
		// We check if there is a new prize
		if ( (results_table[tier].numbers === numbersCont) && (results_table[tier].euroNumbers === euroNumbersCont) ) {
			if ( $(`#${tier}`).hasClass('currentPrize') )
				$(`#${tier}`).removeClass('currentPrize');
			else
				$(`#${tier}`).addClass('currentPrize');
		}
	});
}
/**
 * Creates the table with the results.
 */
var createTable = () => {
	var auxOdd, auxInfoTier, auxNumber, pos, trElem,
		odds = data.last.odds, lines, elem, arrLines = [],
		tBody = $('<tbody></tbody>');

	delete odds.rank0;
	for (lines in odds) {
	 	auxOdd = odds[lines];
	 	// First to order the elements
	 	pos = lines.substring(4);
		auxInfoTier = results_table[lines];
		auxNumber = numberWithCommas(auxOdd.prize);
		var trElem = $(`<tr id='${lines}'>
            <td class='division halfContainer'>
                <span class='tierSpan entry'>${auxInfoTier.tier}</span>
                <span class='rankSpan entry'>${auxInfoTier.combination}</span>
            </td>
            <td class='number halfContainer'>
                <span class='entry winners'>${auxOdd.winners}x</span>
                <span class='entry prize'>€ ${auxNumber}</span>
            </td>
        </tr>`);
		arrLines[pos] = trElem;
	}
	for (elem in arrLines) {
    	tBody.append(arrLines[elem]);
    }
	var table = $('<table></table>').append(tBody);
	$('#tableContainer').append(table);
}
/**
 * Creates the number with commas in thousands.
 * @param {string} number string with the number to convert.
 * @return {string} Number with commas.
 */
 var numberWithCommas = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
/**
 * Creates the extra messages at the bottom of the results.
 */
var createMessages = () => {
	var auxTime = data.last.lateClosingDate.split(', ');
	var info = { 
		'lateClosingDate': `${lastDate.day}.${lastDate.month}.${lastDate.year}`,
		'lastDrawNumber': data.last.nr,
		'lateClosingTime': auxTime[1]
	};
    $('#messagesContainer').append(ich["messages"](info));
}