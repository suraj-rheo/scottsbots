function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var chatWindow = "close";
var siteHost = window.location.host;
var siteHref = window.location.href;

window.addEventListener("message", receiveMessage, false);

const iframeEle = document.getElementById('iFrame1');

if( iframeEle) {
    iframeEle.style.right = "1em";
}

var width = window.innerWidth;
const urlHostName = window.location.hostname;

function receiveMessage(event) {
    iframe1 = document.getElementById("iFrame1");
    if(typeof(event.data) != "number") {
        if (event.data.eventType === "getBotData") {
            var iframeWin = iframeEle.contentWindow
            console.log("setting custom params for clientDomain")
            clientDomainUrl = window.location.href;
            if (clientDomainUrl.includes(".github.io/")){
                clientDomainUrl = clientDomainUrl.replace(".","");
            }

            responseData = {
                eventType: "receiveBotData",
                configData: {
                    clientDomain: clientDomainUrl
                }
            }
            iframeWin.postMessage(responseData, "*");
            return;
        } else {
            console.log("Invalid Data received")
            return;
        }
    }
    
    

    if (event.data != 81) {
        // console.log("event.data", event.data)
        
        var botHeight;

        if(event.data == 700) {
            botHeight = 90;
        } else if( event.data == 600 ) {
            botHeight = 80;
        } else {
            botHeight = 75
        }
        if(width < 768) {
            iframe1.style.height = "100%";
            iframe1.style.width = "100%";
            if(urlHostName.includes("justwravel")) {
                iframeEle.style.bottom = '0px';
            }
        } else {
            iframe1.style.height = botHeight + "vh";
            iframe1.style.width = "375px";
        }
        chatWindow = "open";
        closeChatMessage();
    } else if (event.data == 81) {
        sleep(300).then(() => {
            iframe1.style.height = "81px";
            iframe1.style.width = "81px";
        });
        
        if(urlHostName.includes("justwravel") && width < 768 ) {
            iframeEle.style.bottom = frameBottom;
        }
    }
}

if( window.innerWidth < 768) {
    var iframe1 = document.getElementById("iFrame1");
    iframe1.style.height = "81px";
    iframe1.style.width = "81px";
    iframe1.style.right = "0px";
} else {
    var iframe1 = document.getElementById("iFrame1");
    iframe1.style.height = "81px";
    iframe1.style.width = "81px";
}

var getDelay = function(str) {
    var arr = str.split(" ");
    var a1 = arr[0];
    var a2 = arr[1];
    var delay = 0;
    if(a2 == "seconds") {
        delay = a1 * 1000;
    } else if(a2 == "minute" || a2 == "minutes" ) {
        delay = a1 * (1000 * 60);
    } else if(a2 == "hour" ) {
        delay = a1 * (1000 * 60 * 60);
    }
    return delay;
}

var getTrigger = function() {
    var req = new XMLHttpRequest();
    var pURL = ""+window.location.href;
    var sURL = ""+window.location.origin;
    var hostName = ""+window.location.host
    
    req.open('GET', 'https://rheo-dashboard.herokuapp.com/api/trigger/getTriggerByUrl?pageUrl='+pURL);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        
        
        var noNeed;
        var data = JSON.parse(req.response);
        
        if(pURL != data['url']) {
            // console.log("need to return");
            noNeed = true;
            return;
        }
        
        if(noNeed === true) {
            return;
        }
        
        
        // var delay = getDelay(data['delay']);
        var delay = getDelay('15 seconds');
        var message = data['message'];
        var animationName = data['animation']
        setTimeout(function(){
            setMessage(message, animationName);
        }, delay);
        // resolve(req.response);
      } else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };
    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };
    // Make the request
    req.send();
}

getTrigger();

function setMessage(msg, aName) {
    if(chatWindow == "open") {
        console.log("No need to set message");
        return;
    }
    console.log("aName", aName);
    
    var chatMessage = document.createElement("div");
    chatMessage.id = "chat_message"
    chatMessage.classList.add("rheo-"+aName);
    var messages = [msg];
    
    messages.forEach( element => {
        var speechDiv = document.createElement("div");
        speechDiv.classList.add("rheo-speech-message");
        var pEle = document.createElement("p");
        var urlHost =  window.location.host;
    
        pEle.innerHTML = element;
        speechDiv.appendChild(pEle);
        chatMessage.appendChild(speechDiv);
    })
    
    var closeBtn = document.createElement("span");
    closeBtn.classList.add("rheo-close-message");
    closeBtn.innerHTML = "X";
    closeBtn.addEventListener("click", closeChatMessage);
    document.body.appendChild(chatMessage); 
    chatMessage.appendChild(closeBtn);
    
    var aa = document.getElementById('chat_message');
    var bb = aa.getElementsByClassName('rheo-speech-message');
    bb[bb.length - 1].style.marginBottom = "0px"
    
}

function closeChatMessage() {
    var chatMessage = document.getElementById('chat_message');
    if(chatMessage) {
        chatMessage.classList.add("dn");
    }
}
