/**
Copyright (c) 2010 http://www.ekhaled.co.uk/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**/
(function(){
		
	var inlineCalendar=window.inlineCalendar=function(opts){
		this.monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	    this.days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
		this.daysShort = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
	    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	    this.dayNumbers = {"sunday": 0,"monday": 1,"tuesday": 2,"wednesday": 3,"thursday": 4,"friday": 5,"saturday": 6
	    };
		this.eventHotspots=[];
		this.navHotspots=[];
		
		//-----------DATE CALCs
		this.monthDetail=function(){
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
		this.daysInMonth=function(date){
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
		this.firstDayOfMonth=function(date){
			var _temp=date.getDate();
			date.setDate(1);
			var _temp2=date.getDay();
			date.setDate(_temp);
			return _temp2;
		};
		this.isToday=function(num){
			td=new Date();
			var m=this.date.getMonth();
			var y=this.date.getFullYear();
			return (td.getDate()==num && td.getFullYear()==y && td.getMonth()==m);	
		};		
		this.nextMonth=function(e){
			this.date.setMonth(this.date.getMonth() + 1);
			this.callBacks["onNavigate"].call(this,this.date,e);
			this.callBacks["onNextMonth"].call(this,this.date,e);
			this.draw();
		};
		this.prevMonth=function(e){
			this.date.setMonth(this.date.getMonth() - 1);
			this.callBacks["onNavigate"].call(this,this.date,e);
			this.callBacks["onPrevMonth"].call(this,this.date,e);
			this.draw();
		};
		this.nextYear=function(e){
			this.date.setYear(this.date.getFullYear() + 1);
			this.callBacks["onNavigate"].call(this,this.date,e);
			this.callBacks["onNextYear"].call(this,this.date,e);
			this.draw();
		};
		this.prevYear=function(e){
			this.date.setYear(this.date.getFullYear() - 1);
			this.callBacks["onNavigate"].call(this,this.date,e);
			this.callBacks["onPrevYear"].call(this,this.date,e);
			this.draw();
		};
		this.now=function(e){
			td=new Date();
			this.date=td;
			this.callBacks["onNavigate"].call(this,this.date,e);
			this.callBacks["onNow"].call(this,this.date,e);
			this.draw();
		};
		//-----------END DATE CALCs
		
		//-----------DRAWINGS
		this.draw=function(){
			this.eventHotspots=[];this.navHotspots=[]; //empty out event hotspots
			var md=this.monthDetail();
			
			var align=this.align;
			var startX=this.startX;
			var startY=this.startY;
			var spacing=this.spacing;
			var boxWidth=this.boxWidth;
			var boxHeight=this.boxHeight;
			var cornerRadius=this.cornerRadius;
			var totalWidth=(spacing+boxWidth)*md.length;
			var longestWidth=((spacing+boxWidth)*31)+spacing;
			
			var _startX=startX; //remember this for clearRect in next step
			if(align=="center" || align=="right"){
				
				switch (align){
					case "center":
						startX=startX+(longestWidth-totalWidth)/2;
					break;
					case "right":
						startX=startX+(longestWidth-totalWidth);
					break;
				}				
			}
			
			

			if(this.showMonthName){
				//clear canvas
				this.primaryContext.clearRect(_startX,startY,(spacing+boxWidth)*31,boxHeight+21);

				if(this.monthNameOnTop){
					mnstY=startY;
					startY=startY+20;
				}else{
					mnstY=startY+boxHeight+4;
				}

				var mnstX=startX;
				switch(this.monthNameAlign){
					case "center":
						mnstX=((longestWidth)/2)-45;
					break;
					case "right":
						mnstX=(totalWidth+spacing)-90;
					break;
				}

				this.drawMonthName(mnstX,mnstY,90,17,cornerRadius,this.months[this.date.getMonth()]+" "+this.date.getFullYear());

			}else{
				//clear canvas
				this.primaryContext.clearRect(_startX,startY,(spacing+boxWidth)*31,boxHeight);
			}
			
			if(this.showControls){
				this.drawControls((totalWidth+spacing)-117,mnstY);
			}
			
			if(this.connectorLine){
				this.drawConnectorLine(startX,startY+(boxHeight/2),totalWidth+spacing);
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
		this.drawControls=function(startX,startY){
			var ctx=this.primaryContext;
			
			//nav buttons Background
			ctx.fillStyle = this.boxColor;
			roundedRect(ctx,0+startX,0+startY,17,117,4);
			ctx.fill();
			
			
			ctx.save();			
			//*prev Year
		    ctx.fillStyle = "#FFFFFF";
		    ctx.beginPath();
		    ctx.moveTo(15.99+startX, 2+startY);
		    ctx.lineTo(5.95+startX, 8.44+startY);
		    ctx.lineTo(16.02+startX, 15.01+startY);
		    ctx.closePath();
		    ctx.fill();
		    ctx.beginPath();
		    ctx.moveTo(23.98+startX, 2+startY);
		    ctx.lineTo(13.94+startX, 8.44+startY);
		    ctx.lineTo(24.01+startX, 15.01+startY);
		    ctx.closePath();
		    ctx.fill();
			ctx.restore();
			this.navHotspots.push({x:startX,y:startY,width:27,height:17,type:"prevYear"});
			//*/
			startX+=27;
			
			//*prev Month
			ctx.save();
			ctx.fillStyle = "#FFFFFF";
			ctx.beginPath();
		    ctx.moveTo(15.02+startX, 2+startY);
		    ctx.lineTo(5.02+startX, 8.44+startY);
		    ctx.lineTo(15.02+startX, 15.01+startY);
		    ctx.closePath();
		    ctx.fill();
			ctx.restore();
			this.navHotspots.push({x:startX,y:startY,width:20,height:17,type:"prevMonth"});
			//*/
			startX+=19.99;
			//*now
			ctx.save();
			ctx.fillStyle = "#FFFFFF";
			ctx.fillRect(5+startX, 2+startY, 13, 13);
			ctx.restore();
			this.navHotspots.push({x:startX,y:startY,width:23,height:17,type:"now"});
			//*/
			startX+=22.9;//82.37;
			//*next month
			ctx.save();
			ctx.fillStyle = "#FFFFFF";
			ctx.beginPath();
		    ctx.moveTo(4.98+startX, 2+startY);
		    ctx.lineTo(14.98+startX, 8.44+startY);
		    ctx.lineTo(4.98+startX, 15.01+startY);
		    ctx.closePath();
		    ctx.fill();
			ctx.restore();
			this.navHotspots.push({x:startX,y:startY,width:20,height:17,type:"nextMonth"});
			//*/
			startX+=19.92;//102.29;
			//*next Year
			ctx.save();
		    ctx.fillStyle = "#FFFFFF";
		    ctx.beginPath();
		    ctx.moveTo(11.01+startX, 2+startY);
		    ctx.lineTo(21.06+startX, 8.44+startY);
		    ctx.lineTo(10.98+startX, 15.01+startY);
		    ctx.closePath();
		    ctx.fill();
		    ctx.beginPath();
		    ctx.moveTo(3.02+startX, 2+startY);
		    ctx.lineTo(13.06+startX, 8.44+startY);
		    ctx.lineTo(2.99+startX, 15.01+startY);
		    ctx.closePath();
		    ctx.fill();
			ctx.restore();
			this.navHotspots.push({x:startX,y:startY,width:27,height:17,type:"nextYear"});
			//*/
		};
		this.drawMonthName=function(x,y,width,height,radius,text){
			var ctx=this.primaryContext;
			ctx.save();

			ctx.fillStyle=this.boxColor;
			roundedRect(ctx,x,y,height,width,radius);
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
		this.drawMonthBox=function(x,y,width,height,radius,day){
			var ctx=this.primaryContext;
			
			var notToday=!this.isToday(day.num);
			var hasEvent=false;
			if(day.date in this.events){
				hasEvent=true;
				day.events=this.events[day.date];
			}
			//box
			ctx.fillStyle=notToday?this.boxColor:this.todayBoxColor;
			ctx.fillStyle=hasEvent?this.eventedBoxColor:ctx.fillStyle; 

			roundedRect(ctx,x,y,height,width,radius); 
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
				ctx.closePath();
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
			ctx.fillStyle = tfl;

			ctx.fillText(day.shortname, x+(width/2), y+12,width);
			ctx.fillText(day.num, x+(width/2), y+(height-4),width);
			ctx.restore();

			//add this day to hotspots stack
			this.eventHotspots.push({x:x,y:y,width:width,height:height,day:day});

		};
		this.drawConnectorLine=function(x,y,length){
			var ctx=this.primaryContext;
			ctx.save();
			ctx.strokeStyle=this.connectorColor;
			ctx.moveTo(x,y);
			ctx.lineTo(length,y);
			ctx.stroke();
			ctx.restore();
		};
		
		/*private*/function roundedRect(ctx,x,y,height,width,radius,corners){
			corners=corners||[1,1,1,1];
			ctx.beginPath();  
			ctx.moveTo(x,y+radius); 
			if(corners[3]!==1){
				ctx.lineTo(x,y+height);
			}else{
				ctx.lineTo(x,y+height-radius);  
				ctx.quadraticCurveTo(x,y+height,x+radius,y+height);
			}  
			if(corners[2]!==1){
				ctx.lineTo(x+width,y+height);
			}else{
				ctx.lineTo(x+width-radius,y+height);  
				ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);	
			}
			if(corners[1]!==1){
				ctx.lineTo(x+width,y);
			}else{
				ctx.lineTo(x+width,y+radius);  
				ctx.quadraticCurveTo(x+width,y,x+width-radius,y);
			}
			if(corners[0]!==1){
				ctx.lineTo(x,y);
			}else{
				ctx.lineTo(x+radius,y);  
				ctx.quadraticCurveTo(x,y,x,y+radius);
			} 
			ctx.closePath();
		}
		//-----------END DRAWINGS
		
		//-----------EVENTS
		this.getCoords=function(e){
			if(typeof window.jQuery !== "undefined"){
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
		this.handleClicks=function(e){
			var coords=this.getCoords(e);
			rects=this.eventHotspots;
			for ( var i = 0; i < rects.length; i++ ) {
			    var rect = rects[i];
			    if ( coords.x >= rect.x && coords.x <= rect.x + rect.width
			    &&   coords.y >= rect.y && coords.y <= rect.y + rect.height ) {
			        this.callBacks["onEvent"].call(this,rect,e);
					return;
			    }
			}
			
			rects=this.navHotspots;
			for ( var i = 0; i < rects.length; i++ ) {
			    var rect = rects[i];
			    if ( coords.x >= rect.x && coords.x <= rect.x + rect.width
			    &&   coords.y >= rect.y && coords.y <= rect.y + rect.height ) {
					this[rect["type"]].call(this,e);
					return;
			    }
			}
		};
		//-----------END EVENTS
		
		
	};
	
	inlineCalendar.prototype.init=function(opts){
		//options
		opts=opts||{};
		this.align=opts.align||"left";
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
		
		this.boxSeparator=(typeof opts.boxSeparator !== "undefined")?opts.boxSeperator:true;
		this.boxSeparatorColor=opts.boxSeparatorColor||"rgba(255,255,255,1)";
		
		this.connectorLine=(typeof opts.connectorLine !== "undefined")?opts.connectorLine:true;
		this.connectorColor=opts.connectorColor||"rgba(255,255,255,1)";
		
		this.textShadow=(typeof opts.textShadow !== "undefined")?opts.textShadow:true;
		this.textShadowOffsetX = opts.textShadowOffsetX||0;
		this.textShadowOffsetY = opts.textShadowOffsetY||1;
		this.textShadowBlur = opts.textShadowBlur||0; 
		this.textShadowColor = opts.textShadowColor||"#5e5e5e";
		
		this.showMonthName=(typeof opts.showMonthName !== "undefined")?opts.showMonthName:true;
		this.monthNameOnTop=(typeof opts.monthNameOnTop !== "undefined")?opts.monthNameOnTop:true;
		this.monthNameAlign=opts.monthNameAlign||"left";
		
			//Today styles
		this.todayBoxColor=opts.todayBoxColor||"rgba(0,0,0,1)";
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
			//navigation controls
		this.showControls=(typeof opts.showControls !== "undefined")?opts.showControls:true;	
			//END navigation controls
		
		this.events=opts.events||{};
		
		//Callbacks
		this.callBacks={
			onEvent:function(){},
			onNavigate:function(){},
			onNextMonth:function(){},
			onPrevMonth:function(){},
			onNextYear:function(){},
			onPrevYear:function(){},
			onNow:function(){}
		};
		var _opts_call_backs=opts.callbacks || opts.callBacks || {};
		for(var handler in _opts_call_backs){
			if(handler in this.callBacks){
				this.callBacks[handler]=_opts_call_backs[handler];
			}
		}
		
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
	
	if(typeof window.jQuery !== "undefined"){
		jQuery.fn.inlineCalendar=function(opts,arg){
			var cn=this[0];
			if((typeof opts == "object") || (typeof opts == "undefined")){
				var ic=new inlineCalendar;
				var options=opts||{};
				options.canvas=cn;
				ic.init(options);
				//save the instance in the expando
				//so we can use it later
				$(cn).data("inlineCalendar",ic);
			}else if(typeof opts == "string"){
				var ic=$(cn).data("inlineCalendar");
				if(opts in ic){
					if(jQuery.isFunction(ic[opts])){
						ic[opts].apply(ic,Array.prototype.splice.call(arguments,1));
					}else{
						if(typeof arg !== "undefined"){
							ic[opts]=arg;
						}else{
							return ic[opts];
						}
					}	
				}
			}
		};
		
	}
	
})();