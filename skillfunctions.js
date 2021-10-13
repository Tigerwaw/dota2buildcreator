$(document).ready(function()
{
	const skillsArray = [new Skill(), new Skill(), new Skill(), new UltSkill()];
	var charLevel = 1;
	
	createSkillBox('images/enchantress_impetus.png', 'one');
	createSkillBox('images/enchantress_enchant.png', 'two');
	createSkillBox('images/enchantress_natures_attendants.png', 'three');
	createSkillBox('images/enchantress_untouchable.png', 'four');
	
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
	
	// When hovering over the skill icon a pop-up window shows the details about the skill.
	$(".iconImage").hover(function()
	{
		$("#skillTooltip").show();
		$.getJSON("test.json", function(result)
		{
			$.each(result, function(i, field)
			{
				$("div").append(field + " ");
			});
		});
	}, function()
	{
		$("#skillTooltip").hide();
	});
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