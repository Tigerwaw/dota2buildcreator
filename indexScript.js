$(document).ready(function()
{
	var heroData;
	var heroIcons = [];
	
	//Handles external json-data.
	const xmlhttp = new XMLHttpRequest();
	xmlhttp.onload = function()
	{
		heroData = JSON.parse(this.responseText);
		for (let i = heroData.length - 1; i > -1; i--)
		{
			heroIcons.push(heroData[i].heroIcon);
			$("<a href='buildpage.html?hero=" + i + "'><img src=" + heroData[i].heroIcon + " alt='Hero Image' class='homeHeroIcon'></a>'").appendTo('#heroes');
		}
		
		setTimeout(() => {$("#loadingScreen").hide()}, 1000);
	}
	xmlhttp.open("GET", "https://tigerwaw.github.io/dota2buildcreator/heroinfo.json", true);
	xmlhttp.send();
});