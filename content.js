var timeStart,timeoutLoop,spawned =false;
var keyStartTimer;

function CreateDiv(position){

    var div = document.createElement("div");
    div.className='timer-overlay-extension'
    // div.style.position="fixed"
    // div.style.border= "1px solid #d3d3d3";
    // div.style.textAlign="center"
    // div.style.bottom="25px"
    // div.style.right="25px"
    // div.style.width = "200px";
    // div.style.height = "70px";
    // div.style.backgroundColor="white"
    // div.style.zIndex = "900"

    if(position){
        div.style.top=position.top
        div.style.left=position.left
    }
    //div.style.fontSize ="px"
    div.innerHTML = "<h1 style='margin-top:1%;margin-bottom:auto'>00:00:00</h1>";
    document.body.appendChild(div);
    dragElement(document.body.querySelector('.timer-overlay-extension'));
}
function RemoveDiv(){
    document.body.querySelector('.timer-overlay-extension').remove()
}



function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0,scrolll=0,addScroll=0;
  
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    console.log("ycursor:",pos4)
    console.log(scrolll)
    console.log(addScroll)
    elmnt.style.position="absolute"
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    
    //elmnt.style.left=elmnt.offsetLeft
    //elmnt.style.top=elmnt.offsetTop
    //document.body.style.overflow="auto"
    
    addScroll=window.scrollY==scrolll? 0:parseInt(window.scrollY) 
    scrolll=window.scrollY
    // calculate the new cursor position:
    
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;//+ window.scrollY;
    // calculate the max cursor position:
    var xMax = window.innerWidth - elmnt.offsetWidth;
    var yMax = window.innerHeight - elmnt.offsetHeight ;

    // set the element's new position:

    if ((elmnt.offsetLeft - pos1) >= 0 && (elmnt.offsetLeft - pos1) <= xMax) {
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        pos3 = e.clientX;
      }
      if ((elmnt.offsetTop - pos2) >= (0+ window.scrollY) && (elmnt.offsetTop - pos2) <= (yMax + window.scrollY)) {
        elmnt.style.top =  (parseInt(elmnt.offsetTop) - pos2 )+"px"//(parseInt(e.clientY) - pos2 )+"px" //(elmnt.offsetTop - pos2 ) + "px";

        pos4 = e.clientY;
      }

    }

  function closeDragElement() {
    // stop moving when mouse button is released:
    
    document.onmouseup = null;
    document.onmousemove = null;
    console.log("End ycursor:",pos4)
    //elmnt.style.top =
    console.log(elmnt.style.top)//+ parseInt(window.scrollY)
    elmnt.style.position="fixed"
    //document.body.style.overflow="visible"
  }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        keyStartTimer =request.key;
        if (request.action == "Timer"){
            if(!spawned){
                CreateDiv()
                spawned=!spawned
                sendResponse({confirmation: "Successfully created timer"});
                addListeners()
            }else{
                RemoveDiv()
                spawned=!spawned
                sendResponse({confirmation: "Successfully removed timer"});
            }
            
        }
    });


    function startTimer(){
       timePassed = new Date() - timeStart
       document.body.querySelector('.timer-overlay-extension').querySelector('h1').innerHTML=showTime(timePassed)
       timeoutLoop=setTimeout("startTimer()",1)
    }

    function restartTimer(){
        var element =document.body.querySelector('.timer-overlay-extension')
        var position ={top:element.style.top,left:element.style.left}
        RemoveDiv()
        CreateDiv(position)
        addListeners()
    }

    function stopTimer(){
        clearTimeout(timeoutLoop)
        var restartButton = document.createElement('button')
        restartButton.innerText="Restart"
        restartButton.id="RestartButton_timer_extension"
        document.body.querySelector('.timer-overlay-extension').appendChild(restartButton)
        document.body.querySelector('#RestartButton_timer_extension').addEventListener('click', (e)=>{
            restartTimer()
            
        },{once:true})
     }

    function addListeners(){
        document.body.addEventListener('keydown', function(event) {
            if(event.key==keyStartTimer){
                timeStart = new Date()
                startTimer()
            }
        },{once:true})
        document.body.addEventListener('keyup', function(event) {
            console.log(event.key)
            if(event.key==keyStartTimer){
                stopTimer()
                document.body.removeEventListener('keyup', arguments.callee);
            }
        })
    }

    function showTime(time){
        var d = new Date(time);
        var minutes=d.getUTCMinutes()
        var seconds=d.getUTCSeconds()
        var milliseconds=Math.floor(d.getUTCMilliseconds()/10)

        if (minutes<=9){minutes="0"+minutes}
        if (seconds<=9){seconds="0"+seconds}
        if (milliseconds<=9){milliseconds="0"+milliseconds}
        //if (milliseconds<=99){milliseconds="0"+milliseconds}
        
        return minutes+":"+seconds+":"+milliseconds
        
        }
        //setTimeout("show()",1000)
        //show()