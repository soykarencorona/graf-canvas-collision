const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const window_width = window.innerWidth;
const window_height = window.innerHeight;
canvas.width = window_width;
canvas.height = window_height;
canvas.style.background = "#D8BFD8";

document.body.style.margin = 0;
document.body.style.overflow = "hidden";

let circles = [];
let removedCircles = 0;

document.body.insertAdjacentHTML("beforeend", '<div id="counter" style="position: absolute; top: 10px; right: 20px; font-size: 20px; font-weight: bold;">Círculos eliminados: 0</div>');
const counterElement = document.getElementById("counter");

class Circle {
    constructor(x, radius, color, speed) {
        this.posX = x;
        this.posY = radius; // Inicia justo debajo del margen superior
        this.radius = radius;
        this.originalColor = color;
        this.color = color;
        this.speed = speed;
        this.dy = speed;
        this.dx = (Math.random() * 2 - 1) * 2; // Movimiento horizontal aleatorio
        this.isColliding = false;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.closePath();
    }

    update(circles) {
        this.posY += this.dy;
        this.posX += this.dx;
        
        // Rebote en los bordes superior e inferior
        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }
        
        // Rebote en los bordes laterales
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }

        this.checkCollision(circles);
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

    isClicked(mouseX, mouseY) {
        let dx = mouseX - this.posX;
        let dy = mouseY - this.posY;
        return Math.sqrt(dx * dx + dy * dy) < this.radius;
    }
}

function generateCircle() {
    let radius = Math.random() * 30 + 20;
    let x = Math.random() * (window_width - radius * 2) + radius;
    let color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    let speed = Math.random() * 4 + 1;
    
    circles.push(new Circle(x, radius, color, speed));
}

function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        generateCircle();
    }
}

function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    circles.forEach(circle => {
        circle.update(circles);
        circle.draw(ctx);
    });
    requestAnimationFrame(animate);
}

canvas.addEventListener("click", (event) => {
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    
    for (let i = circles.length - 1; i >= 0; i--) {
        if (circles[i].isClicked(mouseX, mouseY)) {
            circles.splice(i, 1);
            removedCircles++;
            counterElement.textContent = `Círculos eliminados: ${removedCircles}`;
            generateCircle(); // Generar un nuevo círculo cuando se elimina uno
            break;
        }
    }
});

generateCircles(10);
animate();
