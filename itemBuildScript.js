$(document).ready(function()
{
	var itemData;
	
	//Handles external json-data.
	const xmlhttp = new XMLHttpRequest();
	xmlhttp.onload = function()
	{
		itemData = JSON.parse(this.responseText);
		for (let i = itemData.length - 1; i > 0; i--)
		{
			$("<div class='itemDraggable'><img class='itemImage' src=" + itemData[i].item_image + "></div>").appendTo('#itemColumn').draggable({connectToSortable: ".itemGrid", helper: "clone"});
		}
		
		//setTimeout(() => {$("#loadingScreen").hide()}, 1000);
	}
	xmlhttp.open("GET", "https://tigerwaw.github.io/dota2buildcreator/iteminfo.json", true);
	xmlhttp.send();
	
	
	$("#newSegmentButton").click(function()
	{
		createSegment();
	});
	
	$(".itemGrid").sortable(
	{
		connectWith: ".itemGrid"
	});
	
	$(".itemDraggable").draggable(
	{
		connectToSortable: ".itemGrid",
		helper: "clone"
	});
	
	$("#itemColumn").on("click", ".itemDraggable", function()
	{
		console.log("tooltip");
	});
	
	$("#buildColumn").on("click", ".buildSegment .editSegmentTitleButton", function()
	{
		var segmentTitle = $(this).parent().children("h3")[0];
		var segmentTitleInput = $(this).parent().children("input[type='text']")[0];

		$(segmentTitleInput).attr("value", segmentTitle.textContent);
		$(segmentTitle).text(segmentTitleInput.value);
		
		$(segmentTitle).toggle();
		$(segmentTitleInput).toggle();
	});
	
	$("#buildColumn").on("click", ".buildSegment .removeSegmentButton", function()
	{
		$(this).parent().remove();
	});
});


function createSegment()
{
	$("<div class='buildSegment'> \
		<h3>Early Game</h3><input type='text' style='display:none'><input type='button' class='editSegmentTitleButton' value='edit'><input type='button' class='removeSegmentButton' value='X'> \
		<div class='itemGrid'> \
		</div> \
	</div>").insertBefore("#newSegmentButton");
	
	$(".itemGrid").sortable(
	{
		connectWith: ".itemGrid"
	});
}