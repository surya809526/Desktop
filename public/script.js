function openWindow(id){

document.getElementById(id)
.style.display="block";

}



function closeWindow(id){

document.getElementById(id)
.style.display="none";

}



function startMenu(){

let m=document.getElementById("menu");


m.style.display =
m.style.display=="block"
?"none":"block";

}




async function askAI(){


let text =
document.getElementById("command")
.value;



let output =
document.getElementById("output");



output.innerHTML +=
"<br>> "+text;



let res =
await fetch("/ai",{


method:"POST",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify({

message:text

})


});



let data =
await res.json();



output.innerHTML +=
"<br><br>"+data.reply;



}




function preview(){


let code =
document.getElementById("code")
.value;



let win =
window.open();


win.document.write(code);


}
