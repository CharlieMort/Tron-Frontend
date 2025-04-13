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
let oppColor;

let ws

let openGames = []

function SetupWebsocket() {
    ws = new WebSocket("http://86.30.150.227:3001/ws")
    ws.addEventListener("open", (event) => {
        StartLobby()
    })
    ws.addEventListener("message", (event) => {
        let packet = JSON.parse(event.data)
        switch(packet.type) {
            case "clientData":
                console.log("yes")
                break;
            case "gameList":
                openGamesArr = JSON.parse(packet.data)
                openGames = openGamesArr.map((game, idx) => {
                    return {
                        id: game,
                        button: new Button(`Join ${game}`, 50, 275+(idx*125), 400, 100, 30, "#0ff", "#0ff", "Orbitron", () => {
                            ws.send(JSON.stringify({
                                type: "joinGame",
                                data: game
                            }))
                        })
                    }
                })
                break;
            case "startGame":
                playerPos = packet.data
                console.log(playerPos)
                StartGameOnline()
                break;
            case "gameData":
                posData = packet.data.split(",")
                grid[parseInt(posData[1])][parseInt(posData[0])] = posData[2]
                break;
        }
    })
}

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
        case "gaminglocal":
            GameLoopLocal()
            break;
        case "gamingonline":
            GameLoopOnline()
            break;
    }
}

function StartTitle() {
    gamestate = "titleScreen"
    localBut = new Button("Local", 25, 500, 200, 100, 35, "#0ff", "#0ff", "Orbitron", () => {
        StartGameLocal()
    })
    onlineBut = new Button("Online", 275, 500, 200, 100, 35, "#0ff", "#0ff", "Orbitron", () => {
        SetupWebsocket()
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
        ws.send(JSON.stringify({
            type: "hostGame",
            data: ""
        }))
        StartHost()
    })
    refresh = new Button("⟳", 25, 200, 50, 50, 30, "#0ff", "#0ff", "Arial", () => {
        ws.send(JSON.stringify({
            type: "getGames",
            data: ""
        }))
    })
    ws.send(JSON.stringify({
        type: "getGames",
        data: ""
    }))
    openGames = []
}

function LobbyLoop() {
    createGame.Update()
    refresh.Update()
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

function StartGameOnline() {
    gamestate = "gamingonline"
    if (playerPos == 0) {
        player = new Bike(100, 600, "#00ffff", "#0ff", true)
        oppColor = "#ffa500"
        c.style.borderColor = "#ffa500"
    } else {
        player = new Bike(400, 600, "#FFA500", "#ffa500", true)
        oppColor = "#00ffff"
    }
    resetGrid()

    document.addEventListener('keypress', function(event) {
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

function GameLoopOnline() {
    player.Update()

    grid.map((row, r) => {
        row.map((ele, c) => {
            if (ele == `${player.id}`) {
                drawRect(c*gridSize, r*gridSize, gridSize, gridSize, player.color)
            } else if (ele != "" && ele != " ") {
                drawRect(c*gridSize, r*gridSize, gridSize, gridSize, oppColor)
            }
        })
    })
}

function StartGameLocal() {
    gamestate = "gaminglocal"
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

function GameLoopLocal() {
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