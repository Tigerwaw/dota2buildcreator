$(document).ready(function()
{
	/*
	for (let i = 0; i < 20; i++)
	{
		$("<div class='itemDraggable'><img width='64px' height='46px' class='itemImage' src='https://static.wikia.nocookie.net/dota2_gamepedia/images/f/fd/Tango_icon.png'></div>").appendTo('#itemColumn');
	}
	*/
	
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
	
	$(".itemDraggable").on("click", function()
	{
		console.log("tooltip");
	});
	
	$("#buildColumn").on("click", "div input[type='button']", function()
	{
		var segmentTitle = $(this).parent().children("h3")[0];
		var segmentTitleInput = $(this).parent().children("input[type='text']")[0];

		$(segmentTitleInput).attr("value", segmentTitle.textContent);
		$(segmentTitle).text(segmentTitleInput.value);
		
		$(segmentTitle).toggle();
		$(segmentTitleInput).toggle();
	});
});


function createSegment()
{
	$("<div class='buildSegment'> \
		<h3>Early Game</h3><input type='text' style='display:none'><input type='button' class='editSegmentTitleButton' value='edit'> \
		<div class='itemGrid'> \
		</div> \
	</div>").insertBefore("#newSegmentButton");
	
	$(".itemGrid").sortable(
	{
		connectWith: ".itemGrid"
	});
}