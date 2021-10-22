$(document).ready(function()
{
	const skillsArray = [];
	var charLevel = 1;
	var heroData;
	var heroIndex = 0;
	
	// Gets the url parameter "hero" to figure out what hero the user clicked on the previous page.
	var url = new URL(window.location.href);
	heroIndex = url.searchParams.get("hero");
	
	// Creates an array holding references to all the elements inside the tooltip skillInfo-section.
	const tooltipSkillInfoArr = document.getElementById("tooltipSkillInfo").children;
	
	//Handles external json-data.
	const xmlhttp = new XMLHttpRequest();
	xmlhttp.onload = function()
	{
		heroData = JSON.parse(this.responseText);
		createSkillBoxes(heroData[heroIndex]);
		
		createSkillBox('https://static.wikia.nocookie.net/dota2_gamepedia/images/c/cd/Talent_tree_symbol.png', 'talentsID');
		createSkillBox('https://static.wikia.nocookie.net/dota2_gamepedia/images/e/e2/Attribute_Bonus_icon.png', 'attributesID');
		
		// Dynamically adds skill-objects to the skillsArray based on how many abilities the hero has.
		for (var i = 0; i < heroData[heroIndex].skills.length - 1; i++)
		{
			skillsArray.push(new Skill());
		}
		skillsArray.push(new UltSkill());
		skillsArray.push(new TalentSkill());
		skillsArray.push(new StatSkill());
		
		allowSkillLevelling(skillsArray, charLevel);
		
		setTimeout(() => {$("#loadingScreen").hide()}, 300);
	}
	xmlhttp.open("GET", "https://tigerwaw.github.io/dota2buildcreator/heroinfo.json", true);
	xmlhttp.send();	
	
	
	// Beginning of jQuery functions.
	
	$("#main #skillTooltip").hide();
	
	$("#skillsBox").on("click", ".skill .skillButtons .levelUp", function()
	{
		// Get the index of the parent skill-div within the skillBox-div.
		// Its index corresponds to the same index in the skillsArray.
		var skillIndex = $(this).closest(".skill").index();
		var skill = skillsArray[skillIndex];
		var id = $(this).closest(".skill").attr("id");
		
		if(skill.levelUp(charLevel))
		{
			skill.assignedPoints.push(charLevel);
			skill.level += 1;
			charLevel += 1;
			allowSkillLevelling(skillsArray, charLevel);
		}
	});
	
	$("#skillsBox").on("click", ".skill .skillButtons .levelDown", function()
	{
		// Get the index of the parent skill-div within the skillBox-div.
		// Its index corresponds to the same index in the skillsArray.
		var skillIndex = $(this).closest(".skill").index();
		var skill = skillsArray[skillIndex];
		var id = $(this).closest(".skill").attr("id");
		
		if(skill.levelDown(charLevel))
		{
			skill.assignedPoints.pop();
			skill.level -= 1;
			charLevel -= 1;
			allowSkillLevelling(skillsArray, charLevel);
		}
	});
	
	$("#skillsBox").on("mouseenter", ".skill .iconImage", function()
	{			
		var skillID = $(this).closest(".skill").attr("id");
		if (skillID != "attributesID" && skillID != "talentsID")
		{
			var index = $(this).closest(".skill").index();
			updateToolTip(heroData[heroIndex], index, tooltipSkillInfoArr);
			$("#main #skillTooltip").stop(true, true).delay(200).show("slide", 200);
			$(this).css("filter", "brightness(120%)");
		}
	});
	
	$("#skillsBox").on("mouseleave", ".skill .iconImage", function()
	{			
		$("#main #skillTooltip").stop(true, true).hide("slide", 100);
		$(this).css("filter", "brightness(100%)");
	});
	
	$("#skillsBox").on("mouseenter", ".skill .skillButtons input", function()
	{
		$(this).css("background-image", "radial-gradient(circle, #777777, #313131 70%)");
	});
	
	$("#skillsBox").on("mouseleave", ".skill .skillButtons input", function()
	{
		$(this).css("background-image", "radial-gradient(circle, #777777, #313131 90%)");
	});
});

// Colors the skill point boxes according to whether they have been used to level a skill and whether they can or can not be levelled at a certain level.
function allowSkillLevelling(skillsArray, charLevel)
{
	for (var i = 0; i < skillsArray.length; i++)
	{
		var childArray = $("#skillsBox").children();
		var id = $(childArray[i]).attr("id");
		var skillPointArray = $(childArray[i].children);
		
		// Make skillpoint dark (Not skillable).
		for (var y = 0; y < skillPointArray.length; y++)
		{
			$("#" + id + " > .skillPoint:nth-of-type(" + (y) + ")").css("background-color", "#313131");
		}
		
		// Make skillpoint golden (Has been skilled).
		for (var x = 0; x < skillsArray[i].assignedPoints.length; x++)
		{
			$("#" + id + " > .skillPoint:nth-of-type(" + (skillsArray[i].assignedPoints[x]+1) + ")").css("background-color", "#daaf2b");
		}
		
		// Make skillpoint grey (Can be skilled).
		if (skillsArray[i].levelUp(charLevel))
		{
			$("#" + id + " > .skillPoint:nth-of-type(" + (charLevel + 1) + ")").css("background-color", "#777777");
		}
	}
}

function createSkillBoxes(heroData)
{
	for (var i = 0; i < heroData.skills.length; i++)
	{
		createSkillBox('https://static.wikia.nocookie.net/dota2_gamepedia/images/c/c9/Impetus_icon.png', i);
	}
	
	applyHeroData(heroData);
}

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
	
	for (var i = 0; i < data.skills.length; i++)
	{
		childArray[i].getElementsByTagName("img")[0].src = data.skills[i].skillIcon;
		childArray[i].getElementsByTagName("img")[0].setAttribute("class", "iconImage");
	}
}

function updateToolTip(data, index, skillInfoArr)
{
	// Sets the name, icon, and description of the skill onto the tooltip.
	document.getElementById("tooltipSkillName").innerHTML = data.skills[index].skillName;
	document.getElementById("tooltipImageSkill").src = data.skills[index].skillIcon;
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
	
	var cooldown = data.skills[index].skillCooldown;
	var mana = data.skills[index].skillMana;
	
	// Hides the skills cooldown element if the value is null.
	if (cooldown == null)
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