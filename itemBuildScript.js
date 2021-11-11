$(document).ready(function()
{
	let itemData;
	
	const itemActivesArr = document.getElementById("tooltipItemActives").children;
	const itemComponentsArr = document.getElementById("buildsFrom").children;
	const itemBuildsIntoArr = document.getElementById("buildsInto").children;
	
	//Handles external json-data.
	const xmlhttp = new XMLHttpRequest();
	xmlhttp.onload = function()
	{
		itemData = JSON.parse(this.responseText);
		for (let i = 0; i < itemData.length; i++)
		{
			$("<div class='itemDraggable' alt=" + i + "><img class='itemImage' src=" + itemData[i].itemIcon + "></div>").appendTo('#itemColumn').draggable({connectToSortable: ".itemGrid", helper: "clone"});
		}
		
		setTimeout(() => {$("#loadingScreen").hide()}, 500);
	}
	xmlhttp.open("GET", "https://tigerwaw.github.io/dota2buildcreator/iteminfo.json", true);
	xmlhttp.send();


	
	$("#newSegmentButton").click(function()
	{
		createSegment();
	});
	
	$(".itemGrid").sortable(
	{
		connectWith: ".itemGrid",
		update: function(event, ui)
		{
			// Calls the calculateStartingGold function with the itemData and the itemGrid of the first buildSegment of the buildColumn as arguments.
			calculateStartingGold(itemData, $("#buildColumn .buildSegment:first-child .itemGrid").children());
		}
	});
	
	$(".itemDraggable").draggable(
	{
		connectToSortable: ".itemGrid",
		helper: "clone"
	});
	
	$("#itemColumn, #buildColumn").on("click", ".itemDraggable, .buildSegment .itemGrid .itemDraggable", function()
	{
		updateTooltip(itemData[$(this).attr("alt")], itemActivesArr, itemComponentsArr, itemBuildsIntoArr);
		$("#skillTooltipItem").stop(true, true).delay(200).show("slide", 200, false);
	});
	
	// Deletes an item from the build section when it is right clicked, and then calls CalculateStartingGold to update the gold counter.
	$("#buildColumn").on("contextmenu", ".itemDraggable, .buildSegment .itemGrid .itemDraggable", function(e)
	{
		$(this).remove();
		calculateStartingGold(itemData, $("#buildColumn .buildSegment:first-child .itemGrid").children());
		return false;
	});
	
	$("#itemColumn, #buildColumn").on("mouseenter", ".itemDraggable, .buildSegment .itemGrid .itemDraggable", function()
	{
		// Checks whether the current .itemDraggable is currently being dragged by the user. If not then the tooltip will be displayed.
		if ($(this).is(".ui-draggable-dragging") == false)
		{
			$(this).css("filter", "brightness(130%)");
		}
	});
	
	$("#itemColumn, #buildColumn").on("mouseleave", ".itemDraggable, .buildSegment .itemGrid .itemDraggable", function()
	{
		$(this).css("filter", "brightness(100%)");
	});
	
	// When clicking the editSegment button the title will get hidden and a text input will appear for the user to change the title.
	$("#buildColumn").on("click", ".buildSegment .editSegmentTitleButton", function()
	{
		const segmentTitle = $(this).parent().children("h3")[0];
		const segmentTitleInput = $(this).parent().children("input[type='text']")[0];

		$(segmentTitleInput).attr("value", segmentTitle.textContent);
		$(segmentTitle).text(segmentTitleInput.value);
		
		$(segmentTitle).toggle();
		$(segmentTitleInput).toggle();
	});
	
	// When clicking the removeSegment button the segment gets removed from the build.
	$("#buildColumn").on("click", ".buildSegment .removeSegmentButton", function()
	{
		$(this).parent().remove();
	});
	
	$("#skillTooltipItem").hide();
});


function calculateStartingGold(itemData, itemArray)
{
	// The for-loop goes through all items in the grid and adds together the x from their goldcost-strings.
	let itemCostSum = 0;
	
	for (let i = 0; i < itemArray.length; i++)
	{
		const cost = itemData[$(itemArray[i]).attr("alt")]
		
		itemCostSum += Number(cost);
	}
	
	$("#goldCost").text(600 - itemCostSum);
}

function createSegment()
{
	$("<div class='buildSegment'> \
			<h3>New Segment</h3><input type='text' style='display:none'><input type='button' class='editSegmentTitleButton ui-icon ui-icon-pencil'><input type='button' class='removeSegmentButton ui-icon ui-icon-closethick'> \
			<div class='itemGrid'> \
			</div> \
		</div>").insertBefore("#newSegmentButton");
	
	$(".itemGrid").sortable(
	{
		connectWith: ".itemGrid",
	});
}

function updateTooltip(data, itemActivesArr, itemComponentsArr, itemBuildsIntoArr)
{
	// Sets the name, icon, and description of the skill onto the tooltip.
	$("#tooltipImageItem").attr("src", data.itemIcon);
	$("#tooltipSkillNameItem").text(data.itemName);
	$("#tooltipDescItem").text(data.itemCost);
	$("#tooltipItemStats").text(data.itemStats);
	
	// Hides the elements in tooltipItemActives.
	for (let i = 0; i < itemActivesArr.length; i++)
	{
		$(itemActivesArr[i]).hide();
	}
	
	if (data.itemSkills.length > 0)
	{
		for (let i = 0; i < data.itemSkills.length; i++)
		{
			$(itemActivesArr[i]).children("h3").text(data.itemSkills[i].skillName);
			$(itemActivesArr[i]).children("p:nth-child(2)").text(data.itemSkills[i].skillDesc);
			$(itemActivesArr[i]).children("p:nth-child(3)").text(data.itemSkills[i].skillInfo);
			let cooldown = $(itemActivesArr[i]).children("p:nth-child(4)");
			let manacost = $(itemActivesArr[i]).children("p:nth-child(5)");
			
			// Hides the skills cooldown element if the value is null.
			if (data.itemSkills[i].skillCooldown == null)
			{
				cooldown.hide();
			}
			else
			{
				cooldown.show();
				cooldown.text("Cooldown: " + data.itemSkills[i].skillCooldown);
			}
			
			// Hides the skills mana element if the value is null.
			if (data.itemSkills[i].skillMana == null)
			{
				manacost.hide();
			}
			else
			{
				manacost.show();
				manacost.text("Mana: " + data.itemSkills[i].skillMana);
			}
			
			$(itemActivesArr[i]).show();
		}
	}

	
	/*
	// Hides the elements in itemComponentsArr.
	for (let i = 0; i < itemComponentsArr.length; i++)
	{
		$(itemComponentsArr[i]).hide();
	}
	
	if (data.item_components.length > 0)
	{
		for (let i = 0; i < data.item_components.length; i++)
		{
			$(itemComponentsArr[i]).text(data.item_components[i]['item_components-alt']);
			$(itemComponentsArr[i]).show();
			console.log(itemComponentsArr[i]);
		}
	}
	*/
}