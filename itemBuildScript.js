$(document).ready(function()
{
	let itemData;

	// Creates an array holding references to all the elements inside the tooltip skillInfo-section.
	const tooltipSkillInfoArr = document.getElementById("tooltipItemActiveInfo").children;
	
	const itemComponentsArr = document.getElementById("buildsFrom").children;
	const itemBuildsIntoArr = document.getElementById("buildsInto").children;
	
	//Handles external json-data.
	const xmlhttp = new XMLHttpRequest();
	xmlhttp.onload = function()
	{
		itemData = JSON.parse(this.responseText);
		for (let i = 0; i < itemData.length; i++)
		{
			$("<div class='itemDraggable' alt=" + i + "><img class='itemImage' src=" + itemData[i].item_image + "></div>").appendTo('#itemColumn').draggable({connectToSortable: ".itemGrid", helper: "clone"});
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
		updateTooltip(itemData[$(this).attr("alt")], tooltipSkillInfoArr, itemComponentsArr, itemBuildsIntoArr);
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

function updateTooltip(data, itemInfoArr, itemComponentsArr, itemBuildsIntoArr)
{
	// Sets the name, icon, and description of the skill onto the tooltip.
	$("#tooltipImageItem").attr("src", data.itemIcon);
	$("#tooltipSkillNameItem").text(data.itemName);
	$("#tooltipDescItem").text(itemCost);
	$("#tooltipItemStats").text(data.itemStats);
	$("#tooltipItemActive > h3").text(data.itemSkills[0].skillName);
	$("#tooltipItemActive > p:nth-child(1)").text(data.itemSkills[0].skillDesc);
	$("#tooltipItemActive > p:nth-child(2)").text(data.itemSkills[0].skillCooldown);
	$("#tooltipItemActive > p:nth-child(3)").text(data.itemSkills[0].skillManacost);
	
	// Hides the items active ability element if the value is empty.
	if (data.itemSkills == "")
	{
		$("#tooltipItemActive").hide();
	}
	else
	{
		$("#tooltipItemActive").show();
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

function splitCostString(itemData)
{
	const regexGoldcostRecipe = new RegExp(/\w+ (\d+) \(\d+\)/);
	const regexGoldcost = new RegExp(/\w+ (\d+)/);
	
	let cost = regexGoldcostRecipe.exec(itemData.item_cost);
	
	if (cost == null)
	{
		cost = regexGoldcost.exec(itemData.item_cost);
	}
	
	return cost[1];
}