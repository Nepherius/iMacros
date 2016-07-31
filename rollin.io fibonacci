/************************************************
*			Rollin.IO iMacro Fibonnaci Bot
*				Made by Nepherius
*		You can contact me at prowiki@live.com
*	Requires iMacros Plugin For FireFox/Mozilla
*	Would appreciate if you could use my ref 
*	link https://rollin.io/ref/pkk, thanks and 
*				Good Luck! 
************************************************/

// Settings
/*Ideally first and second number should TOTAL a number from the fibonnaci sequence: 
0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233 and so on. 
Don't be greedy, this numbers increase really fast so make sure you have AT LEAST 400 
times the starting bet in your bankroll.
*/

var maxSessions = 1000000; // Number of total Bets to place
var firstNumber = 0.00005;
var secondNumber = 0.00008;
var initialPrediction = 55; // Default Prediction
var firstBetPrediction = 70; // Higher payout for first bet, on loss it goes back to initialPrediction.

// Shouldn't edit anything below unless you know what you are doing

function loadJQ() { // Load Jquery
	function loadScriptFromURL(url) {
		var request = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest),
		async = false;
		request.open('GET', url, async);
		request.send();
		if (request.status !== 200) {
			var message = 'An error occurred while loading script at url: ' + url + ', status: ' + request.status;
			iimDisplay(message);
			return false;
		}
		eval(request.response);
		return true;
	}
	loadScriptFromURL('https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js');
	$ = window.$,
	JQuery = window.JQuery;
}

function iWait(waitTime) {
	iimPlayCode('WAIT SECONDS =' + waitTime);
}

function handleBetResult() {
	//Get Bet Result
	var betResult = $('.inner .clearfix.status').attr("class")
		if (betResult.match(/lost/gi)) {
		consecutiveWins = 0;
		consecutiveLosses++;
		if (consecutiveLosses > lossStreak) {
			lossStreak = consecutiveLosses;
		}
		totalLosses++;
		firstNumber = secondNumber
		secondNumber = betSize;
		return false
	} else if (betResult.match(/won/gi)){
		decreasePrediction = 0;
		consecutiveLosses = 0;
		consecutiveWins++;
		if (consecutiveWins > winStreak) {
			winStreak = consecutiveWins;
		}
		totalWins++;
		firstNumber = defaultFirstNumber;
		secondNumber =  defaultSecondNumber;
		betSize = firstNumber + secondNumber;
		return false
	}
	return true
}

loadJQ()

// End of Settings
var defaultFirstNumber = firstNumber;
var defaultSecondNumber = secondNumber;
var betSize = firstNumber + secondNumber;
var peakBalance = 0;
var decreasePrediction = 0;
var consecutiveLosses = 0;
var consecutiveWins = 0;
var totalLosses = 0;
var totalWins = 0;
var betSessions = 0;
var winStreak = 0;
var lossStreak = 0;
var main;


//$('.inner .clearfix.status').attr("class") // get won/lost class

var initialBalance = +$('.balance strong').text()

$('#bet_min.tab').click() // set minimum bet amount
$('.controls .control #bet_number.numeric').val(initialPrediction) // Set Prediction

for (var i = 0; i < maxSessions;i++) {
	
	iWait(0.5)	
	
	var currentBalance = +$('.balance strong').text()
	
	if (currentBalance <= 0) {
		alert('Ran out of mBTC, deposit more next time!')
		break;
	} else if (currentBalance > peakBalance) {
		peakBalance = currentBalance
	}
	
	var betSize = firstNumber + secondNumber;
	
	betSessions++; // Count Bets
	
	// Start Betting
	if(betSize >= currentBalance) { // Not enought money for next bet
		$('.control.bet-amount-control #bet_amount').val(currentBalance.toFixed(5))
	} else {
		$('.control.bet-amount-control #bet_amount').val(betSize.toFixed(5)) // Set Bet Amount	
	}
	if (consecutiveLosses >= 10 && decreasePrediction < 6) { // Increase win odds if loss streak is to big
		decreasePrediction += 1; // Decrease prediction by 1/per bet will reset on WIN
	} else if (consecutiveLosses === 0) {
		$('.controls .control #bet_number.numeric').val(firstBetPrediction)
	} else {	
		$('.controls .control #bet_number.numeric').val(initialPrediction - decreasePrediction)
	}
	iWait(0.25)
	
	// Bet	
	
	$('#bet_bigger.control').click()	
	
	iWait(0.5);
	
	while(handleBetResult()) {
		iWait(1)
	}
	
	// Display Stats
    iimDisplay(
		"Starting Balance: " + initialBalance + "\n" +
		"Peak Balance: " + peakBalance + "\n" +
		"Current Balance: " + currentBalance.toFixed(5) + "\n" +
		"Total Bets: " + betSessions + "\n" +
        "Total Wins: " + totalWins + "\n" +
        "Total Losses: " + totalLosses + "\n" +
        "Win Rate: " + ((totalWins / (totalWins + totalLosses)) * 100).toFixed(1) + "\n" +
        "Highest Win Streak: " + winStreak + "\n" +
        "Highest Loss Streak: " + lossStreak + "\n"       
    )
}

