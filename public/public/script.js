function openTerminal(){

document.getElementById("terminal")
.style.display="block";

}



function runCmd(){

let cmd =
document.getElementById("cmd").value;


let output =
document.getElementById("output");


if(cmd=="help"){

output.innerHTML +=
"<br>Commands: help, clear, about";

}


else if(cmd=="clear"){

output.innerHTML="";

}


else if(cmd=="about"){

output.innerHTML +=
"<br>Mobile Desktop OS";

}


else{


output.innerHTML +=
"<br>C:\\Users\\User> "
+cmd+
"<br>Command executed";

}


}
