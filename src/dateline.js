/*!
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
	
	//COMMONLY USED STRINGS
	var s_align="align",s_startX="startX",s_startY="startY",s_spacing="spacing",s_boxHeight="boxHeight",s_boxWidth="boxWidth",s_cornerRadius="cornerRadius",s_boxFont="boxFont",s_textColor="textColor",s_boxTextAlign="boxTextAlign",s_boxColor="boxColor",s_boxSeparator="boxSeparator",s_boxSeparatorColor="boxSeparatorColor",s_connectorLine="connectorLine",s_connectorColor="connectorColor",s_textShadow="textShadow",s_textShadowOffsetX="textShadowOffsetX",s_textShadowOffsetY="textShadowOffsetY",s_textShadowBlur="textShadowBlur",s_textShadowColor="textShadowColor",s_todayBoxColor="todayBoxColor",s_todayBoxSeparatorColor="todayBoxSeparatorColor",s_todayBoxFont="todayBoxFont",s_todayTextColor="todayTextColor",s_eventedBoxColor="eventedBoxColor",s_eventedBoxSeparatorColor="eventedBoxSeparatorColor",s_eventedBoxFont="eventedBoxFont",s_eventedTextColor="eventedTextColor",s_showMonthName="showMonthName",s_monthNameHalign="monthNameHalign",s_monthNameValign="monthNameValign",s_showControls="showControls",s_controlsHalign="controlsHalign",s_controlsValign="controlsValign",s_white="#FFFFFF",s_undefined="undefined",s_top="top",s_center="center",s_right="right",s_left="left";

	//END COMMONLY USED STRINGS
		
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
			
			var align=this[s_align];
			var startX=this[s_startX];
			var startY=this[s_startY];
			var spacing=this[s_spacing];
			var boxWidth=this[s_boxWidth];
			var boxHeight=this[s_boxHeight];
			var cornerRadius=this[s_cornerRadius];
			var totalWidth=(spacing+boxWidth)*md.length;
			var longestWidth=((spacing+boxWidth)*31)+spacing;
			
			//clear Canvas
			this.primaryContext.clearRect(0,0,this.canvas.width,this.canvas.height);
			
			
			if(align==s_center || align==s_right){		
				switch (align){
					case s_center:
						startX=startX+(longestWidth-totalWidth)/2;
					break;
					case s_right:
						startX=startX+(longestWidth-totalWidth);
					break;
				}				
			}
			
			

			if(this[s_showMonthName]){
				if(this[s_monthNameValign]==s_top){
					mnstY=startY;
					startY=startY+20;
					var Added20=true;
				}else{
					if(this[s_showControls] && this[s_controlsValign]==s_top){
						mnstY=startY+boxHeight+4+20;
					}else{
						mnstY=startY+boxHeight+4;
					}
				}

				var mnstX=startX;
				switch(this[s_monthNameHalign]){
					case s_center:
						mnstX=((longestWidth)/2)-45;
					break;
					case s_right:
						mnstX=(startX+totalWidth)-90;
					break;
				}

				this.drawMonthName(mnstX,mnstY,90,17,cornerRadius,this.months[this.date.getMonth()]+" "+this.date.getFullYear());

			}
			
			if(this[s_showControls]){
				var cntX=startX,cntY=startY;
				if(this[s_controlsValign]==s_top){
					if(!Added20){
						cntY=startY;
						startY=startY+20;	
					}else{
						cntY=startY-20;
					}
				}else{
					cntY=startY+boxHeight+4;
				}
				switch(this[s_controlsHalign]){
					case s_center:
						cntX=((longestWidth)/2)-45;
					break;
					case s_right:
						cntX=(startX+totalWidth)-117;
					break;
				}
				
				this.drawControls(cntX,cntY);
			}
			
			if(this[s_connectorLine]){
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
			ctx.fillStyle = this[s_boxColor];
			roundedRect(ctx,0+startX,0+startY,17,117,4);
			ctx.fill();
			
			
			ctx.save();			
			//*prev Year
		    ctx.fillStyle = s_white;
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
			ctx.fillStyle = s_white;
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
			ctx.fillStyle = s_white;
			ctx.fillRect(5+startX, 2+startY, 13, 13);
			ctx.restore();
			this.navHotspots.push({x:startX,y:startY,width:23,height:17,type:"now"});
			//*/
			startX+=22.9;//82.37;
			//*next month
			ctx.save();
			ctx.fillStyle = s_white;
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
		    ctx.fillStyle = s_white;
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

			ctx.fillStyle=this[s_boxColor];
			roundedRect(ctx,x,y,height,width,radius);
			ctx.fill();

			if(this[s_textShadow]){
				ctx.shadowOffsetX = this[s_textShadowOffsetX];  
				ctx.shadowOffsetY = this[s_textShadowOffsetY];  
				ctx.shadowBlur = this[s_textShadowBlur];  
				ctx.shadowColor = this[s_textShadowColor];
			}
			ctx.font=this[s_boxFont];
			ctx.textAlign=this[s_boxTextAlign];
			ctx.fillStyle = this[s_textColor];
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
			ctx.fillStyle=notToday?this[s_boxColor]:this[s_todayBoxColor];
			ctx.fillStyle=hasEvent?this[s_eventedBoxColor]:ctx.fillStyle; 

			roundedRect(ctx,x,y,height,width,radius); 
			ctx.fill();
			//box seperator
			if(this[s_boxSeparator]){
				var bsc=notToday?this[s_boxSeparatorColor]:this[s_todayBoxSeparatorColor];
				bsc=hasEvent?this[s_eventedBoxSeparatorColor]:bsc;
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
			if(this[s_textShadow]){
				ctx.shadowOffsetX = this[s_textShadowOffsetX];  
				ctx.shadowOffsetY = this[s_textShadowOffsetY];  
				ctx.shadowBlur = this[s_textShadowBlur];  
				ctx.shadowColor = this[s_textShadowColor];
			}

			var fnt=notToday?this[s_boxFont]:this[s_todayBoxFont];
			fnt=hasEvent?this[s_eventedBoxFont]:fnt;
			ctx.font=fnt;

			ctx.textAlign=this[s_boxTextAlign];

			var tfl=notToday?this[s_textColor]:this[s_todayTextColor];
			tfl=hasEvent?this[s_eventedTextColor]:tfl;
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
			ctx.strokeStyle=this[s_connectorColor];
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
			if(typeof window.jQuery !== s_undefined){
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
		this[s_align]=opts[s_align]||s_left;
		this[s_startX]=opts[s_startX]||10;
		this[s_startY]=opts[s_startY]||10;
		this[s_spacing]=opts[s_spacing]||5;
		this[s_boxHeight]=opts[s_boxHeight]||41;
		this[s_boxWidth]=opts[s_boxWidth]||20;
		this[s_cornerRadius]=opts[s_cornerRadius]||5;
		
		this[s_boxColor]=opts[s_boxColor]||"rgba(0,0,0,0.5)";
		this[s_boxFont]=opts[s_boxFont]||"8pt Lucida Grande,Tahoma,Arial";
		this[s_boxTextAlign]=opts[s_boxTextAlign]||s_center;
		
		this[s_textColor]=opts[s_textColor]||s_white;
		
		this[s_boxSeparator]=(typeof opts[s_boxSeparator] !== s_undefined)?opts[s_boxSeparator]:true;
		this[s_boxSeparatorColor]=opts[s_boxSeparatorColor]||s_white;
		
		this[s_connectorLine]=(typeof opts[s_connectorLine] !== s_undefined)?opts[s_connectorLine]:true;
		this[s_connectorColor]=opts[s_connectorColor]||s_white;
		
		this[s_textShadow]=(typeof opts[s_textShadow] !== s_undefined)?opts[s_textShadow]:true;
		this[s_textShadowOffsetX] = opts[s_textShadowOffsetX]||0;
		this[s_textShadowOffsetY] = opts[s_textShadowOffsetY]||1;
		this[s_textShadowBlur] = opts[s_textShadowBlur]||0; 
		this[s_textShadowColor] = opts[s_textShadowColor]||"#5e5e5e";
		
		this[s_showMonthName]=(typeof opts[s_showMonthName] !== s_undefined)?opts[s_showMonthName]:true;
		this[s_monthNameValign]=opts[s_monthNameValign]||s_top;
		this[s_monthNameHalign]=opts[s_monthNameHalign]||s_left;
		
			//Today styles
		this[s_todayBoxColor]=opts[s_todayBoxColor]||"rgba(0,0,0,1)";
		this[s_todayBoxSeparatorColor]=opts[s_todayBoxSeparatorColor]||this[s_boxSeparatorColor];
		this[s_todayBoxFont]=opts[s_todayBoxFont]||this[s_boxFont];
		this[s_todayTextColor]=opts[s_todayTextColor]||this[s_textColor];
			//END Today styles
			//style days with events
		this[s_eventedBoxColor]=opts[s_eventedBoxColor]||this[s_boxColor];
		this[s_eventedBoxSeparatorColor]=opts[s_eventedBoxSeparatorColor]||this[s_boxSeparatorColor];
		this[s_eventedBoxFont]=opts[s_eventedBoxFont]||this[s_boxFont];
		this[s_eventedTextColor]=opts[s_eventedTextColor]||this[s_textColor];	
			//END style days with events
			//navigation controls
		this[s_showControls]=(typeof opts[s_showControls] !== s_undefined)?opts[s_showControls]:true;
		this[s_controlsValign]=opts[s_controlsValign]||s_top;
		this[s_controlsHalign]=opts[s_controlsHalign]||s_right;	
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
	
	if(typeof window.jQuery !== s_undefined){
		jQuery.fn.inlineCalendar=function(opts,arg){
			var cn=this[0];
			if((typeof opts == "object") || (typeof opts == s_undefined)){
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
						if(typeof arg !== s_undefined){
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