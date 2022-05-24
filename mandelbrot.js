// Add:
// mini julia set viewer for mouseover C coordinates
// panner/zoomer

var canvas = document.getElementById("canvas");
var overlay_canvas = document.getElementById("overlay_canvas");
var jcanvas = document.getElementById("julia_viewer");
var joverlay = document.getElementById("julia_overlay");
var ctx = canvas.getContext("2d");
var ctx2 = overlay_canvas.getContext("2d");
var jctx = jcanvas.getContext("2d");
var jctx2 = joverlay.getContext("2d");
var usrCnt = 8, usrCntMlt=1, usrCntAdd = 1;

//Margin (top, right, bottom, left), width, height
// var m = [50, 50, 50, 50],
var m = [0, 0, 0, 0],

    w = canvas.width - m[1] - m[3],
    h = canvas.height - m[0] - m[2];

var moveX = 0.0, moveY = 0.0, zoom = 1.0;
var xmin = -2, xmax = 2, ymin = -1.5, ymax = 1.5;
var bw=true, invert_cntr=0, boxcolor="red";



var jzoom=1, jmoveX=0, jmoveY=0, jIter = 100;
var dragStartX, dragStartY, dragEndX, dragEndY, ymid, dY_2, mousedown, x1, y1, x2, y2, x3, y3, oomzoom=100;
var jdragStartX, jdragStartY, jdragEndX, jdragEndY, jmousedown;
//click and drag box to zoom
overlay_canvas.addEventListener('mousedown', function() {
		var rect = canvas.getBoundingClientRect();
		mousedown = true;
 		x1 = event.clientX - rect.left,
        y1 = event.clientY - rect.top;
        c = canvas_to_xy([x1,y1], xmin, xmax, ymin, ymax, canvas);
        dragStartX = c[0];
        dragStartY= c[1];
	}, false);
	
overlay_canvas.addEventListener('mouseout', function() {
		ctx2.clearRect(0,0,canvas.width,canvas.height);
		mousedown = false;
	}, false);
	
overlay_canvas.addEventListener('keydown', function() {
		if(event.keyCode==27){
		ctx2.clearRect(0,0,canvas.width,canvas.height);
		mousedown = false;
	}});

overlay_canvas.addEventListener('mousemove', function(){
		var rect = canvas.getBoundingClientRect();
		x2 = parseInt(event.clientX - rect.left);
		y2 = parseInt(event.clientY - rect.top)
		if(mousedown){
			ctx2.clearRect(0,0,canvas.width,canvas.height);
		
			ctx2.beginPath();
			var wdth = x2 - x1,
				hght = y2 - y1;
// 				hght = wdth*-3/4;
			ctx2.strokeStyle = boxcolor;
			ctx2.lindeWidth = 5;
			ctx2.strokeRect(x1, y1, wdth, hght);
		}
		if(jbool){
			jctx.clearRect(0,0,jcanvas.width,jcanvas.height);
        	c = canvas_to_xy([x2,y2], xmin, xmax, ymin, ymax, jcanvas);
			draw_julia_set(c[0],c[1], jmoveX, jmoveY, jzoom);
		}
});

overlay_canvas.addEventListener('mouseup', function() {
		ctx2.clearRect(0,0,canvas.width,canvas.height);
		var rect = canvas.getBoundingClientRect();
		mousedown = false;
 		x3 = event.clientX - rect.left,
        y3 = event.clientY - rect.top;
        c = canvas_to_xy([x3,y3], xmin, xmax, ymin, ymax, canvas);
        dragEndX = c[0];
        dragEndY= c[1];
        
        if(dragEndX != dragStartX || dragEndY != dragStartY){
        moveY = (Math.min(dragEndY,dragStartY)+Math.max(dragEndY,dragStartY))/2
        moveX = (Math.max(dragStartX, dragEndX) + Math.min(dragStartX, dragEndX)) / 2
        zoom = 4 / (Math.max(dragStartY, dragEndY) - Math.min(dragStartY, dragEndY))		
		oomzoom = 100*OOM(zoom);
		document.getElementById("Xtxt").value = Math.round(moveX*oomzoom)/oomzoom;
		document.getElementById("Ytxt").value = Math.round(moveY*oomzoom)/oomzoom;
		document.getElementById("zoomtxt").value = zoom.toFixed(1);
        
		draw_mandelbrot_set(xmin, xmax, ymin, ymax);  
		}    
	}, false);
	
	
// Julia zoom
joverlay.addEventListener('mousedown', function() {
		var jrect = jcanvas.getBoundingClientRect();
		jmousedown = true;
 		x1 = event.clientX - jrect.left,
        y1 = event.clientY - jrect.top;
        c = jcanvas_to_xy([x1,y1], xmin, xmax, ymin, ymax, jcanvas);
        jdragStartX = c[0];
        jdragStartY= c[1];
	}, false);
joverlay.addEventListener('mousemove', function(){
// 		jbool == false? jbool = true : jbool = false;  
		var jrect = joverlay.getBoundingClientRect();
		x2 = parseInt(event.clientX - jrect.left);
		y2 = parseInt(event.clientY - jrect.top)
		if(jmousedown){
			jctx2.clearRect(0,0,jcanvas.width,jcanvas.height);
			jctx2.beginPath();
			var jwdth = x2 - x1,
				jhght = y2 - y1;
			jctx2.strokeStyle = "red";
			jctx2.lindeWidth = 5;
			jctx2.strokeRect(x1, y1, jwdth, jhght);
		}
});
joverlay.addEventListener('mouseup', function() {
		jctx2.clearRect(0,0,jcanvas.width,jcanvas.height);
		var jrect = jcanvas.getBoundingClientRect();
		jmousedown = false;
 		x3 = event.clientX - jrect.left,
        y3 = event.clientY - jrect.top;
        c = canvas_to_xy([x3,y3], xmin, xmax, ymin, ymax, jcanvas);
        jdragEndX = c[0];
        jdragEndY= c[1];
        
        if(jdragEndX != jdragStartX || jdragEndY != jdragStartY){
        jmoveY = (Math.min(jdragEndY,jdragStartY)+Math.max(jdragEndY,jdragStartY))/2
        jmoveX = (Math.max(jdragStartX, jdragEndX) + Math.min(jdragStartX, jdragEndX)) / 2
        jzoom = 4 / (Math.max(jdragStartX, jdragEndX) - Math.min(jdragStartX, jdragEndX))
        
		draw_julia_set(c[0],c[1], jmoveX, jmoveY, jzoom);
		}    
	}, false);

// click once to freeze julia set
overlay_canvas.addEventListener('dblclick', function() {
		jbool == false? jbool = true : jbool = false;  
		var rect = canvas.getBoundingClientRect();
		x2 = parseInt(event.clientX - rect.left);
		y2 = parseInt(event.clientY - rect.top)
		jctx.clearRect(0,0,jcanvas.width,jcanvas.height);
        c = canvas_to_xy([x2,y2], xmin, xmax, ymin, ymax, jcanvas);
		draw_julia_set(c[0],c[1], jmoveX, jmoveY, jzoom);
	}, false);
	
// click twice to reset julia zoom
joverlay.addEventListener('dblclick', function() {
	jzoom=1;
	jmoveX=0;
	jmoveY=0;
	draw_julia_set(c[0],c[1], jmoveX, jmoveY, jzoom); 

	}, false);

var jbool=true;
// turn on/off julia viewer
document.addEventListener('keydown', function() {
	if(event.keyCode==74){
		if(jbool){
		document.getElementById("julia_container").style.display = 'none';
		jbool=false;
		} else {
		document.getElementById("julia_container").style.display = 'block';
		jbool = true;
		}
		}
		if(event.keyCode==87){
		up();
		}
	if(event.keyCode==65){
		left();
		}
	if(event.keyCode==83){
		down();
		}
	if(event.keyCode==68){
		right();
		}
	if(event.keyCode==90){
		zoomOut();
		}
	if(event.keyCode==88){
		zoomIn();
		}
	if(event.keyCode==72){
		showHideControls();
		}
	if(event.keyCode==82){
		reset();
		}
});

joverlay.addEventListener('keydown', function() {
	if(jbool===false){
		var rect = jcanvas.getBoundingClientRect();
		jbool = true;
		} else {
		jbool = false;
		}});



var iter_adjust = Math.log10(OOM(zoom));
var maxIter = 255*iter_adjust;
var msetfunc = mandelbrot_iteration_count_deg2;
var jsetfunc = julia_iteration_count_deg2;
var draw_mandelbrot_set = draw_mandelbrot_set_bw;
draw_mandelbrot_set(xmin, xmax, ymin, ymax);

// Get user inputs:
var moveX_user = document.getElementById("Xtxt"),
	moveY_user = document.getElementById("Ytxt"),
	zoom_user = document.getElementById("zoomtxt");

var nightBool=false;

function nightMode(){

buttons = document.getElementsByName("button");
if(nightBool){
	nightBool=false;
	document.body.style.color= "#252525"; 
	document.body.style.backgroundColor = '#F5F5F5';
	for(var i; i<buttons.length; i++){
	buttons[i].style.backgroundColor = "343434";
	buttons[i].style.color = "F5F5F5";
		}
	} else {
	nightBool=true;
	document.body.style.color= "#F5F5F5"; 
	document.body.style.backgroundColor = '#000'
	for(var i; i<buttons.length; i++){
	buttons[i].style.backgroundColor = "F5F5F5";
	buttons[i].style.color = "000";
		}
	}
}


function selectSet(){
// 	msets = document.getElementsByName("whichSet");
// 	for(i=0; i<msets.length; i++){
// 		if(msets[i].checked){
// 			var Mset = msets[i].value;
// 			break;
// 			}
// 		}
	Mset = document.getElementById("mandelbrot_selector").value;
	moveX = 0.0;
	document.getElementById("Xtxt").value = "0";
	moveY = 0.0;
	document.getElementById("Ytxt").value = "0";
	zoom = 1;
	document.getElementById("zoomtxt").value = "1";
	if(Mset=='deg2'){
	msetfunc = mandelbrot_iteration_count_deg2;
	jsetfunc = julia_iteration_count_deg2;
	draw_mandelbrot_set(xmin, xmax, ymin, ymax);
	}
	else if(Mset=='deg3'){
	msetfunc = mandelbrot_iteration_count_deg3;
	jsetfunc = julia_iteration_count_deg3;
	draw_mandelbrot_set(xmin, xmax, ymin, ymax);
	}
	else if(Mset=='deg4'){
	msetfunc = mandelbrot_iteration_count_deg4;
	jsetfunc = julia_iteration_count_deg4;
	draw_mandelbrot_set(xmin, xmax, ymin, ymax);
	}
	else if(Mset=='deg5'){
	msetfunc = mandelbrot_iteration_count_deg5;
	jsetfunc = julia_iteration_count_deg5;
	draw_mandelbrot_set(xmin, xmax, ymin, ymax);
	}
	else if(Mset=='ship'){
	msetfunc = mandelbrot_iteration_count_ship;
	jsetfunc = julia_iteration_count_ship;
	draw_mandelbrot_set(xmin, xmax, ymin, ymax);
	}
	else if(Mset=='ship3'){
	msetfunc = mandelbrot_iteration_count_ship3;
	jsetfunc = julia_iteration_count_ship3;
	draw_mandelbrot_set(xmin, xmax, ymin, ymax);
	}
	else if(Mset=='ship4'){
	msetfunc = mandelbrot_iteration_count_ship4;
	jsetfunc = julia_iteration_count_ship4;
	draw_mandelbrot_set(xmin, xmax, ymin, ymax);
	}
	else if(Mset=='ship5'){
	msetfunc = mandelbrot_iteration_count_ship5;
	jsetfunc = julia_iteration_count_ship5;
	draw_mandelbrot_set(xmin, xmax, ymin, ymax);
	}
	else if(Mset=='invDiffx'){
	msetfunc = mandelbrot_iteration_count_invDiffx;
	jsetfunc = julia_iteration_count_invDiffx;
	draw_mandelbrot_set(xmin, xmax, ymin, ymax);
	}
	else if(Mset=='invSumx'){
	msetfunc = mandelbrot_iteration_count_invSumx;
	jsetfunc = julia_iteration_count_invSumx;
	draw_mandelbrot_set(xmin, xmax, ymin, ymax);
	}
	else{
	console.log('error');
	}
	
}

var zoomrate = 2.0;
function setZoomRate(){
	zoomrate = document.getElementById("zoomrate").value;
}

function zoomIn() {
  zoom = zoom*zoomrate;
  oomzoom = 100*OOM(zoom);
  document.getElementById("zoomtxt").value = zoom;
  draw_mandelbrot_set(xmin, xmax, ymin, ymax);
}
function zoomOut() {
  zoom = zoom/zoomrate;
  oomzoom = 100*OOM(zoom);
  document.getElementById("zoomtxt").value = zoom;
  draw_mandelbrot_set(xmin, xmax, ymin, ymax);
}

function manualXY(){
moveXtmp = document.getElementById("Xtxt").value;
moveYtmp = document.getElementById("Ytxt").value;
zoomtmp = document.getElementById("zoomtxt").value;
moveX = parseFloat(moveXtmp == '' ?  moveX : moveXtmp);
moveY = parseFloat(moveYtmp == '' ? moveY : moveYtmp);
zoom = parseFloat(zoomtmp == '' ? zoom : zoomtmp);
draw_mandelbrot_set(xmin, xmax, ymin, ymax);
}


function right() {
  move = 1000/OOM(zoom);
  moveX = moveX + move/10000;
  document.getElementById("Xtxt").value = Math.round(moveX*oomzoom)/oomzoom;
  draw_mandelbrot_set(xmin, xmax, ymin, ymax);
}
function left() {
  move = 1000/OOM(zoom);
  moveX = moveX - move/10000;
  document.getElementById("Xtxt").value = Math.round(moveX*oomzoom)/oomzoom;
  draw_mandelbrot_set(xmin, xmax, ymin, ymax);
}
function up() {
  move = 1000/OOM(zoom);
  moveY = moveY + move/10000;
  document.getElementById("Ytxt").value = Math.round(moveY*oomzoom)/oomzoom;
  draw_mandelbrot_set(xmin, xmax, ymin, ymax);
}
function down() {
  move = 1000/OOM(zoom);
  moveY = moveY - move/10000;
  document.getElementById("Ytxt").value = Math.round(moveY*oomzoom)/oomzoom;
  draw_mandelbrot_set(xmin, xmax, ymin, ymax);
}


function reset(){
moveX = 0.0;
document.getElementById("Xtxt").value = "0";
moveY = 0.0;
document.getElementById("Ytxt").value = "0";
xmin = -2.0;
xmax = 2.0;
ymin = -1.5;
ymax = 1.5;
zoom = 1;
usrCnt = 8;
usrCntMlt = 1;
usrCntAdd = 1;
zoomrate = 2.0;
document.getElementById("zoomtxt").value = "0";
document.getElementById("zoomrate").value = "2.0";
document.getElementById("usrCnt").value = "8";
document.getElementById("cntMlt").value = "1";
document.getElementById("usrCntAdd").value = "1";

draw_mandelbrot_set(xmin, xmax, ymin, ymax);
}

function resetZoom(){
zoom = 1;
document.getElementById("zoomtxt").value = "0";
draw_mandelbrot_set(xmin, xmax, ymin, ymax);
}

function resetPan(){
moveX = 0.0;
moveY = 0.0;
document.getElementById("Xtxt").value = "0";
document.getElementById("Ytxt").value = "0";
draw_mandelbrot_set(xmin, xmax, ymin, ymax);
}

function colorselect(){
	usr_clr = document.getElementById("colorselect").value;
	if(usr_clr=="bw"){
		draw_mandelbrot_set = draw_mandelbrot_set_bw;
		draw_mandelbrot_set(xmin, xmax, ymin, ymax);
		boxcolor="red";
		}
	if(usr_clr=="bwinv"){
		draw_mandelbrot_set = draw_mandelbrot_set_invert_bw;
		draw_mandelbrot_set(xmin, xmax, ymin, ymax);
		boxcolor="red";
		}
	if(usr_clr=="red"){
		draw_mandelbrot_set = draw_mandelbrot_set_red;
		draw_mandelbrot_set(xmin, xmax, ymin, ymax);
		boxcolor="white";
		}
	if(usr_clr=="green"){
		draw_mandelbrot_set = draw_mandelbrot_set_green;
		draw_mandelbrot_set(xmin, xmax, ymin, ymax);
		boxcolor="white";
		}
	if(usr_clr=="blue"){
		draw_mandelbrot_set = draw_mandelbrot_set_blue;
		draw_mandelbrot_set(xmin, xmax, ymin, ymax);
		boxcolor="white";
		}
	if(usr_clr=="yellow"){
		draw_mandelbrot_set = draw_mandelbrot_set_yellow;
		draw_mandelbrot_set(xmin, xmax, ymin, ymax);
		boxcolor="white";
		}
	if(usr_clr=="icy"){
		draw_mandelbrot_set = draw_mandelbrot_set_icy;
		draw_mandelbrot_set(xmin, xmax, ymin, ymax);
		boxcolor="white";
		}
	if(usr_clr=="redblue"){
		draw_mandelbrot_set = draw_mandelbrot_set_redblue;
		draw_mandelbrot_set(xmin, xmax, ymin, ymax);
		boxcolor="white";
		}
	if(usr_clr=="rainbow"){
		draw_mandelbrot_set = draw_mandelbrot_set_rainbow;
		draw_mandelbrot_set(xmin, xmax, ymin, ymax);
		boxcolor="white";
		}
	if(usr_clr=="custom"){
		customColors();
		draw_mandelbrot_set = draw_mandelbrot_set_custom;
		document.getElementById("customcolors").style.display = "inline";
		draw_mandelbrot_set(xmin, xmax, ymin, ymax);
		boxcolor="white";
		} else {document.getElementById("customcolors").style.display = "none";}
		
}


function resochange(){
	reso = document.getElementById("reso").value;
		if(reso=="800"){
		ctx.canvas.width = 800;
		ctx.canvas.height = 600;
		ctx2.canvas.width = 800;
		ctx2.canvas.height = 600;
		} else if(reso=="1200"){
		ctx.canvas.width = 1200;
		ctx.canvas.height = 900;
		ctx2.canvas.width = 1200;
		ctx2.canvas.height = 900;	
		} else if(reso=="1600"){
		ctx.canvas.width = 1600;
		ctx.canvas.height = 1200;
		ctx2.canvas.width = 1600;
		ctx2.canvas.height = 1200;
		} else if(reso=="2400"){
		ctx.canvas.width = 2400;
		ctx.canvas.height = 1800;
		ctx2.canvas.width = 2400;
		ctx2.canvas.height = 1800;
		}
	draw_mandelbrot_set(xmin, xmax, ymin, ymax);
}
function saveimg(){
	var img = canvas.toDataURL("image/png");
	var win = window.open();
    win.document.write('<iframe src="' + img  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
}

var shown = true;
function showHideControls(){
	if(shown){
	document.getElementById("slidecontainer").style.display = "none";
	shown = false;
	} else {
	document.getElementById("slidecontainer").style.display = "inline";
	shown = true;
	}
}




function canvas_to_xy(ij, xmin, xmax, ymin, ymax) {

	xmin = xmin/zoom+moveX;
	xmax = xmax/zoom+moveX;
	ymin = ymin/zoom+moveY;
	ymax = ymax/zoom+moveY;

	return [
		((xmax-xmin)/(canvas.width-1))*ij[0]+xmin, 
		((ymin-ymax)/(canvas.height-1))*ij[1]+ymax
	]
}

// Functions to compute and draw the image of the mandelbrot set.

function draw_mandelbrot_set_bw(xmin, xmax, ymin, ymax) {
	"use strict";
	var bail = Math.pow(2,usrCnt)+usrCntAdd;
	var canvasData = ctx.createImageData(canvas.width, canvas.height);
	for(var i = 0; i < canvas.width; i++) {
		for(var j = 0; j < canvas.height; j++) { 
			var c = canvas_to_xy([i,j], xmin, xmax, ymin, ymax, canvas);
			var it_cnt =usrCntMlt* msetfunc(c[0],c[1], bail)[0];
			var scaled_it_cnt = 245-255*it_cnt/(bail+1);
			var idx = (i+j*canvas.width) * 4;
			canvasData.data[idx + 0] = scaled_it_cnt; // 255*customColor(scaled_it_cnt,"r");
			canvasData.data[idx + 1] = scaled_it_cnt; // 255*customColor(scaled_it_cnt,"g");
			canvasData.data[idx + 2] = scaled_it_cnt; // 255*customColor(scaled_it_cnt,"b");
			canvasData.data[idx + 3] = 255;
		}
	}
    ctx.putImageData(canvasData, 0, 0);
};

var val;

function draw_mandelbrot_set_red(xmin, xmax, ymin, ymax) {
	"use strict";
	var bail = Math.pow(2,usrCnt)+usrCntAdd;
	var canvasData = ctx.createImageData(canvas.width, canvas.height);
	for(var i = 0; i < canvas.width; i++) {
		for(var j = 0; j < canvas.height; j++) { 
			var c = canvas_to_xy([i,j], xmin, xmax, ymin, ymax, canvas);
			var it_cnt = msetfunc(c[0],c[1], bail)[1];
			var hue = usrCntMlt*it_cnt/bail;
			var rgb = HSVtoRGB(hue, 1.0, 1.0);
			var idx = (i+j*canvas.width) * 4;
			canvasData.data[idx + 0] = rgb.r;
			canvasData.data[idx + 1] = rgb.g;
			canvasData.data[idx + 2] = rgb.b;
			canvasData.data[idx + 3] = 255;
		}
	}
    ctx.putImageData(canvasData, 0, 0);
};



function draw_mandelbrot_set_invert_bw(xmin, xmax, ymin, ymax) {
	"use strict";
	var bail = Math.pow(2,usrCnt)+usrCntAdd;
	var canvasData = ctx.createImageData(canvas.width, canvas.height);
	for(var i = 0; i < canvas.width; i++) {
		for(var j = 0; j < canvas.height; j++) { 
			var c = canvas_to_xy([i,j], xmin, xmax, ymin, ymax, canvas);
			var it_cnt = usrCntMlt*msetfunc(c[0],c[1], bail)[0];
			var scaled_it_cnt = 255-255*it_cnt/(bail+1);
			var idx = (i+j*canvas.width) * 4;
			canvasData.data[idx + 0] = 255-scaled_it_cnt; // 255*customColor(scaled_it_cnt,"r");
			canvasData.data[idx + 1] = 255-scaled_it_cnt; // 255*customColor(scaled_it_cnt,"g");
			canvasData.data[idx + 2] = 255-scaled_it_cnt; // 255*customColor(scaled_it_cnt,"b");
			canvasData.data[idx + 3] = 255;
		}
	}
    ctx.putImageData(canvasData, 0, 0);
};


function draw_mandelbrot_set_icy(xmin, xmax, ymin, ymax) {
	"use strict";
	var bail = Math.pow(2,usrCnt)+usrCntAdd;
	var canvasData = ctx.createImageData(canvas.width, canvas.height);
	for(var i = 0; i < canvas.width; i++) {
		for(var j = 0; j < canvas.height; j++) { 
			var c = canvas_to_xy([i,j], xmin, xmax, ymin, ymax, canvas);
			var it_cnt = msetfunc(c[0],c[1], bail)[1];
			var hue = usrCntMlt*it_cnt/bail;
			var rgb = HSVtoRGB(hue, 1.0, 1.0);
			var idx = (i+j*canvas.width) * 4;
			canvasData.data[idx + 0] = 255-rgb.r;
			canvasData.data[idx + 1] = 255-rgb.g;
			canvasData.data[idx + 2] = 255-rgb.b;
			canvasData.data[idx + 3] = 255;
		}
	}
    ctx.putImageData(canvasData, 0, 0);
};


function draw_mandelbrot_set_green(xmin, xmax, ymin, ymax) {
	"use strict";
	var bail = Math.pow(2,usrCnt)+usrCntAdd;
	var canvasData = ctx.createImageData(canvas.width, canvas.height);
	for(var i = 0; i < canvas.width; i++) {
		for(var j = 0; j < canvas.height; j++) { 
			var c = canvas_to_xy([i,j], xmin, xmax, ymin, ymax, canvas);
			var it_cnt = msetfunc(c[0],c[1], bail)[1];
			var hue = usrCntMlt*it_cnt/bail;
			var rgb = HSVtoRGB(hue, 1.0, 1.0);
			var idx = (i+j*canvas.width) * 4;
			canvasData.data[idx + 0] = 255-rgb.r;
			canvasData.data[idx + 1] = rgb.g;
			canvasData.data[idx + 2] = rgb.b;
			canvasData.data[idx + 3] = 255;
		}
	}
    ctx.putImageData(canvasData, 0, 0);
};

function draw_mandelbrot_set_yellow(xmin, xmax, ymin, ymax) {
	"use strict";
	var bail = Math.pow(2,usrCnt)+usrCntAdd;
	var canvasData = ctx.createImageData(canvas.width, canvas.height);
	for(var i = 0; i < canvas.width; i++) {
		for(var j = 0; j < canvas.height; j++) { 
			var c = canvas_to_xy([i,j], xmin, xmax, ymin, ymax, canvas);
			var it_cnt = msetfunc(c[0],c[1], bail)[1];
			var hue = usrCntMlt*it_cnt/bail;
			var rgb = HSVtoRGB(hue, 1.0, 1.0);
			var idx = (i+j*canvas.width) * 4;
			canvasData.data[idx + 0] = rgb.r;
			canvasData.data[idx + 1] = 255-rgb.g;
			canvasData.data[idx + 2] = rgb.b;
			canvasData.data[idx + 3] = 255;
		}
	}
    ctx.putImageData(canvasData, 0, 0);
};

function draw_mandelbrot_set_blue(xmin, xmax, ymin, ymax) {
	"use strict";
	var bail = Math.pow(2,usrCnt)+usrCntAdd;
	var canvasData = ctx.createImageData(canvas.width, canvas.height);
	for(var i = 0; i < canvas.width; i++) {
		for(var j = 0; j < canvas.height; j++) { 
			var c = canvas_to_xy([i,j], xmin, xmax, ymin, ymax, canvas);
			var it_cnt = msetfunc(c[0],c[1], bail)[1];
			var hue = usrCntMlt*it_cnt/bail;
			var rgb = HSVtoRGB(hue, 1.0, 1.0);
			var idx = (i+j*canvas.width) * 4;
			canvasData.data[idx + 0] = 255-rgb.r;
			canvasData.data[idx + 1] = rgb.g;
			canvasData.data[idx + 2] = 255-rgb.b;
			canvasData.data[idx + 3] = 255;
		}
	}
    ctx.putImageData(canvasData, 0, 0);
};

function draw_mandelbrot_set_redblue(xmin, xmax, ymin, ymax) {
	"use strict";
	var bail = Math.pow(2,usrCnt)+usrCntAdd;
	var canvasData = ctx.createImageData(canvas.width, canvas.height);
	for(var i = 0; i < canvas.width; i++) {
		for(var j = 0; j < canvas.height; j++) { 
			var c = canvas_to_xy([i,j], xmin, xmax, ymin, ymax, canvas);
			var it_cnt = msetfunc(c[0],c[1], bail)[1];
			var hue = usrCntMlt*it_cnt/bail;
			var rgb = HSVtoRGB(hue, 1.0, 1.0);
			var idx = (i+j*canvas.width) * 4;
			canvasData.data[idx + 0] = rgb.r
			canvasData.data[idx + 1] = rgb.g;
			canvasData.data[idx + 2] = rgb.g;
			canvasData.data[idx + 3] = 255;
		}
	}
    ctx.putImageData(canvasData, 0, 0);
};

function draw_mandelbrot_set_rainbow(xmin, xmax, ymin, ymax) {
	"use strict";
	var bail = Math.pow(2,usrCnt)+usrCntAdd;
	var canvasData = ctx.createImageData(canvas.width, canvas.height);
	for(var i = 0; i < canvas.width; i++) {
		for(var j = 0; j < canvas.height; j++) { 
			var c = canvas_to_xy([i,j], xmin, xmax, ymin, ymax, canvas);
			var it_cnt = msetfunc(c[0],c[1], bail)[1];
			var hue = usrCntMlt*it_cnt/bail;
			var rgb = HSVtoRGB(hue, 1.0, 1.0);
			var idx = (i+j*canvas.width) * 4;
			canvasData.data[idx + 0] = rgb.r
			canvasData.data[idx + 1] = rgb.g;
			canvasData.data[idx + 2] = rgb.b;
			canvasData.data[idx + 3] = 255;
		}
	}
    ctx.putImageData(canvasData, 0, 0);
};
var usrR, usrG, usrB, usrCnt, usrCntMlt;
function customCount(){
	usrCnt = parseInt(document.getElementById("usrCnt").value);
	usrCntMlt = parseInt(document.getElementById("cntMlt").value);
	usrCntAdd = parseInt(document.getElementById("usrCntAdd").value);
	draw_mandelbrot_set(xmin, xmax, ymin, ymax);

}
function customColors(){
	usrR = parseInt(document.getElementById("R").value);
	usrG = parseInt(document.getElementById("G").value);
	usrB = parseInt(document.getElementById("B").value);
	usrCnt = parseInt(document.getElementById("usrCnt").value);
	usrCntMlt = parseInt(document.getElementById("cntMlt").value);
	usrCntAdd = parseInt(document.getElementById("usrCntAdd").value);
	Rsign = document.getElementById("Rsign").value == "p" ? 1 : -1;
	Gsign = document.getElementById("Gsign").value == "p" ? 1 : -1;
	Bsign = document.getElementById("Bsign").value == "p" ? 1 : -1;

draw_mandelbrot_set(xmin, xmax, ymin, ymax);
}

function draw_mandelbrot_set_custom(xmin, xmax, ymin, ymax) {
	"use strict";
	var bail = Math.pow(2,usrCnt)+usrCntAdd;
	var canvasData = ctx.createImageData(canvas.width, canvas.height);
	for(var i = 0; i < canvas.width; i++) {
		for(var j = 0; j < canvas.height; j++) { 
			var c = canvas_to_xy([i,j], xmin, xmax, ymin, ymax, canvas);
			var it_cnt = msetfunc(c[0],c[1], bail)[1];
			var hue = usrCntMlt*it_cnt/bail;
			var rgb = HSVtoRGB(hue, 1.0, 1.0);
			var idx = (i+j*canvas.width) * 4;
			canvasData.data[idx + 0] = usrR + Rsign * rgb.r;
			canvasData.data[idx + 1] = usrG + Gsign * rgb.g;
			canvasData.data[idx + 2] = usrB + Bsign * rgb.b;
			canvasData.data[idx + 3] = 255;
		}
	}
    ctx.putImageData(canvasData, 0, 0);
};


var logBase = 1.0/Math.log(2.0);
var logHalfBase = Math.log(0.5)*logBase;

function mandelbrot_iteration_count_deg2(x0,y0, bail) {
	"use strict";
	var x = x0, y = y0;
	var xtemp, ytemp;
	var cnt = 0;
	while(x*x+y*y <= 4.0 && cnt++ < bail) {
		xtemp = x; ytemp = y;
		x = xtemp*xtemp-ytemp*ytemp+x0;
		y = 2.0*xtemp*ytemp+y0;
	}
	var cnt2 = cnt + 5 - logHalfBase - Math.log(Math.log(x*x+y*y))*logBase;
	return [cnt,cnt2];
}


var horizon = Math.pow(2.0,40);
var log_horizon = Math.log(Math.log(horizon))/Math.log(2);

function mandelbrot_iteration_count_deg3(x0,y0, bail) {
	"use strict";
	var x = x0, y = y0;
	var xtemp, ytemp;
	var cnt = 0;
	while(x*x+y*y < 4 && cnt++ < bail/2) {
		xtemp = x; ytemp = y;
		x = xtemp*xtemp*xtemp - 3.0*xtemp*ytemp*ytemp + x0;
		y = 3.0*xtemp*xtemp*ytemp - ytemp*ytemp*ytemp + y0;
	}
	var cnt2 = cnt + 5 - logHalfBase - Math.log(Math.log(x*x+y*y))*logBase;
	return [2*cnt,2*cnt2];
}

function mandelbrot_iteration_count_deg4(x0,y0, bail) {
	"use strict";
	var x = x0, y = y0;
	var xtemp, ytemp;
	var cnt = 0;
	while(x*x+y*y < 4 && cnt++ < bail) {
		xtemp = x; ytemp = y;
		x = xtemp*xtemp*xtemp*xtemp - 6.0*xtemp*xtemp*ytemp*ytemp + ytemp*ytemp*ytemp*ytemp + x0;
		y = 4.0*xtemp*ytemp*(xtemp*xtemp - ytemp*ytemp) + y0;
	}
	var cnt2 = cnt + 5 - logHalfBase - Math.log(Math.log(x*x+y*y))*logBase;
	return [cnt,cnt2];
}

function mandelbrot_iteration_count_deg5(x0,y0, bail) {
	"use strict";
	var x = x0, y = y0;
	var xtemp, ytemp;
	var cnt = 0;
	while(x*x+y*y < 4 && cnt++ < bail) {
		xtemp = x; ytemp = y;
		x = xtemp*(xtemp*xtemp*xtemp*xtemp - 10.0*xtemp*xtemp*ytemp*ytemp + 5*ytemp*ytemp*ytemp*ytemp) + x0;
		y = ytemp*(5.0*xtemp*xtemp*xtemp*xtemp - 10*xtemp*xtemp*ytemp*ytemp + ytemp*ytemp*ytemp*ytemp) + y0;
	}
	var cnt2 = cnt + 5 - logHalfBase - Math.log(Math.log(x*x+y*y))*logBase;
	return [cnt,cnt2];
}

function mandelbrot_iteration_count_ship(x0,y0, bail) {
	"use strict";
	var x = x0, y = y0;
	var xtemp, ytemp;
	var cnt = 0;
	while(x*x+y*y < 4 && cnt++ < bail) {
		xtemp = x*x-y*y+x0;
		y = -1*Math.abs(2*x*y)+y0;
		x = Math.abs(xtemp);
	}
	var cnt2 = cnt + 5 - logHalfBase - Math.log(Math.log(x*x+y*y))*logBase;
	return [cnt,cnt2];
}

function mandelbrot_iteration_count_ship3(x0,y0, bail) {
	"use strict";
	var x = x0, y = y0;
	var xtemp, ytemp;
	var cnt = 0;
	while(x*x+y*y < 4 && cnt++ < bail) {
		xtemp = x*x*x-3.0*x*y*y+x0;
		y = -1*Math.abs(3.0*x*x*y-y*y*y)+y0;
		x = Math.abs(xtemp);
	}
	var cnt2 = cnt + 5 - logHalfBase - Math.log(Math.log(x*x+y*y))*logBase;
	return [cnt,cnt2];
}

function mandelbrot_iteration_count_ship4(x0,y0, bail) {
	"use strict";
	var x = x0, y = y0;
	var xtemp, ytemp;
	var cnt = 0;
	while(x*x+y*y < 4 && cnt++ < bail) {
		xtemp = x*x*x*x-6.0*x*x*y*y+y*y*y*y+x0;
		y = -1*Math.abs(4.0*x*y*(x*x-y*y))+y0;
		x = Math.abs(xtemp);
	}
	var cnt2 = cnt + 5 - logHalfBase - Math.log(Math.log(x*x+y*y))*logBase;
	return [cnt,cnt2];
}
function mandelbrot_iteration_count_ship5(x0,y0, bail) {
	"use strict";
	var x = x0, y = y0;
	var xtemp, ytemp;
	var cnt = 0;
	while(x*x+y*y < 4 && cnt++ < bail) {
		xtemp = x*(x*x*x*x-10.0*x*x*y*y+5*y*y*y*y)+x0;
		y = -1*Math.abs(y*(5.0*x*x*x*x-10*x*x*y*y+y*y*y*y))+y0;
		x = Math.abs(xtemp);
	}
	var cnt2 = cnt + 5 - logHalfBase - Math.log(Math.log(x*x+y*y))*logBase;
	return [cnt,cnt2];
}


function mandelbrot_iteration_count_invDiffx(x0,y0, bail) {
	var x = x0, y = y0;
	var xtemp, ytemp;
	var cnt = 0;
	while(x*x+y*y < 4 && cnt++ < bail) {
		xtemp = x; ytemp = y;
		x = x0*(1 + xtemp + xtemp*xtemp - ytemp*ytemp + xtemp*xtemp*xtemp - 3*xtemp*ytemp*ytemp + xtemp*xtemp*xtemp*xtemp - 6*xtemp*xtemp*ytemp*ytemp + ytemp*ytemp*ytemp*ytemp + xtemp*xtemp*xtemp*xtemp*xtemp - 10*xtemp*xtemp*xtemp*ytemp*ytemp + 5*xtemp*ytemp*ytemp*ytemp*ytemp);
		y = y0*(ytemp + 2*xtemp*ytemp + 3*xtemp*xtemp*ytemp - ytemp*ytemp*ytemp + 4*xtemp*xtemp*xtemp*ytemp -4*xtemp*ytemp*ytemp*ytemp + 5*xtemp*xtemp*xtemp*xtemp*ytemp - 10*xtemp*xtemp*ytemp*ytemp + ytemp*ytemp*ytemp*ytemp*ytemp);
	}
	var cnt2 = cnt + 5 - logHalfBase - Math.log(Math.log(x*x+y*y))*logBase;
	return [cnt,cnt2];
}

function mandelbrot_iteration_count_invSumx(x0,y0, bail) {
	var x = x0, y = y0;
	var xtemp, ytemp;
	var cnt = 0;
	while(x*x+y*y < 4 && cnt++ < bail) {
		xtemp = x; ytemp = y;
		x = x0*(1 - xtemp + xtemp*xtemp - ytemp*ytemp - xtemp*xtemp*xtemp + 3*xtemp*ytemp*ytemp + xtemp*xtemp*xtemp*xtemp - 6*xtemp*xtemp*ytemp*ytemp + ytemp*ytemp*ytemp*ytemp - xtemp*xtemp*xtemp*xtemp*xtemp + 10*xtemp*xtemp*xtemp*ytemp*ytemp - 5*xtemp*ytemp*ytemp*ytemp*ytemp);
		y = y0*(-ytemp + 2*xtemp*ytemp - 3*xtemp*xtemp*ytemp + ytemp*ytemp*ytemp + 4*xtemp*xtemp*xtemp*ytemp -4*xtemp*ytemp*ytemp*ytemp - 5*xtemp*xtemp*xtemp*xtemp*ytemp + 10*xtemp*xtemp*ytemp*ytemp - ytemp*ytemp*ytemp*ytemp*ytemp);
	}
	var cnt2 = cnt + 5 - logHalfBase - Math.log(Math.log(x*x+y*y))*logBase;
	return [cnt,cnt2];
}


function draw_julia_set(cX, cY, moveX, moveY, jzoom) {
	var jcanvasData = jctx.createImageData(jcanvas.width, jcanvas.height);
	for(var i = 0; i < jcanvas.width; i++) {
		for(var j = 0; j < jcanvas.height; j++) { 
			var xy = jcanvas_to_xy([i,j], xmin, xmax, ymin, ymax);
			var it_cnt = jsetfunc(cX,cY,xy[0],xy[1],jzoom);
			var idx = (i+j*jcanvas.width) * 4;
			jcanvasData.data[idx + 0] = 245-it_cnt;
			jcanvasData.data[idx + 1] = 245-it_cnt;
			jcanvasData.data[idx + 2] = 245-it_cnt;
			jcanvasData.data[idx + 3] = 255;
		}
	}
    jctx.putImageData(jcanvasData, 0, 0);
}
	

function julia_iteration_count_deg2(cre,cim,x0,y0,zoom) {
	var x = x0, y = y0;
	var xtemp, ytemp;
	var cnt = 0;
	while(x*x+y*y < 4 && cnt++ <= jIter/2) {
		xtemp = x; ytemp = y;
		x = xtemp*xtemp-ytemp*ytemp+cre;
		y = 2*xtemp*ytemp+cim;
	}
	return 4*cnt;
}

function julia_iteration_count_deg3(cre,cim,x0,y0,zoom) {
	var x = x0, y = y0;
	var xtemp, ytemp;
	var cnt = 0;
	while(x*x+y*y < 4 && cnt++ < jIter/2) {
		xtemp = x; ytemp = y;
		x = xtemp*xtemp*xtemp - 3.0*xtemp*ytemp*ytemp + cre;
		y = 3.0*xtemp*xtemp*ytemp - ytemp*ytemp*ytemp + cim;
	}
	return 4*cnt;
}


function julia_iteration_count_invDiffx(cre,cim,x0,y0,zoom) {
	var x = x0, y = y0;
	var xtemp, ytemp;
	var cnt = 0;
	while(x*x+y*y < 4 && cnt++ < jIter/2) {
		xtemp = x; ytemp = y;
		x = cre*(1 + xtemp + xtemp*xtemp - ytemp*ytemp + xtemp*xtemp*xtemp - 3*xtemp*ytemp*ytemp);
		y = cim*(ytemp + 2*xtemp*ytemp + 3*xtemp*xtemp*ytemp - ytemp*ytemp*ytemp);
	}
	return 4*cnt;
}

function julia_iteration_count_invSumx(cre,cim,x0,y0,zoom) {
	var x = x0, y = y0;
	var xtemp, ytemp;
	var cnt = 0;
	while(x*x+y*y < 4 && cnt++ < jIter/2) {
		xtemp = x; ytemp = y;
		x = cre*(1 - xtemp + xtemp*xtemp - ytemp*ytemp - xtemp*xtemp*xtemp + 3*xtemp*ytemp*ytemp + xtemp*xtemp*xtemp*xtemp - 6*xtemp*xtemp*ytemp*ytemp + ytemp*ytemp*ytemp*ytemp - xtemp*xtemp*xtemp*xtemp*xtemp + 10*xtemp*xtemp*xtemp*ytemp*ytemp - 5*xtemp*ytemp*ytemp*ytemp*ytemp);
		y = cim*(-ytemp + 2*xtemp*ytemp - 3*xtemp*xtemp*ytemp + ytemp*ytemp*ytemp + 4*xtemp*xtemp*xtemp*ytemp -4*xtemp*ytemp*ytemp*ytemp - 5*xtemp*xtemp*xtemp*xtemp*ytemp + 10*xtemp*xtemp*ytemp*ytemp - ytemp*ytemp*ytemp*ytemp*ytemp);
		}
	return 4*cnt;
}

function julia_iteration_count_ship(cre,cim,x0,y0,zoom) {
	"use strict";
	var x = x0, y = y0;
	var xtemp, ytemp;
	var cnt = 0;
	while(x*x+y*y < 4 && cnt++ < jIter/2) {
		xtemp = x*x-y*y+cre;
		y = -1*Math.abs(2*x*y)+cim;
		x = Math.abs(xtemp);
	}
	return 4*cnt;
}

function julia_iteration_count_deg4(cre,cim, x0, y0, zoom) {
	var x = x0, y = y0;
	var xtemp, ytemp;
	var cnt = 0;
	while(x*x+y*y < 4 && cnt++ < jIter/2) {
		xtemp = x; ytemp = y;
		x = xtemp*xtemp*xtemp*xtemp - 6.0*xtemp*xtemp*ytemp*ytemp + ytemp*ytemp*ytemp*ytemp + cre;
		y = 4.0*xtemp*ytemp*(xtemp*xtemp - ytemp*ytemp) + cim;
	}
	return 4*cnt
}

function julia_iteration_count_deg5(cre,cim, x0, y0, zoom) {
	"use strict";
	var x = x0, y = y0;
	var xtemp, ytemp;
	var cnt = 0;
	while(x*x+y*y < 4 && cnt++ < jIter/2) {
		xtemp = x; ytemp = y;
		x = xtemp*(xtemp*xtemp*xtemp*xtemp - 10.0*xtemp*xtemp*ytemp*ytemp + 5*ytemp*ytemp*ytemp*ytemp) + cre;
		y = ytemp*(5.0*xtemp*xtemp*xtemp*xtemp - 10*xtemp*xtemp*ytemp*ytemp + ytemp*ytemp*ytemp*ytemp) + cim;
	}
	return 4*cnt
}


function julia_iteration_count_ship3(cre,cim, x0, y0, zoom) {
	"use strict";
	var x = x0, y = y0;
	var xtemp, ytemp;
	var cnt = 0;
	while(x*x+y*y < 4 && cnt++ < jIter/2) {
		xtemp = x*x*x-3.0*x*y*y+cre;
		y = -1*Math.abs(3.0*x*x*y-y*y*y)+cim;
		x = Math.abs(xtemp);
	}
	return 4*cnt
}

function julia_iteration_count_ship4(cre,cim, x0, y0, zoom) {
	"use strict";
	var x = x0, y = y0;
	var xtemp, ytemp;
	var cnt = 0;
	while(x*x+y*y < 4 && cnt++ < jIter/2) {
		xtemp = x*x*x*x-6.0*x*x*y*y+y*y*y*y+cre;
		y = -1*Math.abs(4.0*x*y*(x*x-y*y))+cim;
		x = Math.abs(xtemp);
	}
	return 4*cnt
}
function julia_iteration_count_ship5(cre,cim, x0, y0, zoom){
	"use strict";
	var x = x0, y = y0;
	var xtemp, ytemp;
	var cnt = 0;
	while(x*x+y*y < 4 && cnt++ < jIter/2) {
		xtemp = x*(x*x*x*x-10.0*x*x*y*y+5*y*y*y*y)+cre;
		y = -1*Math.abs(y*(5.0*x*x*x*x-10*x*x*y*y+y*y*y*y))+cim;
		x = Math.abs(xtemp);
	}
	return 4*cnt
}

	
	
	
	
function jcanvas_to_xy(ij, xmin, xmax, ymin, ymax) {
	"use strict";
	xmin = xmin/jzoom+jmoveX;
	xmax = xmax/jzoom+jmoveX;
	ymin = ymin/jzoom+jmoveY;
	ymax = ymax/jzoom+jmoveY;
	return [
		((xmax-xmin)/(jcanvas.width-1))*ij[0]+xmin, 
		((ymin-ymax)/(jcanvas.height-1))*ij[1]+ymax
	]
}

	
// Returns order of magnitude (for zoom, pan, etc.)
function OOM(n) {
    var order = Math.ceil(Math.log(n) / Math.LN10
                       + 0.000000001);
    return Math.pow(10,order);
}

//js version of np.linspace
function linspace(startValue, stopValue, cardinality) {
  var arr = [];
  var currValue = startValue;
  var step = (stopValue - startValue) / (cardinality - 1);
  for (var i = 0; i < cardinality; i++) {
    arr.push(currValue + (step * i));
  }
  return arr;
}

// convert hsv to rgb
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
//         r: Math.round(r * 255),
//         g: Math.round(g * 255),
//         b: Math.round(b * 255)
        r: r * 255,
        g: g * 255,
        b: b * 255
    };
}

// -0.74, 0.15i 
