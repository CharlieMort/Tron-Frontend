const fps = 30;
const intro_delay = 1;
let c = undefined;
let canvas = undefined;
const gridSize = 10;
const gridWidth = 500;
const gridHeight = 800;
let mouseX = 0
let mouseY = 0
let clicked = false

setTimeout(() => {
    c = document.getElementById("canvas");
    canvas = c.getContext("2d");
    Start();
    setInterval(() => {
        canvas.reset()
        Update();
    }, 1000/fps)
}, intro_delay)

function mouseMoveHandler(e) {
    var rect = c.getBoundingClientRect();
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
  }

document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("mousedown", (event) => {
    clicked = true;
    console.log("mousedown");
});
document.addEventListener("mouseup", (event) => {
    clicked = false
    console.log("mouseup")
});

function drawRect(x, y, w, h, c) {
    canvas.shadowColor = c
    canvas.shadowBlur = gridSize/2
    canvas.shadowOffsetX = -2
    canvas.fillStyle = c
    canvas.fillRect(x, y, w, h);

    canvas.shadowColor = c
    canvas.shadowBlur = gridSize/2
    canvas.shadowOffsetX = 2
    canvas.fillStyle = c
    canvas.fillRect(x, y, w, h);
}

function drawStrokeRect(x, y, w, h, c) {
    canvas.shadowColor = c
    canvas.shadowBlur = gridSize/2
    canvas.shadowOffsetX = -2
    canvas.strokeStyle = c
    canvas.lineWidth = 3
    canvas.strokeRect(x, y, w, h);

    canvas.shadowOffsetX = 2
    canvas.strokeRect(x, y, w, h);

    canvas.shadowOffsetY = 2
    canvas.strokeRect(x, y, w, h);
    canvas.shadowOffsetY = -2
    canvas.strokeRect(x, y, w, h);
}

function drawText(txt, x, y, s, c, f="Arial", sc) {
    canvas.font = `${s}px ${f}`;
    canvas.textAlign = "center"
    canvas.fillStyle = c
    if (sc) {
        canvas.shadowColor = c
        canvas.shadowBlur = gridSize/2
        canvas.shadowOffsetX = -5
        canvas.shadowOffsetY = -5
    } else {
        canvas.shadowBlur = 0
    }
    canvas.fillText(`${txt}`, x, y)
}

function drawButton(txt, x, y, w, h, ts, sc, tc, f="Arial") {
    drawStrokeRect(x, y, w, h, sc)
    drawText(txt, x+w/2, y+h/1.75, ts, tc, f)
} 

class GameObject {
    constructor(width, height, x, y, color) {
        this.width = width
        this.height = height
        this.x = x;
        this.y = y;
        this.color = color
    }
}

class Button {
    constructor(txt, x, y, w, h, ts, sc, tc, f, och) {
        this.txt = txt;
        this.x = x
        this.y = y
        this.width = w
        this.height = h
        this.textSize = ts
        this.strokeColor = sc
        this.textColor = tc
        this.font = f
        this.hoverColor = "#ffa500"
        this.standardColor = this.strokeColor
        this.onClickHandler = och
    }

    Draw() {
        drawButton(this.txt, this.x, this.y, this.width, this.height, this.textSize, this.strokeColor, this.textColor, this.font)
    }

    Update() {
        if (mouseX >= this.x && mouseX <= this.x+this.width && mouseY >= this.y && mouseY <= this.y+this.height) {
            this.textColor = this.hoverColor
            this.strokeColor = this.hoverColor
            if (clicked) {
                this.OnClick()
            }
        } else {
            this.textColor = this.standardColor
            this.strokeColor = this.standardColor
        }
        this.Draw()
    }

    OnClick() {
        clicked = false
        this.onClickHandler()
    }
}

class Rect extends GameObject {
    constructor(width, height, x, y, color) {
        super(width, height, x, y, color)
    }

    Draw() {
        drawRect(this.x, this.y, this.width, this.height, this.color)
    }
}

class Bike extends GameObject {
    constructor(x=200, y=300, color="#00ffff", id, online=false) {
        super(gridSize, gridSize, x, y, color)
        this.startX = x
        this.startY = y
        this.body = new Rect(this.width, this.height, this.x, this.y, this.color);
        this.direction = 1
        this.speed = 5 // has to be a factor of grid size - 20
        this.turnQ = []
        this.id = id
        this.alive = true
        this.online = online
    }

    reset() {
        this.alive = true;
        this.x = this.startX
        this.y = this.startY
        this.turnQ = []
        this.direction = 1
        console.log("reset")
    }

    signalRight() {
        this.turnQ.push("r")
        console.log(this.turnQ)
    }

    signalLeft() {
        this.turnQ.push("l")
        console.log(this.turnQ)
    }

    turnRight() {
        this.direction += 1
        if (this.direction >= 5) this.direction = 1
    }

    turnLeft() {
        this.direction -= 1
        if (this.direction <= 0) this.direction = 4
    }

    Update() {
        if (this.alive && running) {
            switch(this.direction) {
                case 1:
                    this.y -= this.speed;
                    break;
                case 2:
                    this.x += this.speed;
                    break;
                case 3:
                    this.y += this.speed;
                    break;
                case 4:
                    this.x -= this.speed;
                    break;
            }
        }

        if (this.x < 0 || this.y < 0 || this.x > gridWidth || this.y > gridHeight) {
            this.alive = false;
        }
        
        if (this.x%gridSize == 0 && this.y%gridSize == 0) {
            let dir = this.turnQ.pop()
            if (dir == "r") {
                this.turnRight()
            } else if (dir == "l") {
                this.turnLeft()
            }
            this.turnQ = []
            if (grid[Math.floor(this.y/gridSize)][Math.floor(this.x/gridSize)] != "") {
                this.alive = false;
            } else {
                if (this.online) {
                    let xgrid = Math.floor(this.x/gridSize)
                    let ygrid = Math.floor(this.y/gridSize)
                    ws.send(JSON.stringify({
                        Type: "gameUpdate",
                        Data: `${xgrid},${ygrid},${this.id}`
                    }))
                    gridRemove.push([xgrid, ygrid, 6000])
                } else {
                    let xgrid = Math.floor(this.x/gridSize)
                    let ygrid = Math.floor(this.y/gridSize)
                    grid[ygrid][xgrid] = `${this.id}`
                    gridRemove.push([xgrid, ygrid, 6000])
                }
            }
        }

        this.body.x = this.x
        this.body.y = this.y
        this.body.Draw()
    }
}