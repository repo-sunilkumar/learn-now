$.fn.serializeObject = function () {
    var o = {};
    $("input,select,checkbox,password,radio,textarea,input:hidden", this).each(function () {
        var id = $(this).attr("id");
        var val = $.trim($(this).val())
        if (this.type == 'checkbox' || this.type == 'radio')
            if (!this.checked)
                val = "0";

        o[id] = val;
    });
    return o;
};

function htmlEncode(value) { return $('<div/>').text(value).html(); }
function htmlDecode(value) { return $('<div/>').html(value).text(); }


function ShowWait() {
    var str = "<br><table cellpadding='0' cellspacing='0' width='100%' >";
    str += "<tr><td>&nbsp;<tr><td colspan='4' align='center'><img src='Images/progress.gif' alt='progress'>";
    str += "<tr align='center'><td colspan='4' ><b>Processing request, please wait......";
    str += "</table>";
    $("#divWait").html(str);
    $("#divWait").dialog('open')
    $("#divWait").dialog("option", { title: 'Processing...', position: "center" }); // call it after dialoag has been opened
}

function EndWait() {
    $("#divWait").dialog('close')
}

function SaveInLocalStorage(key, val) {
    if (typeof (localStorage) != 'undefined') {
        window.localStorage.removeItem("'" + key + "'");
        window.localStorage.setItem("'" + key + "'", val);
        return true;
    }
    else {
        alert("Your browser does not support local storage, please upgrade to latest browser");
        return false;
    }
}

function LoadFromLocalStorage(key, defaultvalue) {
    var val = window.localStorage.getItem("'" + key + "'");
    if (val == null)
        return defaultvalue == undefined ? "" : defaultvalue;

    return val;
}

function RemoveFromLocalStorage(key) {
    window.localStorage.removeItem("'" + key + "'");
}

function ClearLocalStoreage() {
    if (typeof (window.localStorage) != 'undefined') {
        window.localStorage.clear();
    }
    else {
        throw "window.localStorage, not defined";
    }
}

function CheckCacheUpdate()
{
    window.applicationCache.addEventListener('updateready', function ()
    {
        window.applicationCache.swapCache();
        window.location.reload();
    });
}

function isNumberKey(evt)//for stopping the character value in integer textboxes
{
    var charCode = (evt.which) ? evt.which : event.keyCode
    
    switch (charCode)
    {
        case 8:
        case 9:
        case 27:
        case 32:
        case 37:
        case 39:
            return true;
    }

    if (charCode > 31
        && (charCode < 48 || charCode > 57)
        && (charCode < 96 || charCode > 105)) //For Numeric Keypad
        return false;

    return true;
}

function isAlphabet(evt)
{
    var charCode = (evt.which) ? evt.which : event.keyCode
    switch (charCode)
    {
        case 8:
        case 9:
        case 27:
        case 32:
        case 37:
        case 39:
            return true;
    }
    return charCode >= 65 && charCode <= 90;
}

function ShowProcessing()
{
    if (typeof ClearMap == 'function')
        ClearMap();

    var h = $(window).height();
    var w = $(window).width();

    $("#divProcessingMessage").show();
    $("#divProcessingMessage").css({ 'top': (h / 2) - 50, 'left': (w / 2) - 50 });

}

function HideProcessing()
{
    $("#divProcessingMessage").hide();
}


String.prototype.toProperCase = function()
{
    return this.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};
