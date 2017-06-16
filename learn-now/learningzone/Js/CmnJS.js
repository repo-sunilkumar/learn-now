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

function CheckCacheUpdate() {
    window.applicationCache.addEventListener('updateready', function () {
        window.applicationCache.swapCache();
        window.location.reload();
    });
}

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};

function AddWhatsAppContent() {
    var w = $(window).width();
    //if (w > 500)
    //    return;

    if ($("#ques_type").text() == "0") {
        $(".divData table.tblQuesList").each(function (index) {
            $("#wa_" + $(".answerbox", $(this)).data("id")).html("<a class='btn btn-xs' href='whatsapp://send?text=" + $(".ques", $(this)).text() + ", Answer : " + $(".answerbox", $(this)).text() + " (via - http://www.infonexus.in)'><img src='/images/wa.jpg' /></a></span>");
        });
    }
    else {
        $(".divData table.tblQuesList").each(function (index)
        {   
            $("#wa_" + $(".answerbox", $(this)).data("id")).html("<a class='btn btn-xs' href='whatsapp://send?text=" + $(".ques", $(this)).text() + ", Options : " + $(".ulans", $(this)).text() + ", Answer : " + $(".objans", $(this)).text() + " (via - http://www.infonexus.in)'><img src='/images/wa.jpg' /></a></span>");
        });
    }
}

$(window).bind('load', function ()
{   
    if (queslist == true)
    {
        AddWhatsAppContent();

        //$("#ad_lb").html(
        //     CreateAdBlocks(Ad_Amazon_LeaderBoad, $("#ad_lb").parent().width()) + "<br/>" +
        //     CreateAdBlocks(Ad_Chitika, $("#ad_lb").parent().width())
        //    );

        //console.log(CreateAdBlocks(Ad_Amazon_LeaderBoad, $("#ad_sq").parent().width()));

        //$("#ad_sq").html(CreateAdBlocks(Ad_Amazon_LeaderBoad, $("#ad_sq").parent().width()));
    }
});

$(document).ready(function () {
    //$(".cartbox").show();
    $(".tt").tooltip();
    $("#btnSendEmail").hide();
    ShowFav();
    AddClientOptions();
});

function GetPlainText(ReqFor) {
    var str = ["<table style='width:100%;text-align:justify;'>"];
    if (ReqFor == "All") {
        $(".divData table.tblQuesList").each(function (index) {
            str[str.length] = "<tr>" +
                    "<td>" +
                            "<b>Ques : </b>" + $(".ques", $(this)).text() + "<br/>" +
                            ($("#ques_type").text() == "0" ? "" : "<b>Answer : </b>") +
                            $(".answerbox", $(this)).html() + "</b><br/><br/>" +
                    "</td>" +
                    "</tr>";
        });
    }
    else {
        $(FavList).each(function () {
            str[str.length] = "<tr>" +
                "<td>" +
                        "<b>Ques : </b>" + this.Ques + "<br/>" +
                         (this.t == 0 ? "" : "<b>Answer : </b>") +
                            this.Ans + "</b><br/><br/>" +
                "</td>" +
                "</tr>";
        });
    }

    var popupWin = window.open("", "_blank", "toolbar=0,menubar=0,location=1,status=1,scrollbars=1,resizable=1,left=0,top=0");
    popupWin.document.open();
    popupWin.document.write('<html><body">' + str.join('') + '</html>');
    popupWin.document.close();
}
var FavList = [];
function AddToFavorite(QID) {
    if (FoundIndexInFav(QID) == -1)
        FavList[FavList.length] = { ID: QID, Ques: $("#que_" + QID).text(), Ans: $("#ans_" + QID).html(), Type: $("#ques_type").text() };

    SaveFavList();
}
function SaveFavList() { SaveInLocalStorage("Favs", JSON.stringify(FavList)); ShowFav(); }
function FoundIndexInFav(QID) {
    for (var i = 0; i < FavList.length; i++) {
        if (FavList[i].ID == QID)
            return i;
    }
    return -1;
}
function ShowFav()
{
    FavList = JSON.parse(LoadFromLocalStorage("Favs", "[]"));
    $("#spnFav").text(FavList.length);
    $("#HCnt").show();
    $("#liFav").show();
    $("#divFavorite").hide();

    if (FavList.length == 0)
    {
        AddClientOptions();
        GoTop();
        return;
    }

    var str = ["<table class='table table-condensed table-bordered table-hover' style='margin-bottom:0px'><tr><th>#<th>Question<th>Del"];
    $(FavList).each(function (index) {
        str[str.length] = "<tr><td>" + (index + 1) +
            "<td><a href='#' title='Click to show or hide answer' class='ashow' data-index='" + index + "' >" + this.Ques + "</a>" +
            "<span id='fav_" + index + "' style='display:none'></span>" +
            "<td><a href='#' class='abtn' onclick='return RemoveFromFav(" + index + ")'>X</a>";
    });

    str[str.length] = "</table>";
    $("#divFavs").html(str.join(''));
    $("#divFavorite").show();
    AddClientOptions();
    $("#divFavorite a.ashow").bind('click', function () {
        var ind = $(this).data("index");
        $("#fav_" + ind).html("<br/><b>Ans : </b>" + FavList[ind].Ans);
        $("#fav_" + ind).toggle();
        return false;
    });

}
function RemoveFromFav(index)
{
    index == -1 ? FavList.length = 0 : FavList.splice(index, 1);
    SaveFavList();
    return false;
}
function AddClientOptions()
{
    $(".answerbox", $(".divData")).each(function () {
        var id = $(this).data("id");

        favindex = FoundIndexInFav(id);

        if (favindex == -1)
            $("#divopt_" + id).html("<div class='optbtn' title='Add to Favorite' onclick='AddToFavorite(" + id + ")' >&nbsp;Add&nbsp; </div>");
        else
            $("#divopt_" + id).html("<div class='optbtn rem' title='Remove from Favorite' onclick='RemoveFromFav(" + favindex + ")' title='Remove from Favorites'>&nbsp;Remove&nbsp;</div>");
    });
}

function GoBack() {

    //location.href = Root;
    window.history.go(-1);
    return false;
}
function ViewFavorite() {
    $('body').animate({ scrollTop: $("#divFavs").position().top }, "slow");
}