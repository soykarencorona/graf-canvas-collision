const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#D8BFD8";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.originalColor = color;
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() < 0.5 ? -1 : 1) * this.speed;
        this.dy = (Math.random() < 0.5 ? -1 : 1) * this.speed;
        this.isColliding = false;
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.fillStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context, circles) {
        this.posX += this.dx;
        this.posY += this.dy;

        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.checkCollision(circles);
        this.draw(context);
    }

    checkCollision(circles) {
        this.isColliding = false;
        for (let other of circles) {
            if (this !== other) {
                let dx = this.posX - other.posX;
                let dy = this.posY - other.posY;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.radius + other.radius) {
                    this.isColliding = true;
                    this.resolveCollision(other);
                }
            }
        }
        
        this.color = this.isColliding ? "#0000FF" : this.originalColor;
    }

    resolveCollision(other) {
        let tempDx = this.dx;
        let tempDy = this.dy;
        
        this.dx = other.dx;
        this.dy = other.dy;
        
        other.dx = tempDx;
        other.dy = tempDy;
    }
}

let circles = [];

function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20;
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = Math.random() * (window_height - radius * 2) + radius;
        let color = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
        let speed = Math.random() * 4 + 1;
        let text = `C${i + 1}`;
        
        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    circles.forEach(circle => circle.update(ctx, circles));
    requestAnimationFrame(animate);
}

generateCircles(10);
animate();
