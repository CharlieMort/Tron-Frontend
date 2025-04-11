const fps = 30;
const intro_delay = 0.5;
let c = undefined;
let canvas = undefined;
let globalX = 0;
let globalY = 0;

setTimeout(() => {
    c = document.getElementById("canvas");
    canvas = c.getContext("2d");
    Start();
    setInterval(() => {
        canvas.reset()
        canvas.translate(globalX, globalY);
        Update();
    }, 1000/fps)
}, intro_delay)

function Translate(x, y) {
    globalX += x
    globalY += y
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
        canvas.fillStyle = this.color
        canvas.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Bike extends GameObject {
    constructor() {
        super(20, 20, 200, 300, "#00ffff")
        this.body = new Rect(this.width, this.height, this.x, this.y, this.color);
        this.direction = 1
        this.speed = 2 // has to be a factor of grid size - 20
        this.turnQ = []
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
        
        if (this.x%this.width == 0 && this.y%this.height == 0) {
            let dir = this.turnQ.pop()
            if (dir == "r") {
                this.turnRight()
            } else if (dir == "l") {
                this.turnLeft()
            }
            this.turnQ = []
        }

        this.body.x = this.x
        this.body.y = this.y
        this.body.Draw()
    }
}