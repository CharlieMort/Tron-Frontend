let player;

function Start() {
    player = new Bike()
    document.addEventListener('keypress', function(event) {
        //console.log('Key pressed: ' + event.key + player.direction);
        switch(event.key.toLowerCase()) {
            case "d":
                player.signalRight()
                break;
            case "a":
                player.signalLeft()
                break;
        }
    });
}

function Update() {
    player.Update()
}