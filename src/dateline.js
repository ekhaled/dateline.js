(function(){
	
	//inlineCalendar.prototype.=function(){}
	
	var inlineCalendar=window.inlineCalendar=function(opts){
		this.monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	    this.days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
		this.daysShort = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
	    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	    this.dayNumbers = {"sunday": 0,"monday": 1,"tuesday": 2,"wednesday": 3,"thursday": 4,"friday": 5,"saturday": 6
	    };
		this.eventHotspots=[];
	};
	
	inlineCalendar.prototype.init=function(opts){
		//options
		opts=opts||[];
		this.startX=opts.startX||10;
		this.startY=opts.startY||10;
		this.spacing=opts.spacing||5;
		this.boxHeight=opts.boxHeight||41;
		this.boxWidth=opts.boxWidth||22;
		this.cornerRadius=opts.cornerRadius||5;
		
		this.boxColor=opts.boxColor||"rgba(0,0,0,0.5)";
		this.boxFont=opts.boxFont||"8pt Lucida Grande,Tahoma,Arial";
		this.boxTextAlign=opts.boxTextAlign||"center";
		
		this.textColor=opts.textColor||"rgba(255,255,255,1)";
		
		this.boxSeparator=(typeof opts.boxSeparator != "undefined")?opts.boxSeperator:true;
		this.boxSeparatorColor=opts.boxSeparatorColor||"rgba(255,255,255,1)";
		
		this.connectorLine=(typeof opts.connectorLine !="undefined")?opts.connectorLine:true;
		this.connectorColor=opts.connectorColor||"rgba(255,255,255,1)";
		
		this.textShadow=(typeof opts.textShadow !="undefined")?opts.textShadow:true;
		this.textShadowOffsetX = opts.textShadowOffsetX||0;
		this.textShadowOffsetY = opts.textShadowOffsetY||1;
		this.textShadowBlur = opts.textShadowBlur||0; 
		this.textShadowColor = opts.textShadowColor||"#5e5e5e";
		
		this.showMonthName=(typeof opts.showMonthName !="undefined")?opts.showMonthName:true;
		this.monthNameOnTop=(typeof opts.monthNameOnTop !="undefined")?opts.monthNameOnTop:true;
		this.monthNameAlign=opts.monthNameAlign||"left";
		
			//Today styles
		this.todayBoxColor=opts.todayBoxColor||this.boxColor;
		this.todayBoxSeparatorColor=opts.todayBoxSeparatorColor||this.boxSeparatorColor;
		this.todayBoxFont=opts.todayBoxFont||this.boxFont;
		this.todayTextColor=opts.todayTextColor||this.textColor;
			//END Today styles
			//style days with events
		this.eventedBoxColor=opts.eventedBoxColor||this.boxColor;
		this.eventedBoxSeparatorColor=opts.eventedBoxSeparatorColor||this.boxSeparatorColor;
		this.eventedBoxFont=opts.eventedBoxFont||this.boxFont;
		this.eventedTextColor=opts.eventedTextColor||this.textColor;	
			//END style days with events
		
		this.events=opts.events||[];
		this.callBack=opts.callBack||opts.callback||function(){};
		this.date = opts.date||new Date();
		if(opts.canvas){
			this.canvas=opts.canvas;
		}else{
			throw new Error("Please supply a canvas element to draw on...");
		}
		if("getContext" in this.canvas){
			this.primaryContext=this.canvas.getContext("2d");
		}else{
			throw new Error("Canvas does not support 2d context");
		}
		
		
		
		this.draw();
		
		var _this=this;
		this.canvas.onclick=null;
		this.canvas.onclick=function(event){
			_this.handleClicks(event);
		};
	};
	
	//-----------DATE CALCs
	inlineCalendar.prototype.monthDetail=function(){
		var res=[];
		var numDays=this.daysInMonth(this.date);
		var fDay=this.firstDayOfMonth(this.date);
		
		var y=this.date.getFullYear();
		var m=this.date.getMonth()+1;
		m=(m<10)?("0"+m):(m);
		for(var i=0;i<numDays;i++){
			var d=(i+1);
			d=(d<10)?("0"+d):(d);
			res.push({
				name:this.days[fDay],
				shortname:this.daysShort[fDay],
				num:(((i+1)<10)?("0"+(i+1)):(i+1)),
				date:y+"-"+m+"-"+d
			});
			fDay = (fDay == 6) ? 0: ++fDay;
		}
		return res;
	};
	inlineCalendar.prototype.daysInMonth=function(date){
		var month = date.getMonth();
        if (month == 1) {
			var isLeap=(parseInt(date.getFullYear(),10)%4==0);
            if (isLeap){
				return 29;
			}else{
				return 28;
			}
        }else{
			return this.monthLengths[month];
		}
	};
	inlineCalendar.prototype.firstDayOfMonth=function(date){
		var _temp=date.getDate();
		date.setDate(1);
		var _temp2=date.getDay();
		date.setDate(_temp);
		return _temp2;
	};
	inlineCalendar.prototype.isToday=function(num){
		td=new Date();
		var m=this.date.getMonth();
		var y=this.date.getFullYear();
		return (td.getDate()==num && td.getFullYear()==y && td.getMonth()==m);	
	};	
	inlineCalendar.prototype.nextMonth=function(){
		this.date.setMonth(this.date.getMonth() + 1);
	};
	inlineCalendar.prototype.prevMonth=function(){
		this.date.setMonth(this.date.getMonth() - 1);
	};
	inlineCalendar.prototype.nextYear=function(){
		this.date.setYear(this.date.getFullYear() + 1);
	};
	inlineCalendar.prototype.prevYear=function(){
		this.date.setYear(this.date.getFullYear() - 1);
	};
	//-----------END DATE CALCs
	
	
	//-----------DRAWINGS
	inlineCalendar.prototype.draw=function(){
		this.eventHotspots=[]; //empty out event hotspots
		var md=this.monthDetail();
		
		var startX=this.startX;
		var startY=this.startY;
		var spacing=this.spacing;
		var boxWidth=this.boxWidth;
		var boxHeight=this.boxHeight;
		var cornerRadius=this.cornerRadius;
		var totalWidth=(spacing+boxWidth)*md.length;
		
		if(this.showMonthName){
			//clear canvas
			this.primaryContext.clearRect(startX,startY,(spacing+boxWidth)*31,boxHeight+21);
			
			if(this.monthNameOnTop){
				mnstY=startY;
				startY=startY+20;
			}else{
				mnstY=startY+boxHeight+4;
			}
			
			var mnstX=startX;
			switch(this.monthNameAlign){
				case "center":
					mnstX=((totalWidth+spacing)/2)-45;
				break;
				case "right":
					mnstX=(totalWidth+spacing)-90;
				break;
			}
			
			this.drawMonthName(mnstX,mnstY,90,17,cornerRadius,this.months[this.date.getMonth()]+" "+this.date.getFullYear());
			
		}else{
			//clear canvas
			this.primaryContext.clearRect(startX,startY,(spacing+boxWidth)*31,boxHeight);
		}
		
		
		
		if(this.connectorLine){
			this.drawConnectorLine(startX,startY+(boxHeight/2),totalWidth);
		}
		for(var i=0;i<md.length;i++){
			this.drawMonthBox(startX+(i*(spacing+boxWidth)),
				startY,
				boxWidth,
				boxHeight,cornerRadius,
				md[i]
				);
		}
	};
	inlineCalendar.prototype.drawMonthName=function(x,y,width,height,radius,text){
		var ctx=this.primaryContext;
		ctx.save();
		
		ctx.fillStyle=this.boxColor;
		ctx.beginPath();  
		ctx.moveTo(x,y+radius);  
		ctx.lineTo(x,y+height-radius);  
		ctx.quadraticCurveTo(x,y+height,x+radius,y+height);  
		ctx.lineTo(x+width-radius,y+height);  
		ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);  
		ctx.lineTo(x+width,y+radius);  
		ctx.quadraticCurveTo(x+width,y,x+width-radius,y);  
		ctx.lineTo(x+radius,y);  
		ctx.quadraticCurveTo(x,y,x,y+radius);  
		ctx.fill();
		
		if(this.textShadow){
			ctx.shadowOffsetX = this.textShadowOffsetX;  
			ctx.shadowOffsetY = this.textShadowOffsetY;  
			ctx.shadowBlur = this.textShadowBlur;  
			ctx.shadowColor = this.textShadowColor;
		}
		

		ctx.font=this.boxFont;
		ctx.textAlign=this.boxTextAlign;
		ctx.fillStyle = this.textColor;
		  
		ctx.fillText(text, x+(width/2), y+12,width);
		
		ctx.restore();
	};
	inlineCalendar.prototype.drawMonthBox=function(x,y,width,height,radius,day){
		var ctx=this.primaryContext;
		
		var notToday=!this.isToday(day.num);
		var hasEvent=false;
		if(day.date in this.events){
			hasEvent=true;
		}
		//box
		ctx.fillStyle=notToday?this.boxColor:this.todayBoxColor;
		ctx.fillStyle=hasEvent?this.eventedBoxColor:ctx.fillStyle; 
		 
		ctx.beginPath();  
		ctx.moveTo(x,y+radius);  
		ctx.lineTo(x,y+height-radius);  
		ctx.quadraticCurveTo(x,y+height,x+radius,y+height);  
		ctx.lineTo(x+width-radius,y+height);  
		ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);  
		ctx.lineTo(x+width,y+radius);  
		ctx.quadraticCurveTo(x+width,y,x+width-radius,y);  
		ctx.lineTo(x+radius,y);  
		ctx.quadraticCurveTo(x,y,x,y+radius);  
		ctx.fill();
		//box seperator
		if(this.boxSeparator){
			var bsc=notToday?this.boxSeparatorColor:this.todayBoxSeparatorColor;
			bsc=hasEvent?this.eventedBoxSeparatorColor:bsc;
			ctx.strokeStyle=ctx.fillStyle=bsc;
			ctx.beginPath();  
			ctx.moveTo(x,y+((height/2)-0)); 
			ctx.lineTo(x+((width/2)-2),y+((height/2)-0));
			ctx.lineTo(x+(width/2),y+((height/2)-2));
			ctx.lineTo(x+((width/2)+2),y+((height/2)-0));  
			ctx.lineTo(x+width,y+((height/2)-0));

			ctx.lineTo(x+width,y+((height/2)+0));
			ctx.lineTo(x+((width/2)+2),y+((height/2)+0));
			ctx.lineTo(x+(width/2),y+((height/2)+2));  
			ctx.lineTo(x+((width/2)-2),y+((height/2)+0));
			ctx.lineTo(x,y+((height/2)+0));
			ctx.lineTo(x,y+((height/2)-0));

			ctx.stroke();
			ctx.fill();
			
			if(!notToday){
				ctx.fillRect(x+((width/2)-3),y+((height/2)-3),6,6);
			}
			
		}
		//text
		ctx.save();
		if(this.textShadow){
			ctx.shadowOffsetX = this.textShadowOffsetX;  
			ctx.shadowOffsetY = this.textShadowOffsetY;  
			ctx.shadowBlur = this.textShadowBlur;  
			ctx.shadowColor = this.textShadowColor;
		}
		
		var fnt=notToday?this.boxFont:this.todayBoxFont;
		fnt=hasEvent?this.eventedBoxFont:fnt;
		ctx.font=fnt;
		
		ctx.textAlign=this.boxTextAlign;
		
		var tfl=notToday?this.textColor:this.todayTextColor;
		tfl=hasEvent?this.eventedTextColor:tfl;
		ctx.fillStyle = tfl
		  
		ctx.fillText(day.shortname, x+(width/2), y+12,width);
		ctx.fillText(day.num, x+(width/2), y+(height-4),width);
		ctx.restore();
		
		//add this day to hotspots stack
		this.eventHotspots.push({x:x,y:y,width:width,height:height,day:day});
		
	};
	inlineCalendar.prototype.drawConnectorLine=function(x,y,length){
		var ctx=this.primaryContext;
		ctx.save();
		ctx.strokeStyle=this.connectorColor;
		ctx.moveTo(x,y);
		ctx.lineTo(length,y);
		ctx.stroke();
		ctx.restore();
	};
	//-----------END DRAWINGS
	
	
	//EVENTS
	inlineCalendar.prototype.getCoords=function(e){
		if(window.jQuery){
			var offset=$(this.canvas).offset();
			return {x:(e.clientX-offset.left),y:(e.clientY-offset.top)};
		}else{
			var elem = this.canvas,
			box=elem.getBoundingClientRect(),
			doc = elem.ownerDocument,
	        body = doc.body,
	        docElem = doc.documentElement,

			clientTop = docElem.clientTop || body.clientTop || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,

			offsetTop = box.top + (this.canvas.pageYOffset || body.scrollTop) - clientTop,
			offsetLeft = box.left + (this.canvas.pageXOffset || body.scrollLeft) - clientLeft;

			return {x:(e.clientX-offsetLeft),y:(e.clientY-offsetTop)};
		}
		
	};
	inlineCalendar.prototype.handleClicks=function(e){
		var coords=this.getCoords(e);
		rects=this.eventHotspots;
		for ( var i = 0; i < rects.length; i++ ) {
		    var rect = rects[i];
		    if ( coords.x >= rect.x && coords.x <= rect.x + rect.width
		    &&   coords.y >= rect.y && coords.y <= rect.y + rect.height ) {
		        this.triggerCallback(rect.day);
		    }
		}
	};
	inlineCalendar.prototype.triggerCallback=function(day){
		this.callBack.call(this,day);
	};
	//END EVENTS
	
})();