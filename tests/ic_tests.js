initObject={
	showControls:true,
	align:"center",
	todayTextColor:"rgb(0,255,0)",
	eventedBoxColor:"rgba(0,0,0,0.5)",
	eventedBoxSeparatorColor:"rgba(0,0,255,1)",
	eventedTextColor:"rgba(0,0,255,1)",
	events:{"2010-07-06":"Description","2010-08-08":"Description 2","2010-08-08":["Description 3","Another event"]},
	showMonthName:true,
	monthNameAlign:"center",
	callbacks:{
		onEvent:function(e){
			console.log(e);
		}
	}
};

$(document).ready(function(){
	module("Basic");
	test("The object exists",function(){

		equals("function",typeof window.inlineCalendar,"The object has been created and exits");
	});
	
	module("jQuery Less",{
		setup:function(){
			this.ic=new inlineCalendar;
			this.tempInit=initObject;
		}
	});

	test("canvas element exists",function(){

		equals(1,$("#canvas").length,"Canvas exists in HTML page");
	});
	
	
	test("has been instantiated",function(){

		equals("function",typeof this.ic.init,"Object instantiated");
		this.tempInit["canvas"]=document.getElementById("canvas");
		this.ic.init(this.tempInit);
		equals(this.tempInit["showControls"],this.ic.showControls,"");
		equals(this.tempInit["align"],this.ic.align,"");
		equals(this.tempInit["todayTextColor"],this.ic.todayTextColor,"");
		equals(this.tempInit["eventedBoxColor"],this.ic.eventedBoxColor,"");
		equals(this.tempInit["eventedBoxSeparatorColor"],this.ic.eventedBoxSeparatorColor,"");
		equals(this.tempInit["eventedTextColor"],this.ic.eventedTextColor,"");
		same(this.tempInit["events"],this.ic.events,"");
		equals(this.tempInit["showMonthName"],this.ic.showMonthName,"");
		equals(this.tempInit["monthNameAlign"],this.ic.monthNameAlign,"");
	});
	
	
	
	
	//===================
	
	module("With jQuery");

	test("canvas element exists",function(){

		equals(1,$("#jcanvas").length,"Canvas exists in HTML page");
		$("#jcanvas").inlineCalendar(initObject);
	});
	
	test("has been instantiated",function(){

		var obj=$("#jcanvas").data("inlineCalendar");
		equals("object",typeof obj,"Object instantiated");
		equals(initObject["showControls"],obj.showControls,"");
		equals(initObject["align"],obj.align,"");
		equals(initObject["todayTextColor"],obj.todayTextColor,"");
		equals(initObject["eventedBoxColor"],obj.eventedBoxColor,"");
		equals(initObject["eventedBoxSeparatorColor"],obj.eventedBoxSeparatorColor,"");
		equals(initObject["eventedTextColor"],obj.eventedTextColor,"");
		same(initObject["events"],obj.events,"");
		equals(initObject["showMonthName"],obj.showMonthName,"");
		equals(initObject["monthNameAlign"],obj.monthNameAlign,"");
	});
	
	test("getter functions test",function(){

		var obj=$("#jcanvas").data("inlineCalendar");
		equals("object",typeof obj,"Object instantiated");
		equals(initObject["showControls"],$("#jcanvas").inlineCalendar("showControls"),"");
		equals(initObject["align"],$("#jcanvas").inlineCalendar("align"),"");
		equals(initObject["todayTextColor"],$("#jcanvas").inlineCalendar("todayTextColor"),"");
		equals(initObject["eventedBoxColor"],$("#jcanvas").inlineCalendar("eventedBoxColor"),"");
		equals(initObject["eventedBoxSeparatorColor"],$("#jcanvas").inlineCalendar("eventedBoxSeparatorColor"),"");
		equals(initObject["eventedTextColor"],$("#jcanvas").inlineCalendar("eventedTextColor"),"");
		same(initObject["events"],$("#jcanvas").inlineCalendar("events"),"");
		equals(initObject["showMonthName"],$("#jcanvas").inlineCalendar("showMonthName"),"");
		equals(initObject["monthNameAlign"],$("#jcanvas").inlineCalendar("monthNameAlign"),"");
	});
	
	test("setter functions test",function(){

		var textColor="red";
		$("#jcanvas").inlineCalendar("textColor",textColor);
		equals("red",$("#jcanvas").inlineCalendar("textColor"),"Set textColor to red");
		$("#jcanvas").inlineCalendar("draw");
		
		var textShadow=false;
		$("#jcanvas").inlineCalendar("textShadow",textShadow);
		equals(false,$("#jcanvas").inlineCalendar("textShadow"),"Set textShadow to none");
		$("#jcanvas").inlineCalendar("draw");
		
		var boxSeparator=false;
		$("#jcanvas").inlineCalendar("boxSeparator",boxSeparator);
		equals(false,$("#jcanvas").inlineCalendar("boxSeparator"),"Set boxSeparator to none");
		$("#jcanvas").inlineCalendar("draw");
		
		var connectorColor="rgba(0,0,0,0.2)";
		$("#jcanvas").inlineCalendar("connectorColor",connectorColor);
		equals("rgba(0,0,0,0.2)",$("#jcanvas").inlineCalendar("connectorColor"),"Set connectorColor to rgba(0,0,0,0.2)");
		$("#jcanvas").inlineCalendar("draw");
		
		var monthNameAlign="left";
		$("#jcanvas").inlineCalendar("monthNameAlign",monthNameAlign);
		equals("left",$("#jcanvas").inlineCalendar("monthNameAlign"),"Set monthNameAlign to left");
		$("#jcanvas").inlineCalendar("draw");
	});
	
	test("method invocation tests",function(){

		var date=new Date();
		$("#jcanvas").inlineCalendar("nextMonth");
		equals((date.getMonth() + 1),$("#jcanvas").inlineCalendar("date").getMonth(),"Month is moved forward properly");
		$("#jcanvas").inlineCalendar("nextMonth");
		equals((date.getMonth() + 2),$("#jcanvas").inlineCalendar("date").getMonth(),"Month is moved forward properly x 2");
		$("#jcanvas").inlineCalendar("prevMonth");
		equals((date.getMonth() + 1),$("#jcanvas").inlineCalendar("date").getMonth(),"Month is moved backward properly");
		$("#jcanvas").inlineCalendar("prevMonth");
		equals((date.getMonth()),$("#jcanvas").inlineCalendar("date").getMonth(),"Month is moved backward properly x 2");
		
		$("#jcanvas").inlineCalendar("nextYear");
		equals((date.getFullYear() + 1),$("#jcanvas").inlineCalendar("date").getFullYear(),"Year is moved forward properly");
		$("#jcanvas").inlineCalendar("nextYear");
		equals((date.getFullYear() + 2),$("#jcanvas").inlineCalendar("date").getFullYear(),"Year is moved forward properly x 2");
		$("#jcanvas").inlineCalendar("prevYear");
		equals((date.getFullYear() + 1),$("#jcanvas").inlineCalendar("date").getFullYear(),"Year is moved backward properly");
		$("#jcanvas").inlineCalendar("prevYear");
		equals((date.getFullYear()),$("#jcanvas").inlineCalendar("date").getFullYear(),"Year is moved backward properly x 2");
		
		$("#jcanvas").inlineCalendar("nextYear");
		$("#jcanvas").inlineCalendar("nextMonth");
		equals((date.getFullYear()+1),$("#jcanvas").inlineCalendar("date").getFullYear(),"Year is moved backward properly");
		equals((date.getMonth() + 1),$("#jcanvas").inlineCalendar("date").getMonth(),"Month is moved forward properly");
		$("#jcanvas").inlineCalendar("now");
		equals(date.getMonth(),$("#jcanvas").inlineCalendar("date").getMonth(),"month moved back to present properly");
		equals(date.getFullYear(),$("#jcanvas").inlineCalendar("date").getFullYear(),"Year moved back to present properly");
		
	});
	
	
	
	
});

QUnit.log = function(result, message){  
	if (window.console && window.console.log){  
		window.console.log(result +' :: '+ message);  
	}
};