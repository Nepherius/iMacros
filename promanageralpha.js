/************************Settings************************/
// Accepted Values are True/False/1/0

var buyVip = false; // Buy VIP
var autoStartWork = true; // Find a job and work
var autoDeposit = true; // Deposit the amount required to convert gold and/or upgrade JSC
var upgradeJSC = false;  // Upgrade JSC if possible
var convertGold = true; // Convert JSC Gold
var autoDistributeGold = false; // Distribute converted gold to shareholders
var autoSellToState = true; // Sell products to state if in stock
// Not in use
var replenishStock = false;
var sellStock = false;
var keepInStockMaterials = 200000;
var keepOnSaleMaterials = 100000;
var keepInStockEquip = 2000;
var keepOnSaleEquip = 1000;

/****************End of Settings*****************/

/*** Macros ***/
refreshPage = "CODE:";
refreshPage += "SET !TIMEOUT_PAGE 30" + "\n";
refreshPage += "SET !ERRORIGNORE YES" + "\n";
refreshPage += "SET !TIMEOUT_STEP 2" + "\n";
refreshPage += "URL GOTO=proeconomica.com" + "\n";


/*** JavaScript Functions ***/
function iWait(waitTime) {
	iimPlayCode('WAIT SECONDS =' + waitTime);
}

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
	loadScriptFromURL('https://www.dropbox.com/s/47cj0fqxnsijm2n/jquery-2.2.2.min.js?raw=1');
	$ = window.$,
	JQuery = window.JQuery;
}

function startWork() {
	if (autoStartWork) {
		if ($('#specialBox .btn-blue_dis.go_working_for_a_day').length === 1) {
			iWait(0.25);
			$('#specialBox .goto_piata_muncii').click();
			iWait(1);
			iimPlayCode('TAG POS=1 TYPE=BUTTON ATTR=TXT:Apply');
			iWait(1);
			if ($('.pp_alert_content').length === 1) {
				iimPlayCode('TAG POS=1 TYPE=BUTTON:SUBMIT ATTR=ID:press_cancel');
				iWait(0.25);
				$('.pp_500 .pp_close').click();
			}
		}
		loadJQ();
		$('#specialBox .btn-blue.go_working_for_a_day').click();
		iWait(1);
		loadJQ();
	}
}

function checkVote() { // Check JSC if vote is needed & vote for user
	var compTabs = window.content.document.getElementById('compTabs');
	if (!compTabs) {
		return false;
	}
	var compTabList = compTabs.getElementsByClassName("tabNavigation top_tabs");
	if (compTabList[0].children[0].innerText.match(/voting/gi)) {
		var username = $('.user-name b').text();
		$('#candidatesList').each(function () {
				if ($(this).text().match(username.split(' ')[1])) {
				$(this).find('button').click();
				iWait(0.5);
				$('.pp_alert #sa_popose_accept').click();
				//$('.#press_cancel').click()
				iWait(0.5);
				iimPlayCode('TAG POS=1 TYPE=BUTTON:SUBMIT ATTR=ID:press_cancel');
			}
		});
	}
	return true;
}

function sellToState() { // Sell products to state
	if (autoSellToState) {
		iWait(0.25);
		var prodAvailable = $('.companyBody div[id^=\'products_sell_number_\']').text();
		var stateBuyLimit = $('.companyTopItems .state_limit_tooltip').text();
		if (prodAvailable > 1) {
			if (stateBuyLimit > prodAvailable) {
				$('.companyBox .state_buy').val(prodAvailable);
			} else {
				$('.companyBox .state_buy').val(stateBuyLimit);
			}
			iWait(0.25);
			$(".companyTopItems #sell_to_state").click()
			iimPlayCode('TAG POS=1 TYPE=BUTTON:SUBMIT ATTR=ID:press_cancel')
			//$('.#press_cancel').click()
		}
	}
}

function convertToGold(i) {
	if (convertGold) {
		iWait(0.5)
		if (+$('#compTabs .exchange_amount').text() < ($('#chng_edit_c_tit').next().text().replace('Activities:', '').match(/financiar/gi) ? $('.companyTopItems img[title=\'Money\']').next().text() :  +$('.company_money_amount').text() ) ) {
			$('#compTabs .proTable .sa_gold_convert').click()
			iWait(0.5)
			iimPlayCode("TAG POS=1 TYPE=DIV ATTR=ID:message EXTRACT=TXT");
			if (iimGetExtract().match(/successfully/gi)) {
				goldConverted += Number($('#compTabs .exchange_amount').prev().text())
			}
			iWait(1)
			$('.pp_buttons #press_cancel').click()
			iWait(0.25)
			distributeGold()
		} else {
			if (autoDeposit) {
				if (+$('.user-money .stocks .amount').text() < +$('#compTabs .exchange_amount').text()) {
					errorCode(2)
				} else {
					$('.transfer_money input').val(+$('#compTabs .exchange_amount').text() + 2000)
					iWait(0.25)
					$('.transfer_money .to_pers_juridica').click()
					iWait(1)
					$('.pp_buttons #press_cancel').click()
					iWait(0.25)
					$('#compTabs .proTable .sa_gold_convert').click()
					iWait(0.5)
					iimPlayCode("TAG POS=1 TYPE=DIV ATTR=ID:message EXTRACT=TXT");
					if (iimGetExtract().match(/successfully/gi)) {
						goldConverted += Number($('#compTabs .exchange_amount').prev().text())
					}
					iWait(1)
					$('.pp_buttons #press_cancel').click()
					iWait(0.25)
					distributeGold()
				}
			} else {
				jscLowOnMoney.push(jscList[i])
			}
		}
	}
}

function checkStocks() {
	if (replenishStock) {
		var prodAvailable = $('.companyBody div[id^=\'products_sell_number_\']').text()
		if (prodAvailable > 0 && sellStock) {

		}
	}
}

function distributeGold() { // Distribute all available JSC gold to shareholders
	var goldToDistribute = $('#tab_distributions .companyBody div table + table b').html()
	if (autoDistributeGold && goldToDistribute > 0) {
		$('#tab_distributions .companyBody div .gold_amount').val(goldToDistribute)
		iWait(0.25)
		$('#tab_distributions .companyBody div input').next().click()
		iimPlayCode("TAG POS=1 TYPE=DIV ATTR=ID:message EXTRACT=TXT");
		if (iimGetExtract().match(/successfully/gi)) {
			goldDistributed += Number(goldToDistribute)
		}
		iWait(1)
		$('.pp_buttons #press_cancel').click()
	}
}

function jscUpgrade() {
	if (upgradeJSC) {
		if (!($('.companyLevelUp.protooltip #pro-tooltip-content').text().match(/This is the highest possible level for now/gi))) {
			var userMoney = +$('.user-money .stocks .amount').text()
			var amountRequired = $('.companyLevelUp.protooltip #pro-tooltip-content table tr:nth-child(2)').text().replace(/\D/g,'')
			var amountAvailable = ($('#chng_edit_c_tit').next().text().replace('Activities:', '').match(/financiar/gi) ? $('.companyTopItems img[title=\'Money\']').next().text() :  +$('.company_money_amount').text() )
			if (+amountAvailable > +amountRequired) {
				$('.companyLevelUp.protooltip #pro-tooltip-content').click()
				iWait(1)
				if ($('.pp_alert .confirm_levelup').html().match(/finish/gi)) {
					$('.pp_alert #levelup_confirmed.active.button_85').click()
					iWait(1)
					iimPlayCode('TAG POS=1 TYPE=BUTTON:SUBMIT ATTR=ID:press_cancel')
				} else {
					$('#press_cancel.active.button_85_dis').click()
				}
			} else if (autoDeposit && userMoney > (amountRequired - amountAvailable)) {
				$('.companyLevelUp.protooltip #pro-tooltip-content').click()
				iWait(1)
				if ($('.pp_alert .confirm_levelup').html().match(/finish/gi)) {
					$('.transfer_money input').val(+(amountRequired - amountAvailable) + 10000)
					iWait(0.25)
					$('.transfer_money .to_pers_juridica').click()
					iWait(1)
					$('.pp_buttons #press_cancel').click()
					iWait(1)
					jscUpgrade()
				} else {
					$('#press_cancel.active.button_85_dis').click()
				}

			} else {
				errorCode(3)
			}
		}
	}
}
/*** Error Codes ***/
function errorCode(code) {
	switch(code) {
		case 1 :
			throw Error('Page did not load in time!')
			break;
		case 2 :
			throw Error('Auto Deposit failed, not enough money!')
			break;
		case 3 :
			throw Error('Can\'t upgrade JSC, not enough money!')
			break;
		default :
			throw Error('Something went wrong...')

	iimPlayCode('SET !ERRORIGNORE NO' + '\n' + '!STOP')
	}
}


/*************** Start Script ***************/

//Go to website
iimPlay(refreshPage);

//Main Code
loadJQ();
var jscList = [];
var llcList = []; // not in use
var jscLowOnMoney = []
var goldConverted = 0;
var goldDistributed = 0;

startWork() // Work

var companiesList = $('#companieshomelist').children();
if (companiesList[0].innerText.match(/S.A./gi)) {
	for (var i = 1, j = companiesList.length; i < j; i++) {
		if (companiesList[i].innerText.match(/L.L.C/gi)) {
			break;
		} else {
			jscList.push(companiesList[i].innerText.split('\n')[0])
		}
	}
}

// Get total amount of money in LLC
var totalInLLC = 0;
for (var i = 2 + jscList.length, j = companiesList.length; i < j; i++) {
	totalInLLC += Number(companiesList[i].innerText.split('\n')[1]);
}
iimDisplay('Total Money in LLCs: ' + new Intl.NumberFormat().format(totalInLLC))

for (var i = 0;i < jscList.length;i++) {
	iWait(1)
	// Reload jQuery
	loadJQ()
	companiesList = $('#companieshomelist').children();
	// Access JSC
	companiesList[i+1].click();
	iWait(1.5)
	var retries = 3;
	var success = false;
	while (retries-- > 0 && !(success = checkVote())) {
		iWait(2);
	}
	//Convert & Distribute Gold
	convertToGold(i);
	iWait(1)
	// Upgrade JSC if possible
	jscUpgrade();
	// Stop here if this is a bank, nothing else to do
	if ($('#chng_edit_c_tit').next().text().replace('Activities:', '').match(/financiar/gi)) {
		continue;
	}
	// Sell products to state
	sellToState();
}

/*************** Display Results ***************/

iimDisplay('Gold Converted: ' + goldConverted + '\n' + 'Gold Distributed: ' + goldDistributed + '\nTotal Money in LLCs: ' + new Intl.NumberFormat().format(totalInLLC))
