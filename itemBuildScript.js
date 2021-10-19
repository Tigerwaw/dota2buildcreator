$(document).ready(function()
{
	var itemData;
	
	// Creates an array holding references to all the elements inside the tooltip skillInfo-section.
	const tooltipSkillInfoArr = document.getElementById("tooltipItemActiveInfo").children;
	
	//Handles external json-data.
	const xmlhttp = new XMLHttpRequest();
	xmlhttp.onload = function()
	{
		itemData = JSON.parse(this.responseText);
		for (let i = itemData.length - 1; i > -1; i--)
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
	
	$("#buildColumn .buildSegment .itemGrid").sortable(
	{
		connectWith: ".itemGrid"
	});
	
	$(".itemDraggable").draggable(
	{
		connectToSortable: ".itemGrid",
		helper: "clone"
	});
	
	$("#itemColumn, #buildColumn").on("mouseenter", ".itemDraggable, .buildSegment .itemGrid .itemDraggable", function()
	{
		// Checks whether the current .itemDraggable is currently being dragged by the user. If not then the tooltip will be displayed.
		if ($(this).is(".ui-draggable-dragging") == false)
		{
			updateTooltip(itemData[$(this).attr("alt")], tooltipSkillInfoArr);
			$("#skillTooltipItem").stop(true, true).delay(200).show("slide", 200, false);
		}
	});
	
	$("#itemColumn, #buildColumn").on("mouseleave", ".itemDraggable, .buildSegment .itemGrid .itemDraggable", function()
	{
		$("#skillTooltipItem").stop(true, true).hide("slide", 100, false);
	});
	
	// When clicking the editSegment button the title will get hidden and a text input will appear for the user to change the title.
	$("#buildColumn").on("click", ".buildSegment .editSegmentTitleButton", function()
	{
		var segmentTitle = $(this).parent().children("h3")[0];
		var segmentTitleInput = $(this).parent().children("input[type='text']")[0];

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


function createSegment()
{
	$("<div class='buildSegment'> \
			<h3>Early Game</h3><input type='text' style='display:none'><input type='button' class='editSegmentTitleButton ui-icon ui-icon-pencil'><input type='button' class='removeSegmentButton ui-icon ui-icon-closethick'> \
			<div class='itemGrid'> \
			</div> \
		</div>").insertBefore("#newSegmentButton");
	
	$(".itemGrid").sortable(
	{
		connectWith: ".itemGrid"
	});
}

function updateTooltip(data, itemInfoArr)
{
	// Sets the name, icon, and description of the skill onto the tooltip.
	document.getElementById("tooltipSkillName").innerHTML = data.item_name;
	document.getElementById("tooltipImageItem").src = data.item_image;
	document.getElementById("tooltipDesc").innerHTML = data.item_cost;
	
	$("#tooltipItemPassives").text(data.item_passives);
	$("#tooltipItemActive > h3").text(data.item_active_name);
	$("#tooltipItemActive > p").text(data.item_active_desc);
	
	
	// Hides the elements in itemInfoArr.
	for (var i = 0; i < itemInfoArr.length; i++)
	{
		$(itemInfoArr[i]).hide();
	}
	
	var cooldownSet = false;
	
	// Toggles the elements in itemInfoArr based on how many objects are in the items item_active_info-array.
	for (var i = 0; i < data.item_active_info.length; i++)
	{
		// RegExp that checks to see if the string contains alphabetical letters. If it doesn't that means it is the cooldown and manacost for our items active ability.
		if (/[a-zA-Z]/i.test(data.item_active_info[i].item_active_info))
		{
			$(itemInfoArr[i]).text(data.item_active_info[i].item_active_info);
		}
		else
		{
			if (cooldownSet)
			{
				$(itemInfoArr[i]).text("Manacost: " + data.item_active_info[i].item_active_info);
			}
			else
			{
				$(itemInfoArr[i]).text("Cooldown: " + data.item_active_info[i].item_active_info);
				cooldownSet = true;
			}
		}
		
		$(itemInfoArr[i]).show();
		
		// Hides the 
		if (data.item_active_info[i].item_active_info == "")
		{
			$(itemInfoArr[i]).hide();
		}
	}
	
	
	
	// Hides the items active ability element if the value is empty.
	if (data.item_active_info == "")
	{
		$("#tooltipItemActive").hide();
	}
	else
	{
		$("#tooltipItemActive").show();
	}
}