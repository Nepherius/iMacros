/*jshint esversion: 6 */

// Load Jquery
function loadJQ() {
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

/*********** Macros ***********/

var gameLogin = "CODE:";
gameLogin += "SET !TIMEOUT_PAGE 30" + "\n";
gameLogin += "SET !ERRORIGNORE YES" + "\n";
gameLogin += "SET !TIMEOUT_STEP 2" + "\n";
gameLogin += "URL GOTO=https://dohclassic.com/Login.aspx" + "\n";


/*********** Settings EDIT BELOW ***********/
//Set character name
var charName = 'Bob';

// Set Heal Name or name of special attack to regain hp
// By default it's called when under 30% HP
var healName = 'Healing Salve';

//Set Attack Name if you only have Attack!, set it to Attack!
var regularAttack = 'Eagle strike';

/*********** DON'T EDIT BEYOND HERE UNLESS YOU KNOW HAT YOU ARE DOING ***********/

/*********** Main Loop ***********/
while (1) {
    //loadJQ() has to be called after each page reload
    loadJQ();

    autoLogIn();
    loadJQ();

    checkHp();

    collectLoot();

    sellToHobo();
    // wait a while, no reason to run script every second ...
    iWait(30);
}




/*********** Functions ***********/

function iWait(waitTime) {
    iimPlayCode('WAIT SECONDS =' + waitTime);
}

function autoLogIn() {
    if (window.location.href !== 'https://dohclassic.com/Game.aspx') {
        iimPlay(gameLogin);
        iWait(2);
        loadJQ();
        iimPlayCode('EVENT TYPE=CLICK SELECTOR="#ctl00_Column2_PlayerLogin1_Button1" BUTTON=0');
        iWait(3);
        loadJQ();
        $('.toon-details span:contains(' + charName + ')').click();
        iWait(5);
        iimPlayCode('EVENT TYPE=CLICK SELECTOR="#imgFindPvE" BUTTON=0');
    }
}

function checkHp() {
    let currentHp = $('#statListStatic #hp').text();
    let maxHp = $('#statListStatic #hpMax').text();
    let currentAction = $('#divPvECurrentAction').text();
    // If current hp percent is below 30% activate heal else default attack
    if (currentHp / maxHp * 100 < 30 && currentAction.split(': ')[1] !== healName) {
        $('#divPvEActions a:contains(' + healName + ')').click();
    } else if (currentAction.split(': ')[1] !== regularAttack) {
        $('#divPvEActions a:contains(' + regularAttack + ')').click();
    }
}

function collectLoot() {
    if ($('#GameInfoWrapper .iETC .button').text().length >= 1) {
        $('#GameInfoWrapper .iETC .button').click();
    }
}

function sellToHobo() {
    let inventoryCount = $('#InvCount').text().split(' / ');
    iimPlayCode('EVENT TYPE=CLICK SELECTOR="#tblTabs>TBODY>TR>TD:nth-of-type(4)" BUTTON=0');
    iWait(2);
    if (inventoryCount[0] >= 15) {
        //Switch to inventory tab
        iimPlayCode('EVENT TYPE=CLICK SELECTOR="#tblTabs>TBODY>TR>TD:nth-of-type(4)" BUTTON=0');
        iWait(2);
        /* jQuery doesn't work most of the time so using event click instead */
        //$('#tblTabs a[title="Show Inventory Tab"]').click();
        // Select all inventory & mule
        //iimPlayCode('EVENT TYPE=CLICK SELECTOR="#imgToggleInv" BUTTON=0');
        //iWait(0.5);
        //  iimPlayCode('EVENT TYPE=CLICK SELECTOR="#imgToggleMule" BUTTON=0');
        $('#imgToggleInv').click();
        $('#imgToggleMule').click();

        //Sell
        $('#lnkMassHoboSellItemsFromI').click();
        $('#lnkMassHoboSellItemsFromM').click();
    }
}
