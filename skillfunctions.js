$(document).ready(function()
{
	const skillsArray = [new Skill(), new Skill(), new Skill(), new UltSkill(), new TalentSkill(), new StatSkill()];
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
	createSkillBox('https://static.wikia.nocookie.net/dota2_gamepedia/images/c/c9/Impetus_icon.png', 'five');
	createSkillBox('https://static.wikia.nocookie.net/dota2_gamepedia/images/c/c9/Impetus_icon.png', 'six');
	
	// Creates an array holding references to all the elements inside the tooltip skillInfo-section.
	const tooltipSkillInfoArr = document.getElementById("tooltipSkillInfo").children;
	
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
	
	// Toggles the visibility of the skill tooltip element, and calls a function to update the content of the tooltip.
	$(".iconImage").on({
    mouseenter: function() 
		{
      var index = $(this).closest(".skill").index();
			updateToolTip(heroData[heroIndex], index, tooltipSkillInfoArr);
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
		applyHeroData(heroData[heroIndex]);
	}
	xmlhttp.open("GET", "https://tigerwaw.github.io/dota2buildcreator/heroinfo.json", true);
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
	document.getElementById("heroImage").src = data.heroIcon;
	document.getElementById("strText").innerHTML = data.heroAttrBase[0] + data.heroAttrGrowth[0];
	document.getElementById("agiText").innerHTML = data.heroAttrBase[1] + data.heroAttrGrowth[1];
	document.getElementById("intText").innerHTML = data.heroAttrBase[2] + data.heroAttrGrowth[2];
	document.getElementById("atkText").innerHTML = data.heroDamage;
	document.getElementById("armorText").innerHTML = data.heroArmor;
	document.getElementById("mSpeedText").innerHTML = data.heroSpeed;
	
	
	var childArray = $("#skillsBox").children();
	
	for (var i = 0; i < 4; i++)
	{
		childArray[i].getElementsByTagName("img")[0].src = data.skills[i].skillIcon;
		childArray[i].getElementsByTagName("img")[0].setAttribute("class", "iconImage");
	}
}

function updateToolTip(data, index, skillInfoArr)
{
	// Sets the name, icon, and description of the skill onto the tooltip.
	document.getElementById("tooltipSkillName").innerHTML = data.skills[index].skillName;
	document.getElementById("tooltipImage").src = data.skills[index].skillIcon;
	document.getElementById("tooltipDesc").innerHTML = data.skills[index].skillDesc;
	
	// Hides the elements in skillInfoArr.
	for (var i = 0; i < skillInfoArr.length; i++)
	{
		$(skillInfoArr[i]).hide();
	}
	
	// Toggles the elements in skillInfoArr based on how many items are in the skills skillInfo-array.
	for (var i = 0; i < data.skills[index].skillInfo.length; i++)
	{
		$(skillInfoArr[i]).text(data.skills[index].skillInfo[i]);
		$(skillInfoArr[i]).show();
	}
	
	// Hides the skills cooldown element if the value is null.
	if (data.skills[index].skillCooldown == null)
	{
		$("#tooltipSkillCooldown").hide();
	}
	else
	{
		$("#tooltipSkillCooldown").show();
		document.getElementById("tooltipSkillCooldown").innerHTML = "Cooldown: " + data.skills[index].skillCooldown;
	}
	
	// Hides the skills mana element if the value is null.
	if (data.skills[index].skillMana == null)
	{
		$("#tooltipSkillMana").hide();
	}
	else
	{
		$("#tooltipSkillMana").show();
		document.getElementById("tooltipSkillMana").innerHTML = "Manacost: " + data.skills[index].skillMana;
	}
}