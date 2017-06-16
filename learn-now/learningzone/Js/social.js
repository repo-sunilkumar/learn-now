var FB_Share = 0, FB_Like = 1, FB_Like_But_No_Share = 2, FB_Embed = 3, FB_Comment = 4, FB_LikeBox = 5, Twitter_Share = 6;
//FD Script
$(document).ready(function ()
{
    if (location.href.indexOf("localhost") == -1)
    {
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=720631857995720&version=v2.0";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        !function (d, s, id) { var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https'; if (!d.getElementById(id)) { js = d.createElement(s); js.id = id; js.src = p + '://platform.twitter.com/widgets.js'; fjs.parentNode.insertBefore(js, fjs); } }(document, 'script', 'twitter-wjs');

        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date(); a = s.createElement(o),
            m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
        ga('create', 'UA-50069779-1', 'infonexus.in');
        ga('send', 'pageview');

    }
});

//Twitter Script

function Build_Social_Button(type, url, width) {
    width = width == undefined ? 100 : width;
    var str = "";
    switch (type) {
        case FB_Share: str = "<div class='fb-share-button' data-href='" + url + "' data-width='" + width + "'></div>"; break;
        case FB_Like: str = "<div class='fb-like' data-href='" + url + "' data-width='" + width + "' data-layout='button' data-action='like' data-show-faces='true' data-share='true'></div>"; break;
        case FB_Like_But_No_Share: str = "<div class='fb-like' data-href='" + url + "' data-width='" + width + "' data-layout='button' data-action='like' data-show-faces='true' data-share='false'></div>"; break;
        case FB_Embed: str = "<div class='fb-post' data-href='" + url + "' data-width='" + width + "'></div>"; break;
        case FB_Comment: str = "<div class='fb-comments' data-href='" + url + "' data-numposts='5' data-colorscheme='light'></div>"; break;
        case FB_LikeBox: str = "<div class='fb-like-box' data-href='" + url + "' data-colorscheme='light' data-show-faces='true' data-header='true' data-stream='false' data-show-border='true'></div>"; break;
        case Twitter_Share: str = "<a href='https://twitter.com/share' class='twitter-share-button'>Tweet</a>"; break;
    }
    return str;
}


