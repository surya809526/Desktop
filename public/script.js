// Open Window

function openWindow(id){

let win = document.getElementById(id);

win.style.display="block";

dragWindow(win);

}



// Close Window

function closeWindow(id){

document.getElementById(id)
.style.display="none";

}



// Start Menu

function startMenu(){

let menu=document.getElementById("start");

if(menu.style.display=="block"){

menu.style.display="none";

}

else{

menu.style.display="block";

}

}




// Terminal Commands

function runCommand(){


let cmd =
document.getElementById("command")
.value;


let out =
document.getElementById("terminalOutput");



if(cmd=="help"){

out.innerHTML +=
"<br>Commands: help, clear, date, about";

}


else if(cmd=="clear"){

out.innerHTML="C:\\Users\\User>";

}


else if(cmd=="date"){

out.innerHTML +=
"<br>"+new Date();

}


else if(cmd=="about"){

out.innerHTML +=
"<br>Mobile Desktop OS v1.0";

}


else{


out.innerHTML +=
"<br>C:\\Users\\User> "
+cmd+
"<br>Command executed";


}


document.getElementById("command").value="";

}





// Code Runner


function runCode(){


let code =
document.getElementById("code")
.value;


let frame =
document.getElementById("preview");



let doc =
frame.contentDocument ||
frame.contentWindow.document;



doc.open();

doc.write(code);

doc.close();



}




// Draggable Windows


function dragWindow(win){


let title =
win.querySelector(".title");


let offsetX=0;
let offsetY=0;
let dragging=false;



title.onmousedown=function(e){


dragging=true;


offsetX =
e.clientX - win.offsetLeft;


offsetY =
e.clientY - win.offsetTop;


}



document.onmousemove=function(e){


if(dragging){


win.style.left =
(e.clientX-offsetX)+"px";


win.style.top =
(e.clientY-offsetY)+"px";


}


}



document.onmouseup=function(){


dragging=false;


}


}
