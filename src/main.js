let player;
let player2;
let grid;
let score = 0;
let score2 = 0;
let running = true;
let countdown = 0;
let gamestate = "titleScreen"

let localBut;
let onlineBut;

let openGames = [
    {
        id: 0,
        playerName: "charlie"
    },
    {
        id: 1,
        playerName: "paul"
    },
    {
        id: 2,
        playerName: "mark"
    }
]

function Start() {
    StartTitle()
}

function Update() {
    switch(gamestate) {
        case "titleScreen":
            TitleLoop()
            break;
        case "lobby":
            LobbyLoop()
            break;
        case "hosting":
            HostLoop()
            break
        case "gaming":
            GameLoop()
            break;
    }
}

function StartTitle() {
    gamestate = "titleScreen"
    localBut = new Button("Local", 25, 500, 200, 100, 35, "#0ff", "#0ff", "Orbitron", () => {
        StartGame()
    })
    onlineBut = new Button("Online", 275, 500, 200, 100, 35, "#0ff", "#0ff", "Orbitron", () => {
        StartLobby()
    })
}

function TitleLoop() {
    drawText("Tron", gridWidth/2, gridHeight/2, 150, "#00ffff", "Orbitron", "#00cccc")
    localBut.Update()
    onlineBut.Update()
}

function StartLobby() {
    gamestate = "lobby"
    createGame = new Button("Host A Game", 50, 50, 400, 100, 50, "#0ff", "#0ff", "Orbitron", () => {
        StartHost()
    })
    openGames = openGames.map((game, idx) => {
        return {
            id: game.id,
            playerName: game.playerName,
            button: new Button(`Join ${game.playerName}`, 50, 275+(idx*125), 400, 100, 30, "#0ff", "#0ff", "Orbitron", () => {
                console.log(`Joined ${game.playerName}`)
            })
        }
    })
}

function LobbyLoop() {
    createGame.Update()
    drawText("Open Games", gridWidth/2, 225, 40, "#0ff", "Orbitron")
    openGames.map((game) => {
        game.button.Update()
    })
}

function StartHost() {
    gamestate = "hosting"
}

function HostLoop() {
    drawText("Hosting Game", gridWidth/2, gridHeight/2-50, 50, "#00ffff", "Orbitron", "#00cccc")
    drawText("Waiting for player to join", gridWidth/2, gridHeight/2, 35, "#00ffff", "Orbitron", "#00cccc")
}

function StartGame() {
    gamestate = "gaming"
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

    resetGrid()
}

function GameLoop() {
    player.Update()
    player2.Update()

    if (running) {
        if (player.alive && !player2.alive) {
            score += 1
            nextRound()
        }
        if (player2.alive && !player.alive) {
            score2 += 1
            nextRound()
        }
        if (!player2.alive && !player.alive) {
            nextRound()
        }
    } else if (countdown >= 0.1) {
        countdown -= 1/fps
        canvas.font = "100px Arial";
        canvas.textAlign = "center"
        canvas.fillStyle = "#00ffff"
        canvas.fillText(`${Math.ceil(countdown)}`, gridWidth/2, gridHeight/2-100)
    } else {
        resetGrid()
        resetPlayers()
        running = true
    }

    drawText(`${score} - ${score2}`, gridWidth/2, gridHeight/2, 100, "#ffa500")

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

function nextRound() {
    countdown = 2
    running = false
}

function resetPlayers() {
    player.reset()
    player2.reset()
}

function resetGrid() {
    grid = [];
    for (let i = 0; i<gridHeight/gridSize; i++) {
        let tmp = []
        for (let j = 0; j<gridWidth/gridSize; j++) {
            tmp.push("");
        }
        grid.push(tmp)
    }
}