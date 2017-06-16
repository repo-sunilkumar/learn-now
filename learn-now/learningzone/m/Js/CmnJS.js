function SaveInLocalStorage(key, val)
{
    if (typeof (localStorage) != 'undefined')
    {
        var obj = { dt: new Date().getDate(), res: val }
        window.localStorage.setItem("'" + key + "'", JSON.stringify(obj));
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

    var obj = JSON.parse(val);
    if (obj.dt != new Date().getDate())
        return defaultvalue == undefined ? "" : defaultvalue;
    else
        return obj.res;

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

var UserPosition = null;
function GetCurrentLocation(callback) {
    if (navigator && navigator.geolocation)
        navigator.geolocation.getCurrentPosition(function (position) { geo_success(position, callback); }, geo_error);
    else
        error('Geolocation is not supported.');
}

function geo_success(position, callback)
{
    var CURRENT_GPS_LAT = position.coords.latitude;
    var CURRENT_GPS_LNG = position.coords.longitude;

    UserPosition = { Lat: CURRENT_GPS_LAT, Lng: CURRENT_GPS_LNG };
    if (callback != undefined)
        callback(UserPosition);
}

function geo_error(err) {
    if (err.code == 1) {
        error('The user denied the request for location information.')
    } else if (err.code == 2) {
        error('Your location information is unavailable.')
    } else if (err.code == 3) {
        error('The request to get your location timed out.')
    } else {
        error('An unknown error occurred while requesting your location.')
    }
}

function error(msg)
{
   // alert(msg);
}

function GetDistance(lat1, lng1, lat2, lng2) {
    if (lat2 == "0" || lng2 == "0") return 0;
    if (typeof (Number.prototype.toRad) === "undefined") { Number.prototype.toRad = function () { return this * Math.PI / 180; } }
    var R = 6371; // km
    var dLat = (parseFloat(lat2) - parseFloat(lat1)).toRad();
    var dLon = (parseFloat(lng2) - parseFloat(lng1)).toRad();
    var lat1 = parseFloat(lat1).toRad();
    var lat2 = parseFloat(lat2).toRad();
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

function CheckCacheUpdate() {
    window.applicationCache.addEventListener('updateready', function () {
        window.applicationCache.swapCache();
        window.location.reload();
    });
}

function DelayedLoadJS(src, callback)
{
    var scriptElem = document.createElement('script');
    scriptElem.setAttribute('src', src);
    scriptElem.setAttribute('type', 'text/javascript');
    document.getElementsByTagName('head')[0].appendChild(scriptElem);
    console.log("added");
    //if (callback != undefined)
    //    callback();
}

function ValidateEmail(inputText) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return inputText.match(mailformat);
}
﻿/// <reference path="../../Js/social.js" />
var _msg = null;
var map;
var CMD_HOME = 0
, CMD_SEARCH = 1
, CMD_HISTORY = 2
, CMD_SEARCH_IN_SITE = 3
, CMD_SHOW_SEL_QUES = 4
, CMD_ALERT = 5
, CMD_CHILD = 6
, CMD_LASTVISIT=7;

var M = new Mobile();
function Mobile() {
    this.SelectedQuestionID = 0;
    this.CurrentCommand = 0;
    this.ParentID = 1;
    this.ParentName = "";
    this.ChildID = 1;
    this.PageNo = 1;
    this.Lang = 0;
    this.SelectedQuestion = "";
    this.DefaultEmailID = "";
}

Mobile.prototype.Save = function () { SaveInLS(this); }
Mobile.prototype.Load = function () { LoadFromLS(this); }
function SaveInLS(a) {
    for (var c in a)
        if (a[c] != null)
            (typeof a[c]).toString() != "function" && SaveInLocalStorage(c, JSON.stringify(a[c]));
        else RemoveFromLocalStorage(c)
}
function LoadFromLS(a) {

    for (var c in a) {
        var d = LoadFromLocalStorage(c); if (d != "undefined" && d != "null" && d != null && d != undefined)
            if ((typeof a[c]).toString() != "function")
                a[c] = d == "" ? d : JSON.parse(d);
    }
}

function RunCommand(ID) {
    if (ID) { M.CurrentCommand = ID; M.Save(); }

    switch (M.CurrentCommand) {
        case CMD_HOME: $.mobile.changePage("#divHome"); break;
        case CMD_CHILD: $.mobile.changePage("#divChild"); break;
        case CMD_SEARCH: $.mobile.changePage("#divQuesListPage"); break;
        case CMD_HISTORY: $.mobile.changePage("#divFavouriteListPage"); break;
        case CMD_SEARCH_IN_SITE: $.mobile.changePage("#divSearch"); break;
        case CMD_SHOW_SEL_QUES: $.mobile.changePage("#divSelectedQuestionPage"); break;
        case CMD_LASTVISIT: $.mobile.changePage("#divLastVisit"); break;
            
    }
    return false;
}

var IsPostBack = false;
function ChangePage(divID) {
    $(".dtl").hide();
    $("#" + divID).show();
}
$(document).ready(function () {
    //$("#divHome1").hide();
});
$(document).bind('pagechange', function (event, data) {
    M.Load();
    var toPageId = data.toPage.attr("id");
    //    console.log("pagechange-" + toPageId + "-" + M.CurrentCommand);
    switch (toPageId) {
        case "divHome":
            if (IsPostBack)
            {
                M.Lang = 0;
                M.PageNo = 0;
                M.Save();
            }
            else
                IsPostBack = true;
            ChangePage("divHome");
            M.CurrentCommand = CMD_HOME; M.Save();
            FillLanguages();
            break;
        case "divChild": ChangePage("divChild"); GetChild(); break;
        case "divQuesListPage": ChangePage("divQuesListPage"); GetQuestions(); break;
        case "divFavouriteListPage": ChangePage("divFavouriteListPage"); ShowHistory(); break;
        case "divSearch": ChangePage("divSearch"); Search(); break;
        case "divLastVisit": ChangePage("divLastVisit"); ShowLastVisitMessage(); break;
        case "divSelectedQuestionPage": ChangePage("divSelectedQuestionPage"); ShowSelectedQuestion(); break;
            
            
    }
});

$(document).bind('pageinit', function (event, data) {
    $.mobile.defaultPageTransition = "none";
});

function GetData(url, callback) {
    $.ajax({
        url: "http://infonexus.in/learningzone/query.ashx?Action=" + url,
        success: callback
    });
}

function SearchFor(val) {
    $("#divSearch").trigger("refresh");
    M.ReqFor = val;
    M.Save();
    RunCommand(CMD_SEARCH_ROUTE);
}

function FillLanguages()
{   
    $("#divHome").show();
    $("#divBlank").hide();

    if (M.Lang != 0 && M.PageNo != 0)
    {
        ShowLastVisitMessage();
        $("#imgLogo").attr('src', '/Images/learningzone_logo_mob_1.png');
        return;
    }
    
    $("#divDefault").hide();
    var topics = JSON.parse(LoadFromLocalStorage("tp", "[]"));

    if (topics.length == 0)
    {
        $("#divBlank").show();
        var h = $(window).height();
        $("#divBlank").css({ 'height': h - 10 });
        $(".emp").css({ 'height': (h / 2) - 160 });

        GetData("topics", function (data) {
            SaveInLocalStorage("tp", data);
            DisplayTopics(JSON.parse(data));
        })
    }
    else
        DisplayTopics(topics);
}

function ShowLastVisitMessage()
{
    var str = [""];
    str[str.length] = "<br/><table class='tbl'><tr><td class='tdl'><span><a id='aGoLast'  href='#' style='color:white'>Goto Last Visited Page</span></a></span></td></td></tr></table>";
    str[str.length] = "<br/><table><tr><td style='text-align:center'><div class='round'>OR</div></table>";
    str[str.length] = "<table class='tbl'><tr><td class='tdl' style='background-color: #40B149!important; border-color: #40B149!important'><a id='aGoHome'  href='#' style='color:white'>Goto Home Page</a></td></tr></table>";
    
    $("#divLastVisitInfo").html(str.join(''));
    $("#divLastVisitInfo").show();
    $("#divHomeInfo").hide();

    $("#aGoHome").bind('click', function ()
    {
        M.Lang = 0;
        M.PageNo = 0;
        M.Save();
        RunCommand(CMD_HOME);
    });

    $("#aGoLast").bind('click', function () {
        ShowAnswer(M.ParentName, M.Lang, M.PageNo);
    });
}

function DisplayTopics(topics)
{
    $("#divBlank").hide();
    $("#divDefault").show();
    $("#divLastVisitInfo").hide();
    $("#divHomeInfo").show();

    HideProcessingMessage();
    var str = ["<table class='tbl'>"];
    $(topics).each(function () {
        str[str.length] = "<tr><td class='tdl'>" + this.name.substr(0, 1) + "</td><td class='tdr'><a  href='#' onclick='ShowChild(\"" + this.name + "\"," + this.id + ")'>" +
                                "<span>" + this.name + "</span>" +
                            "</a></td></tr>";
    });

    str[str.length] = "<tr><td class='tdl'>S</td><td class='tdr'><a  href='#' onclick='RunCommand(CMD_SEARCH_IN_SITE)'><span>Search in site</span>" +
                            "</a></td></tr>";

    str[str.length] = "</table>";
    $("#divLanguages").html(str.join(''));
    $("#divHome").trigger("create");

    $("#imgLogo").attr('src', '/Images/learningzone_logo_mob_1.png');

    ShowHistory();
    //    ShowSocialButtons();
}

function ShowSocialButtons() {
    var str = [""];
    str[str.length] = "<div class='ui-grid-a'>";
    str[str.length] = "<div class='ui-block-a'>" + Build_Social_Button(FB_Share, "http://infonexus.in/mobile") + "</div>" +
                      "<div class='ui-block-b'>" + Build_Social_Button(Twitter_Share, "http://infonexus.in/mobile") + "</div>" +
                      "</div>";

    $("#divSocial").html(str.join(''));
}

function ShowChild(parentname, parentid)
{
    M.ParentID = parentid;
    M.ParentName = parentname;
    M.Save();
    RunCommand(CMD_CHILD);
}

function GetChild() {
    $("#divChildList").html("<div style='padding:10px;background-color:#eee; margin-top:10px;color:rgb(151, 38, 38)'>Loading options, please wait..</div>");
    ShowProcessingMessage();
    var child = JSON.parse(LoadFromLocalStorage("ch_" + M.ParentID, "[]"));
    if (child.length == 0) {
        GetData("child&Data1=" + M.ParentID, function (data) {
            SaveInLocalStorage("ch_" + M.ParentID, data);
            DisplayChild(JSON.parse(data));
        })
    }
    else
        DisplayChild(child);
}

function DisplayChild(child) {
    HideProcessingMessage();
    AddPageTitle(M.ParentName);
    var str = ["<table class='tbl'>"];
    $(child).each(function () {
        str[str.length] = "<tr><td class='tdl'>" + this.name.substr(0, 1) + "</td><td class='tdr'><a  href='#' onclick='ShowAnswer(\"" + this.name + "\"," + this.id + ",1)'>" +
                                "<span>" + this.name + "</span>" +
                            "</a></td></tr>";
    });
    str[str.length] = "</table>";
    $("#divChildList").html(str.join(''));
    $("#divChild").trigger("create");
}



function ShowAnswer(TopicName, TopicID, PageNo) {

    M.Lang = TopicID;
    M.ParentName = TopicName;
    M.PageNo = PageNo;
    M.Save();
    RunCommand(CMD_SEARCH);
}

function GetQuestions() {
    ShowProcessingMessage();
    $("#divQuesList").html("");
    M.Load();

    var historyIndex = GetFromHistoryList(M.Lang, M.PageNo);
    if (historyIndex == -1)
        GetData("GetQuestions&Data1=" + M.Lang + "&Data2=" + M.PageNo, function (data) {
            ShowQuestions(data);
            AddToHistoryList(M.Lang, M.PageNo, data);
        });
    else
        ShowQuestions(HistoryList[historyIndex].Data);
}

function GetLanguage(id) {
    for (var i = 0; i < Languages.length; i++) {
        if (Languages[i].ID == id)
            return Languages[i].Name.replace(/\_/g, ' ');
    }
    return "";
}

var Result = [];
function ShowQuestions(data) {
    HideProcessingMessage();
    if (data == "")
        return;
    var obj = JSON.parse(data);
    Result = obj;
    AddPageTitle(M.ParentName + " (" + M.PageNo + ")");
    var str = [""];
    str[str.length] = "<div class='ui-grid-a'>";
    str[str.length] = "<div class='ui-block-a'><a href='#' data-role='button' data-icon='bars' onclick='RunCommand(CMD_HISTORY)' data-corners='false' class='c'><span class='hidden-phone'>My List</span></a></div>" +
                      "<div class='ui-block-b'><a href='#' data-role='button'  data-icon='search' onclick='RunCommand(CMD_SEARCH_IN_SITE)' data-corners='false' class='c' ><span class='hidden-phone'>Search</span></a></div>" +
                      "</div>";

    $(obj).each(function (index) {
        if (this.t == 0)
            str[str.length] = SubjectiveTxt(index, this);
        else
            str[str.length] = MultiChoiceTxt(index, this);
    });

    str[str.length] = "<div class='ui-grid-a'>" +
                            "<div class='ui-block-a'><a href='#' " + (M.PageNo > 1 ? "style='background-color:#9B9797'" : "class='ui-disabled'") + " data-role='button' data-theme='b' onclick='ShowAnswer(\"" + M.ParentName + "\"," + M.Lang + "," + (M.PageNo - 1) + ")'>Prev</a></div>" +
                            //"<div class='ui-block-b'><a href='#' data-role='button'   data-theme='a' onclick='SendEmail()'>Email</a></div>" +
                            "<div class='ui-block-b'><a href='#' data-role='button' data-theme='b' onclick='ShowAnswer(\"" + M.ParentName + "\"," + M.Lang + "," + (M.PageNo + 1) + ")'>Next</a></div>" +
                      "</div>";
    $("#divQuesList").html(str.join(''));
    $("#divQuesList").trigger("create");
    AddClientOptions();
}

function SubjectiveTxt(index, ques) {

    var str = [""];
    str[str.length] = "<div class='mya'>";
    str[str.length] = "<p class='q'>" + (index + 1) + ". " + ques.q + "</p>";
    str[str.length] = "<div class='an'>" + ques.a + "</div>";
    str[str.length] = "<div data-id='" + index + "' class='qa'></div>";
    str[str.length] = "</div>";
    return str.join('');

}

function MultiChoiceTxt(index, ques) {

    var str = [""];
    str[str.length] = "<div class='mya'>";
    str[str.length] = "<p class='q'>" + (index + 1) + ". " + ques.q + "</p>";
    str[str.length] = "<div class='an'>";

    str[str.length] = "<ol class='olopt'>";
    str[str.length] = "<li>" + ques.op1;
    str[str.length] = "<li>" + ques.op2;
    str[str.length] = "<li>" + ques.op3;

    if (ques.op4 != "")
        str[str.length] = "<li>" + ques.op4;

    if (ques.op5 != "")
        str[str.length] = "<li>" + ques.op5;

    str[str.length] = "</ol>";
    str[str.length] = "<div class='oa'><span class='oas'>Answer : </span><span class='oam'>" + ques.a + "</span></div>";
    str[str.length] = "</div>";
    str[str.length] = "<div data-id='" + index + "' class='qa'></div>";
    str[str.length] = "</div>";
    return str.join('');

}

function AddPageTitle(title) {
    $(".lblHeader").text(title);
}

String.prototype.startsWith = function (str) {
    return (this.substr(0, str.length) == str);
}

function NoData(data) {
    if (data == undefined)
        return true;

    if (data.length == 0)
        return true;
}

function ShowProcessingMessage() {
    $.mobile.loading("show", {
        text: "Loading..",
        textVisible: true,
        theme: "a",
        textonly: false,
        html: ""
    });
}

function HideProcessingMessage() {
    $.mobile.loading("hide");
}
var _alerttimer = null;
function ShowAlert() {
    if (_alerttimer != null) window.clearTimeout(_alerttimer);

    if (_msg != null) {
        $(".lblHeader").text(_msg.header);
        $("#divMsg").html(_msg.msg);
    }

    _alerttimer = window.setTimeout(function () {
        $('.ui-dialog').dialog('close');
    }, 3000);
}

var FavList = [];
function SaveFavList() { SaveInLocalStorage("Favs", JSON.stringify(FavList)); ShowFav(); }

function FoundIndexInFav(QID) {
    var History = JSON.parse(LoadFromLocalStorage("L_History", "[]"));
    for (var i = 0; i < History.length; i++) {
        if (History[i].id == Result[QID].id && History[i].t == Result[QID].t)
            return i;
    }
    return -1;
}
function RemoveFromFav(index) {
    ShowPopup("Removed from Favorite list");
    index == -1 ? FavList.length = 0 : FavList.splice(index, 1);
    SaveFavList();
    AddClientOptions();

    return false;
}
function AddClientOptions() {
    var divName = "divQuesList";
    switch (M.CurrentCommand) {
        case CMD_SHOW_SEL_QUES:
        case CMD_SEARCH_IN_SITE: divName = "divSelectedQuestion";
    }


    $(".qa", $("#" + divName)).each(function () {
        var id = $(this).data("id");
        favindex = FoundIndexInFav(id);
        if (favindex == -1)
            $(this).html("<a href='#' class='qadd add'  data-id='" + id + "' >Add</a>");
        else
            $(this).html("<a href='#' class='qadd rem' data-id='" + favindex + "' >Remove</a>");


        //if (favindex == -1)
        //    $(this).html("<a href='#' data-corners='false' class='qadd add' data-role='button' data-icon='plus' data-iconpos='notext' data-theme='c' data-inline='true' data-id='" + id + "'  >Plus</a>");
        //else
        //    $(this).html("<a href='#' data-corners='false' class='qadd rem' data-role='button' data-icon='minus' data-iconpos='notext' data-theme='c' data-inline='true' data-id='" + favindex + "' >Minus</a>");
    });

    $("#" + divName).trigger("create");

    $("#" + divName + " .add").bind("click", function () {
        var id = $(this).data("id");
        var obj = Result[id];
        AddToFavourites(obj);
        AddClientOptions();
    });

    $("#" + divName + " .rem").bind("click", function () {
        var id = $(this).data("id");
        RemoveFavourite(id);
        AddClientOptions();
    });

}

function ShowPopup(Msg) {
    $("#popupMenu").show();
    $("#popupMenu").popup();

    $("#popupContent").text(Msg);
    $("#popupMenu").trigger('create');
    $("#popupContent").show();
    $("#popupMenu").popup("open");
    setTimeout(function () { $("#popupMenu").popup("close"); }, 2000);
}

var History = [];
function ShowHistory() {
    AddPageTitle("Topics");
    History = JSON.parse(LoadFromLocalStorage("L_History", "[]"));

    var str = [""]; //<div class='infobox'>Click on question to view answer</div>

    if (History.length == 0) {
        str[str.length] = "<div class='mya'>";
        str[str.length] = "<p class='q'>No record in history</p>";
        str[str.length] = "<div class='an'>Please view questions and add them to your favorite list</div>";
        str[str.length] = "</div>";
        $("#divFavouriteList").html(str.join(''));
        $("#divFavouriteList").trigger("create");
        $("#HistoryOnMainPage").html("");
        return;
    }

    str[str.length] = "<h3 class='ml'>My List</h3>";

    var rtctr = 0;
    $(History).each(function (i) {
        var Add = true;

        if (i > 4 && M.CurrentCommand == CMD_HOME)
            Add = false;

        if (Add) {
            ++rtctr;

            str[str.length] = "<div class='mya'>";
            str[str.length] = "<h2 class='al cur-pointer' data-index='" + i + "'><table><tr><td><b>" + this.q + "</b></td><td style='width:10px'><a href='#' class='qadd1 rem' onclick='RemoveFavourite(" + i + ")'>Del</a></td></table></h2>";


            if (this.t == 0)
                str[str.length] = "<div class='an' id='an_" + i + "' style='display:none'>" + this.a + "</div>";

            else {
                str[str.length] = "<div class='an' id='an_" + i + "' style='display:none'>";
                str[str.length] = "<ol class='olopt'>";
                str[str.length] = "<li>" + this.op1;
                str[str.length] = "<li>" + this.op2;
                str[str.length] = "<li>" + this.op3;

                if (this.op4 != "") str[str.length] = "<li>" + this.op4;
                if (this.op5 != "") str[str.length] = "<li>" + this.op5;

                str[str.length] = "</ol>";

                str[str.length] = "<br/>Answer : <b>" + this.a + "</b></div>";
            }
            str[str.length] = "</div>";

            str[str.length] = "";
        }
    });

    var divName = "divFavouriteList";
    if (M.CurrentCommand == CMD_HOME) {
        if (History.length > 5)
            str[str.length] = "<a class='lim' href='#' onclick='RunCommand(CMD_HISTORY)'><h2>View " + (History.length - 5) + " More</h2></a>";
        divName = "HistoryOnMainPage";
    }
    else {
        AddPageTitle("My List");
        //str[str.length] = "<a href='#' data-role='button' class='lim' style='padding:0.7em 1em !important' onclick='SendEmail()'>Email</a>";
    }

    $("#" + divName).html(str.join(''));

    $("#" + divName + " .al").bind('click', function () {
        var i = $(this).data("index");
        $("#an_" + i).toggle();
    });

    $("#" + divName).trigger("create");
}

function RemoveFavourite(index) {
    History.splice(index, 1);
    SaveInLocalStorage("L_History", JSON.stringify(History));
    History = JSON.parse(LoadFromLocalStorage("L_History", "[]"));
    if (M.CurrentCommand == CMD_HOME)
        ShowHistory();
    else if (M.CurrentCommand == CMD_HISTORY)
        RunCommand(CMD_HISTORY);
    //else
    //    ShowPopup("Removed from Favorite list");
}

function AddToFavourites(obj) {
    var historyindex = GetFromHistory(obj.id, obj.t);
    if (historyindex == -1) {
        History[History.length] = obj;
        SaveInLocalStorage("L_History", JSON.stringify(History));
        History = JSON.parse(LoadFromLocalStorage("L_History", "[]"));
    }
    //ShowPopup("Added to 'My List'");
}

var HistoryList = [];
function AddToHistoryList(langid, pageno, data) {
    var FoundIndex = GetFromHistoryList(langid, pageno);
    if (FoundIndex == -1) {
        if (HistoryList.length == 50)
            HistoryList.splice(1, 9);

        HistoryList[HistoryList.length] = { LangID: langid, PageNo: pageno, Data: data };
        SaveInLocalStorage("L_HistoryList", JSON.stringify(HistoryList));
        HistoryList = JSON.parse(LoadFromLocalStorage("L_HistoryList", "[]"));
    }
}
function GetFromHistoryList(langid, pageNo) {
    for (var i = 0; i < HistoryList.length; i++) {
        if (HistoryList[i].LangID == langid && HistoryList[i].PageNo == pageNo)
            return i;
    }
    return -1;
}

function GetFromHistory(id, type) {
    for (var i = 0; i < History.length; i++) {
        if (History[i].id == id && History[i].t == type)
            return i;
    }
    return -1;
}

function GetSelectedQuestion() {
    AddPageTitle("Searched Question");
    M.Load();
    var historyIndex = GetFromHistory(M.SelectedQuestion);
    if (historyIndex == -1)
        GetData("http://infonexus.in/learningzone/query.ashx?Action=GetSelectedQuestion&Data1=" + M.SelectedQuestion, function (data) {
            data = NoData(data) ? "[]" : data;
            var obj = JSON.parse(data);
            ShowSelectedQuestion(obj);
            //AddToFavourites(obj.Language, obj.ID, obj.Question, obj.Answer);
        });
    else
        ShowQuestions(JSON.parse(HistoryList[historyIndex].Data));
}

function ShowSelectedQuestion(obj) {
    Result[0] = obj;

    var str = [""];
    str[str.length] = "<ul data-role='listview' data-inset='true' >";
    str[str.length] = "<li class='q' data-role='list-divider'>1. " + obj.Question + "<span data-id='0' class='qa'></span></li>";
    str[str.length] = "<li data-theme='a' data-icon='false' ><a href='#' ><p>" + obj.Answer + "</p></a></li>";
    str[str.length] = "</ul>";
    $("#divSelectedQuestion").html(str.join(''));
    $("#divSelectedQuestion").trigger("create");
    AddClientOptions();
}

function SendEmail() {

    var ids = "";
    if (M.CurrentCommand == CMD_HISTORY) {
        $(History).each(function () {
            ids += this.ID + "-0^";
        });
    }
    else {
        $(Result).each(function () {
            ids += this.ID + "-0^";
        });
    }

    var str = "<span style='color:white'>eMail this page</span><br/><input type='text' id='txtTo' placeholder='email id' />";
    str += "<a href='#' data-role='button' data-icon='arrow-r' data-iconpos='right' data-inline='true' data-theme='b' id='btnsendmail'>Send</a>";
    str += "<br/><span style='color:white' id='msg'></span>";
    $("#popupMenu").popup();
    $("#popupContent").html(str);
    $("#txtTo").val(M.DefaultEmailID);
    $("#popupContent").show();
    $("#popupMenu").show();
    $("#popupMenu").popup("open");
    $("#popupMenu").trigger("create");
    $("#popupContent #btnsendmail").bind('click', function () {
        var ToAddress = $("#txtTo").val();
        if (ToAddress == "" || !ValidateEmail(ToAddress)) {
            $("#popupContent #msg").text("Please enter a valid email ID.");
            return;
        }

        $.post("http://infonexus.in/learningzone/query.ashx?Action=SM",
        {
            To: ToAddress,
            Data: ids
        },
        function (data) { });


        $("#popupContent #msg").text("Mail sent, please check your inbox/spam");
        setTimeout(function () { $("#popupMenu").popup("close"); }, 2000);
        M.DefaultEmailID = $("#txtTo").val();
        M.Save();
    });
}

function Search()
{
    $("#divSearch").trigger('create');
    $("#txtSearch").focus();
    $("#btnsearch").bind('click', function () {
        var val = $("#txtSearch").val().trim();
        if (val == "") {
            $("#divSearchResult").html("enter some text to search");
            return;
        }

        ShowProcessingMessage();
        GetData("Search&Data1=" + val, function (data) {

            HideProcessingMessage();

            var str = [""];
            str[str.length] = "<h3 class='ml'>Search Result</h3>";

            if (data == "[]") {
                str[str.length] = "<div class='mya'>";
                str[str.length] = "<p class='q'>No Results found</p>";
                str[str.length] = "</div>";
            }
            else {
                var obj = JSON.parse(data);
                $(obj).each(function (i) {
                    str[str.length] = "<div class='mya'>";
                    str[str.length] = "<p class='q' data-index='" + i + "'>" + this.q + "</p>";
                    str[str.length] = "</div>";
                });
            }

            $("#divSearchResult").html(str.join(''));
            $("#divSearchResult").trigger('create');
            if (data != "[]")
                $("#divSearchResult .q").bind('click', function () {
                    var indx = $(this).data("index");
                    var obj1 = obj[indx];

                    M.SelectedQuestionID = obj1.id;
                    M.Lang = obj1.l;
                    M.Save();
                    RunCommand(CMD_SHOW_SEL_QUES);
                });
        });
    });

}

function ShowSelectedQuestion()
{   
    var id = M.SelectedQuestionID, lang = M.Lang;
    AddPageTitle("Selected Questions");
    ShowProcessingMessage();
    GetData("GetSelectedQuestion&Data1=" + id + "&Data2=" + lang, function (data) {
        if (NoData(data))
        {
            $("#divSelectedQuestion").html("No result found");
            return;
        }

        HideProcessingMessage();
        var ques = JSON.parse(data);
        Result[0] = ques;

        var str = [""];
        str[str.length] = ques.t == 0 ? SubjectiveTxt(0, ques) : MultiChoiceTxt(0, ques);

        str[str.length] = "<br/><a href='#' data-role='button' id='btnAllCat' onclick='ShowAnswer(\"" + ques.n + "\"," + ques.l + ",1)' data-corners='false' class='c btn-block'>All questions in this category</a>";

        $("#divSelectedQuestion").html(str.join(''));
        $("#divSelectedQuestion").trigger('create');
        AddClientOptions();
    });
}