var data, lastDate; // JSON with the information provided form the site
const setOfTemplates = ["headerDatePicker", "contentInfo", "messages"];
const days_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const days_names_short = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const results_table = {
	'rank1': {
		'tier': 'Tier I',
		'combination': '5 Numbers, 2 Euronumbers'
	},
	'rank2': {
		'tier': 'Tier II',
		'combination': '5 Numbers, 1 Euronumber'
	},
	'rank3': {
		'tier': 'Tier III',
		'combination': '5 Numbers, 0 Euronumbers'
	},
	'rank4': {
		'tier': 'Tier IV',
		'combination': '4 Numbers, 2 Euronumbers'
	},
	'rank5': {
		'tier': 'Tier V',
		'combination': '4 Numbers, 1 Euronumber'
	},
	'rank6': {
		'tier': 'Tier VI',
		'combination': '4 Numbers, 0 Euronumbers'
	},
	'rank7': {
		'tier': 'Tier VII',
		'combination': '3 Numbers, 2 Euronumbers'
	},
	'rank8': {
		'tier': 'Tier VIII',
		'combination': '2 Numbers, 2 Euronumbers'
	},
	'rank9': {
		'tier': 'Tier IX',
		'combination': '3 Numbers, 1 Euronumber'
	},
	'rank10': {
		'tier': 'Tier X',
		'combination': '3 Numbers, 0 Euronumbers'
	},
	'rank11': {
		'tier': 'Tier XI',
		'combination': '1 Numbers, 2 Euronumbers'
	},
	'rank12': {
		'tier': 'Tier XII',
		'combination': '2 Numbers, 1 Euronumber'
	}
};

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
	createHeader();
	createContent();
	createMessages();
}
function createHeader () {
	var info = {
        'headerText': "EuroJackpot Results & Winning Numbers"
    };
    var html = ich["headerDatePicker"](info);
	$('#jackpotContainer').append(html);
	// Create the Select box
	lastDate = data.last.date;
	var auxLastDate = new Date(lastDate.year, lastDate.month, lastDate.day);
	var sel = $('#datePickerSelectedDay');
	sel.append($("<option>").attr('value',auxLastDate).text(`${days_names[auxLastDate.getDay()]} ${auxLastDate.getDate()} ${month_names_short[auxLastDate.getMonth()]}`));
	// We show last 10 dates
	for (var i=0; i<10; i++) {
		auxLastDate.setDate(auxLastDate.getDate() -7);
		sel.append($("<option>").attr('value',auxLastDate).text(`${days_names[auxLastDate.getDay()]} ${auxLastDate.getDate()} ${month_names_short[auxLastDate.getMonth()]}`));
	}
	// We disable the select because AJAX is not working and we don't have more information about other dates
	sel.attr('disabled', true);
}
function createContent() {
	var info = {
        'subTitle': "EuroJackpot",
        'selectedDate': `Results for ${getSelectedDateText(data.last.date)}`
    };
	var html = ich["contentInfo"](info);
	$('#jackpotContainer').append(html);
	// We include the numbers
	$('#numberContainer').html(getNumbersByDate(data.last));
	// Summary of results
	createTable();
}

function getSelectedDateText (selectDate) {
	var date = new Date(selectDate.year, selectDate.month, selectDate.day);
	return `${days_names[date.getDay()]} ${date.getDate()} ${month_names_short[date.getMonth()]} ${date.getFullYear()}`;
}
function getNumbersByDate (selectDate) {
	var auxCombination = $('<ul class="balls"></ul>');
	const length = selectDate.numbers.length;
	for (var i=0; i<length; i++) {
		auxCombination.append(`<li> ${selectDate.numbers[i]} </li>`);
	}
	auxCombination.append(`<li class="extra"> ${selectDate.euroNumbers[0]} </li>`);
	auxCombination.append(`<li class="extra"> ${selectDate.euroNumbers[1]} </li>`);
	return auxCombination;
}
function createTable () {
	var odds = data.last.odds,
		tr = [],
		rank;

	delete odds.rank0;
	var auxOdd, auxInfoTier, tBody = $('<tbody></tbody>');
	for (lines in odds) {
		auxOdd = odds[lines];
		auxInfoTier = results_table[lines];
		trElement = `<tr>
            <td class="division halfContainer">
                <span class="tierSpan entry">${auxInfoTier.tier}</span>
                <span class="rankSpan entry">${auxInfoTier.combination}</span>
            </td>
            <td class="number halfContainer">
                <span class="entry winners">${auxOdd.winners}x</span>
                <span class="entry prize"><span class="">€ ${auxOdd.prize}</span></span>
            </td>
        </tr>`;
        tBody.append(trElement);
	}
	var table = $('<table></table>').append(tBody);
	$('#tableContainer').append(table);
}
function createMessages() {
	var auxTime = data.last.lateClosingDate.split(', ');
	var info = { 
		'lateClosingDate': `${lastDate.day}.${lastDate.month}.${lastDate.year}`,
		'lastDrawNumber': data.last.nr,
		'lateClosingTime': auxTime[1]
	};
    var html = ich["messages"](info);
    $('#messagesContainer').append(html);
}