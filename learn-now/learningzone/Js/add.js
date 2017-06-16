$(document).ready(function()
{
    showAds();
});


var ad1="<div class='alignleft'><script type='text/javascript'>amzn_assoc_ad_type = 'banner'; amzn_assoc_tracking_id = 'infonexusin-20'; amzn_assoc_marketplace = 'amazon'; amzn_assoc_region = 'US'; amzn_assoc_placement = 'assoc_banner_placement_default'; amzn_assoc_linkid = 'GJ53CWDRMVJOIHNP'; amzn_assoc_campaigns = 'ce_smartphone_tradein'; amzn_assoc_banner_type = 'category';amzn_assoc_isresponsive = 'true';</script><script src='//z-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&Operation=GetScript&ID=OneJS&WS=1'></script></div>";

var ad2="<div class='alignleft'><script type='text/javascript'>amzn_assoc_ad_type = 'banner'; amzn_assoc_tracking_id = 'infonexusin-20'; amzn_assoc_marketplace = 'amazon'; amzn_assoc_region = 'US'; amzn_assoc_placement = 'assoc_banner_placement_default'; amzn_assoc_linkid = '6B77YORBGBGBCZ3K'; amzn_assoc_campaigns = 'electronicsrot'; amzn_assoc_p = '12'; amzn_assoc_banner_type = 'rotating'; amzn_assoc_width = '300'; amzn_assoc_height = '250'; </script><script src='//z-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&Operation=GetScript&ID=OneJS&WS=1'></script></div>";

var ad3="<iframe style='width:120px;height:240px;' marginwidth='0' marginheight='0' scrolling='no' frameborder='0' src='//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=infonexusin-20&marketplace=amazon&region=US&placement=B00BPLRM68&asins=B00BPLRM68&linkId=XC62HKALSAPDKW6E&show_border=true&link_opens_in_new_window=true'></iframe>";

var ad4="<iframe style='width:120px;height:240px;' marginwidth='0' marginheight='0' scrolling='no' frameborder='0' src='//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=infonexusin-20&marketplace=amazon&region=US&placement=B003CIP4TE&asins=B003CIP4TE&linkId=FF2W3XRUM274GMZN&show_border=true&link_opens_in_new_window=true'></iframe>";

function showAds()
{
	var w = $(window).width();

console.log(w);
console.log(ad1);
console.log(ad2);
console.log(ad3);
console.log(ad4);
	//Top leader board over pagination
	$("#ad_2").html(ad1);
	
	//Bootom multiple after questions
	var str=["<table><tr>"];

	if(w>800)
		str[str.length]="<td>"+ ad3 +"</td>";

	str[str.length]="<td>"+ ad3 +"</td>";
	str[str.length]="<td>"+ ad4 +"</td>";
	str[str.length]="</tr></table>";
	$("#ad_3").html(str.join(''));
}