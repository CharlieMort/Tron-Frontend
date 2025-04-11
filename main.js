let player;
let player2;
let grid;

function Start() {
    player = new Bike(100, 600)
    player2 = new Bike(400, 600, "#FFA500", 1)
    document.addEventListener('keypress', function(event) {
        //console.log('Key pressed: ' + event.key + player.direction);
        switch(event.key.toLowerCase()) {
            case "d":
                player.signalRight()
                break;
            case "a":
                player.signalLeft()
                break;
            case "j":
                player2.signalLeft();
                break;
            case "l":
                player2.signalRight();
                break;
        }
    });

    grid = [];
    for (let i = 0; i<gridHeight/gridSize; i++) {
        let tmp = []
        for (let j = 0; j<gridWidth/gridSize; j++) {
            tmp.push("");
        }
        grid.push(tmp)
    }
}

function Update() {
    player.Update()
    player2.Update()
    grid.map((row, r) => {
        row.map((ele, c) => {
            if (ele == `${player.id}`) {
                drawRect(c*gridSize, r*gridSize, gridSize, gridSize, player.color)
            } else if (ele == `${player2.id}`) {
                drawRect(c*gridSize, r*gridSize, gridSize, gridSize, player2.color)
            }
        })
    })
}