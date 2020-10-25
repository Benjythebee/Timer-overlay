document.addEventListener('DOMContentLoaded', function () {

    const bg = chrome.extension.getBackgroundPage()

    var keyCode = "w"
  
    document.querySelector('#spawn').addEventListener('click', onclick)

    document.querySelector('#key').addEventListener('click', listenKey)

    function onclick () {

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id,  {action: 'Timer',key:keyCode}, function(response) {
                console.log(response)
                return true
            })
        })
    }

    function listenKey () {
        console.log("Listening to key")
        document.querySelector('#key').textContent= "..."
        document.body.addEventListener('keyup', function(event) {
            bg.console.log(event.key);
            document.querySelector('#key').textContent= event.key.toUpperCase()
            keyCode= event.key
          },{once:true});

    }
  })