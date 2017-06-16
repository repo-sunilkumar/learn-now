<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Default" %>
<!DOCTYPE>
<html manifest="/infonexus.appcache">
<head runat="server">
    <title>Learning Zone | Mobile</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="mobile-web-app-capable" content="yes">
    <link rel="shortcut icon" type="image/x-icon" href="/Images/icon.gif" />
    <meta name="description" content="Learning Zone, Find tutorials of ASP.NET, C#.NET,Database, SQL Server, LINQ, JavaScript, JQuery and many other technologies. Find best interview questions. interview questions of various technologies" />
    <meta name="keywords" content=".NET tutorials, Database tutorials, C# tutorials, tutorials, interview questions, one liners, objective questions of .net and other technologies." />
    <style type="text/css">
        #divSocial { padding: 11px; background-color: rgb(209, 197, 197); margin-bottom: 20px; }
        .dtl { display: none; }
        .round { background-color: lightgrey; text-align: center; padding: 12px; border-radius: 149px; width: 21px; display: initial; }
        .title { display: block; font-size: 3em; color: cornflowerblue; }
        #divBlank { height: 397px; background-color: rgb(247, 255, 207); text-align: center; }
        .loading { font-size: 2em; color: rgb(255, 102, 0); font-weight: bold; }
    </style>
</head>
<body>
    <form id="form1" runat="server">
    </form>

    <div id="divHome" data-role="page" data-theme="d" class="dtl" style="display: none">
        <div data-role="content">
            <div id="divBlank">
                <div class="emp"></div>
                <span class="title">Learning Zone</span>
                <span class="loading">Loading..</span>
            </div>
            <div id="divDefault">
                <div id="divInfo">
                    <img id="imgLogo" src="" />
                </div>
                <div id="divLastVisitInfo"></div>
                <div id="divHomeInfo">

                    <div id="divLanguages"></div>
                    <br />
                    <div id="HistoryOnMainPage"></div>
                    <br />
                    <div id="divcontact" style="background-color: rgb(228, 66, 105); padding: 10px;">
                        <a style="color: white; color: rgb(252, 247, 247); padding: 7px;" href="#" onclick="location.href='http://infonexus.in';">infonexus.in - Learning Zone</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="divChild" data-role="page" data-theme="d" class="dtl">
        <div data-role="header" data-theme="a">
            <a href="#divHome" data-icon="home" data-iconpos="notext" id="A5" class="ui-btn-left">Home</a>
            <h1>
                <label class="lblHeader"></label>
            </h1>
            <a href="#" data-rel="back" data-icon="back" data-iconpos="notext">Back</a>
        </div>

        <div data-role="content">
            <div id="divChildList"></div>
        </div>
    </div>


    <%--Displaying List of Route--%>
    <div id="divQuesListPage" data-role="page" data-theme="d" class="dtl">
        <div data-role="header" data-theme="a">
            <a href="#divHome" data-icon="home" data-iconpos="notext" id="A1" class="ui-btn-left">Home</a>
            <h1>
                <label class="lblHeader"></label>
            </h1>
            <a href="#" data-rel="back" data-icon="back" data-iconpos="notext">Back</a>
        </div>
        <div data-theme="e" data-role="content">
            <div data-role="content" id="divQuesList" style="margin-bottom: 40px;"></div>
        </div>
        <div id="divFooterSearchResult"></div>
    </div>

    <%--Displaying History--%>
    <div id="divFavouriteListPage" data-role="page" data-theme="e" class="dtl">
        <div data-role="header" data-theme="a">
            <a href="#divHome" data-icon="home" data-iconpos="notext" id="A2" class="ui-btn-left">Home</a>
            <h1>
                <label class="lblHeader"></label>
            </h1>
            <a href="#" data-rel="back" data-icon="back" data-iconpos="notext">Back</a>
        </div>
        <div data-theme="d" data-role="content">
            <div data-role="content" id="divFavouriteList">
            </div>
        </div>
        <div id="divFooterFavouriteList"></div>
    </div>

    <%--Autocomplete--%>
    <div id="divSearch" data-role="page" data-theme="a" class="dtl">
        <div data-role="header" data-theme="a">
            <a href="#divHome" data-icon="home" data-iconpos="notext" id="A4" class="ui-btn-left">Home</a>
            <h1>
                <label class="lblHeader"></label>
            </h1>
            <a href="#" data-rel="back" data-icon="back" data-iconpos="notext">Back</a>
        </div>
        <div data-theme="e" data-role="content">
            <div id="divSearchPage">
                <div class='ui-grid-a'>
                    <div class='ui-block-a'>
                        <input type="text" id="txtSearch" placeholder="search" />
                    </div>
                    <div class='ui-block-b'><a href='#' data-role='button' data-icon='search' id="btnsearch" data-corners='false' class='c'><span class='hidden-phone'>Search</span></a></div>
                </div>
            </div>
            <div id="divSearchResult"></div>

        </div>
    </div>

    <%--Selected Question--%>
    <div id="divSelectedQuestionPage" data-role="page" data-theme="e" class="dtl">
        <div data-role="header" data-theme="a">
            <a href="#divHome" data-icon="home" data-iconpos="notext" id="A3" class="ui-btn-left">Home</a>
            <h1>
                <label class="lblHeader"></label>
            </h1>
            <a href="#" data-rel="back" data-icon="back" data-iconpos="notext">Back</a>
        </div>
        <div data-theme="e" data-role="content">
            <div id="divSelectedQuestion"></div>
        </div>
    </div>


    <%--Alert--%>
    <div id="divAlertPage" data-role="dialog" data-theme="a" class="dtl">
        <div data-role="header" data-theme="a">
            <h1>
                <label class="lblHeader"></label>
            </h1>
        </div>
        <div data-theme="c" data-role="content">
            <div id="divMsg"></div>
        </div>
    </div>


    <div id="fb-root"></div>
</body>

<link href="/bootstrap/css/mobcmn.css?v=1.0" rel="stylesheet" />

<script type="text/javascript" src='/js/jquery.min.js'></script>
<script type="text/javascript" src='/js/jquery.mobile-1.4.2.min.js'></script>
<script type="text/javascript" src='/learningzone/m/js/CmnJSAll.js?v=1.4'></script>

<%--<script type="text/javascript" src='/learningzone/js/social.js'></script>--%>
<%--<script type="text/javascript" src='/learningzone/m/js/commonui.js'></script>
<script type="text/javascript" src='/learningzone/m/js/main1.js'></script>--%>

<script>
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date(); a = s.createElement(o),
        m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    ga('create', 'UA-50069779-1', 'infonexus.in');
    ga('send', 'pageview');
</script>
</html>
