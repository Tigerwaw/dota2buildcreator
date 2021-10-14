$(document).ready(function()
{
	const skillsArray = [new Skill(), new Skill(), new Skill(), new UltSkill()];
	var charLevel = 1;
	var heroData;
	var heroIndex = 0;
	
	// Gets the url parameter "hero" to figure out what hero the user clicked on the previous page.
	var url = new URL(window.location.href);
	heroIndex = url.searchParams.get("hero");
	
	createSkillBox('https://static.wikia.nocookie.net/dota2_gamepedia/images/c/c9/Impetus_icon.png', 'one');
	createSkillBox('https://static.wikia.nocookie.net/dota2_gamepedia/images/c/c9/Impetus_icon.png', 'two');
	createSkillBox('https://static.wikia.nocookie.net/dota2_gamepedia/images/c/c9/Impetus_icon.png', 'three');
	createSkillBox('https://static.wikia.nocookie.net/dota2_gamepedia/images/c/c9/Impetus_icon.png', 'four');
	
	$("#skillTooltip").hide();
	
	$(".levelUp").click(function()
	{
		// Get the index of the parent skill-div within the skillBox-div.
		// Its index corresponds to the same index in the skillsArray.
		var skillIndex = $(this).closest(".skill").index();
		var skill = skillsArray[skillIndex];
		var id = $(this).closest(".skill").attr("id");
		
		if(skill.levelUp(charLevel))
		{
			charLevel += 1;
			$("#" + id + " > .skillPoint:nth-of-type(" + (charLevel) + ")").css("background-color", "#3f3f3f");
		}
	});
	
	$(".levelDown").click(function()
	{
		// Get the index of the parent skill-div within the skillBox-div.
		// Its index corresponds to the same index in the skillsArray.
		var skillIndex = $(this).closest(".skill").index();
		var skill = skillsArray[skillIndex];
		var id = $(this).closest(".skill").attr("id");
		
		if(skill.levelDown(charLevel))
		{
			charLevel -= 1;
			$("#" + id + " > .skillPoint:nth-of-type(" + (charLevel + 1) + ")").css("background-color", "#777777");
		}
	});
	
	$(".iconImage").on({
    mouseenter: function() 
		{
      var index = $(this).closest(".skill").index();
			updateToolTip(heroData.heroes[heroIndex], index);
			$("#skillTooltip").show();
    },
    mouseleave: function() 
		{
      $("#skillTooltip").hide();
		}
	});
	
	
	//Handles external json-data.
	const xmlhttp = new XMLHttpRequest();
	xmlhttp.onload = function()
	{
		heroData = JSON.parse(this.responseText);
		applyHeroData(heroData.heroes[heroIndex]);
	}
	xmlhttp.open("GET", "https://tigerwaw.github.io/dota2buildcreator/heroinfo2.json", true);
	xmlhttp.send();
});

function createSkillBox(image, id)
{
	$("<div class='skill' id='" + id + "'> \
			<div class='skillButtons'> \
				<input type='button' value='+' class='levelUp'> \
				<input type='button' value='-' class='levelDown'> \
			</div> \
			<img src=" + image + " class='iconImage'> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
			<div class='skillPoint'></div> \
		</div>").appendTo("#skillsBox");
}

function applyHeroData(data)
{
	document.getElementById("heroName").innerHTML = data.heroName;
	document.getElementById("heroImage").src = data.heroIcon-src;
	document.getElementById("strText").innerHTML = data.heroAttrBase[0] + data.heroAttrGrowth[0];
	document.getElementById("agiText").innerHTML = data.heroAttrBase[1] + data.heroAttrGrowth[1];
	document.getElementById("intText").innerHTML = data.heroAttrBase[2] + data.heroAttrGrowth[2];
	document.getElementById("atkText").innerHTML = data.heroDamage;
	document.getElementById("armorText").innerHTML = data.heroArmor;
	document.getElementById("mSpeedText").innerHTML = data.heroSpeed;
	
	
	var childArray = $("#skillsBox").children();
	
	for (var i = 0; i < 4; i++)
	{
		childArray[i].getElementsByTagName("img")[0].src = data.abilities[i].abilityIcon-src;
		childArray[i].getElementsByTagName("img")[0].setAttribute("class", "iconImage");
	}
}

function updateToolTip(data, index)
{
	document.getElementById("toolTipSkillName").innerHTML = data.abilities[index].abilityName;
	document.getElementById("tooltipImage").src = data.abilities[index].abilityIcon-src;
	document.getElementById("toolTipDesc").innerHTML = data.abilities[index].abilityDesc;
	document.getElementById("toolTipSkillCooldown").innerHTML = "Cooldown: " + data.abilities[index].abilityCooldown;
	document.getElementById("toolTipSkillMana").innerHTML = "Manacost: " + data.abilities[index].abilityMana;
	document.getElementById("toolTipSkillInfo").innerHTML = data.abilities[index].abilityInfo[0];
}