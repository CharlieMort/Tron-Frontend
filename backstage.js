const fps = 30;
const intro_delay = 0.5;
let c = undefined;
let canvas = undefined;
const gridSize = 10;
const gridWidth = 500;
const gridHeight = 800

setTimeout(() => {
    c = document.getElementById("canvas");
    canvas = c.getContext("2d");
    Start();
    setInterval(() => {
        canvas.reset()
        Update();
    }, 1000/fps)
}, intro_delay)

function drawRect(x, y, w, h, c) {
    canvas.fillStyle = c
    canvas.fillRect(x, y, w, h);
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

class Rect extends GameObject {
    constructor(width, height, x, y, color) {
        super(width, height, x, y, color)
    }

    Draw() {
        drawRect(this.x, this.y, this.width, this.height, this.color)
    }
}

class Bike extends GameObject {
    constructor(x=200, y=300, color="#00ffff", id) {
        super(gridSize, gridSize, x, y, color)
        this.body = new Rect(this.width, this.height, this.x, this.y, this.color);
        this.direction = 1
        this.speed = 5 // has to be a factor of grid size - 20
        this.turnQ = []
        this.id = id
        this.alive = true
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
        if (this.alive) {
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
                grid[Math.floor(this.y/gridSize)][Math.floor(this.x/gridSize)] = `${this.id}`
            }
        }

        this.body.x = this.x
        this.body.y = this.y
        this.body.Draw()
    }
}