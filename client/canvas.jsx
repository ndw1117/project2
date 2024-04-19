
// Setup

const canvas = document.querySelector("#mainCanvas");
const ctx = canvas.getContext("2d");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, "white");
gradient.addColorStop(0.5, "lightskyblue");
gradient.addColorStop(1, "deepskyblue");
ctx.fillStyle = gradient;
ctx.strokeStyle = "white";

// The "blueprint" to create individual particle objects
class Particle {
    constructor(effect) {
        this.effect = effect;
        this.radius = Math.floor(Math.random() * 4 + 3);
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        if ((this.x + this.radius) > (this.effect.width * 0.2) && (this.x - this.radius) < (this.effect.width * 0.8)) {
            if (Math.random() < 0.5) {
                this.y = this.radius + Math.random() * ((this.effect.height * 0.2) - this.radius * 2);
            }
            else {
                this.y = (this.radius + (this.effect.height * 0.8)) + Math.random() * ((this.effect.height * 0.2) - this.radius * 2);
            }
        }
        else {
            this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
        }
    
        this.vx = (Math.random() - 0.5) * 0.16; // Value between -0.08 and 0.08
        this.vy = (Math.random() - 0.5) * 0.16;

        this.anchorX = this.x;
        this.anchorY = this.y;
        this.pullX = 0;
        this.pullY = 0;

        this.pushX = 0;
        this.pushY = 0;
    }

    draw(context) {
        // context.fillStyle = `hsl(${this.x * 0.28}, 100%, 50%)`;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        // Can include stroke if visually desired, but strokes on circles are more computationally intensive
        //context.stroke();
    }

    update() {

        let distanceTrig = this.calcDistance(this.x, this.y, this.effect.mouse.x, this.effect.mouse.y);

        if (distanceTrig.distance < this.effect.mouse.radius) {
            // const force = (this.effect.mouse.radius / distanceTrig.distance);
            const angle = Math.atan2(distanceTrig.dy, distanceTrig.dx);
            // this.pushX += Math.cos(angle) * force;
            // this.pushY += Math.sin(angle) * force;
            this.pushX = Math.cos(angle) * 0.12; // Value between 0 and 0.12
            this.pushY = Math.sin(angle) * 0.12;
        }
        else {
            this.pushX = 0;
            this.pushY = 0;
        }
        

        // Makes sure particles stay in their movement radius

        distanceTrig = this.calcDistance(this.x, this.y, this.anchorX, this.anchorY);

        if (distanceTrig.distance >= (this.radius * 3)) {
            // const force = -(distanceTrig.distance / (this.radius * 3));
            const angle = Math.atan2(distanceTrig.dy, distanceTrig.dx);
            // this.pullX += Math.cos(angle) * force;
            // this.pullY += Math.sin(angle) * force;
            this.pullX = Math.cos(angle) * -0.1; // Value between 0 and 0.1
            this.pullY = Math.sin(angle) * -0.1;
        }
        else if (distanceTrig.distance < 0.5) {
            this.pullX = 0;
            this.pullY = 0;

            // The particle will then start moving in a new direction/speed than before it returned to anchor
            // this.vx = (Math.random() - 0.5) * 0.16; // Value between -0.08 and 0.08
            // this.vy = (Math.random() - 0.5) * 0.16;
        }


        this.x += this.pushX + this.pullX + this.vx;
        this.y += this.pushY + this.pullY + this.vy;


        // Makes sure particles stay in canvas
        if (this.x < this.radius) {
            this.x = this.radius;
            this.vx *= -1;
        }
        else if (this.x > this.effect.width - this.radius) {
            this.x = this.effect.width - this.radius;
            this.vx *= -1;
        }

        if (this.y < this.radius) {
            this.y = this.radius;
            this.vy *= -1;
        }
        else if (this.y > this.effect.height - this.radius) {
            this.y = this.effect.height - this.radius;
            this.vy *= -1;
        }

    }

    reset() {
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        if ((this.x + this.radius) > (this.effect.width * 0.2) && (this.x - this.radius) < (this.effect.width * 0.8)) {
            if (Math.random() < 0.5) {
                this.y = this.radius + Math.random() * ((this.effect.height * 0.2) - this.radius * 2);
            }
            else {
                this.y = (this.radius + (this.effect.height * 0.8)) + Math.random() * ((this.effect.height * 0.2) - this.radius * 2);
            }
        }
        else {
            this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
        }

        this.anchorX = this.x;
        this.anchorY = this.y;
    }

    calcDistance(x1, y1, x2, y2) {
        const dx = x1 - x2;
        const dy = y1 - y2;

        const distanceTrig = {
            dx: dx,
            dy: dy,
            distance: Math.hypot(dx, dy)
        }
        return distanceTrig;
    }
}

// The "brain" of the code. Manages all particles
class Effect {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 60;
        this.createParticles();

        this.mouse = {
            x: -100,
            y: -100,
            radius: 100,
        }

        // window.onmousemove = e => {
        //     this.mouse.x = e.x;
        //     this.mouse.y = e.y;
        // }

        canvas.onmousemove = (event) => {
            const rect = canvas.getBoundingClientRect(); // Gets the bounds of the canvas
            const scaleX = canvas.width / rect.width;    // Relationship bitmap vs. element for X
            const scaleY = canvas.height / rect.height;  // Relationship bitmap vs. element for Y
        
            this.mouse.x = (event.clientX - rect.left) * scaleX; // X coordinate within the canvas
            this.mouse.y = (event.clientY - rect.top) * scaleY;  // Y coordinate within the canvas
        
            console.log(`Mouse coordinates relative to canvas: X=${this.mouse.x}, Y=${this.mouse.y}`);
        };


        window.onresize = () => {
            this.resize(this.canvas.clientWidth, this.canvas.clientHeight);
        }

    }

    createParticles() {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this));
        }
    }

    handleParticles(context) {
        this.connectParticles(context);
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        });

    }

    connectParticles(context) {
        const maxDistance = 100;
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a; b < this.particles.length; b++) {
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.hypot(dx, dy);

                if (distance < maxDistance){
                    context.save();
                    const opacity = 1 - (distance/maxDistance);
                    context.globalAlpha = opacity;
                    context.beginPath();
                    context.moveTo(this.particles[a].x, this.particles[a].y);
                    context.lineTo(this.particles[b].x, this.particles[b].y);
                    context.stroke();
                    context.restore();
                } 
            }
        }
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;

        const gradient = this.context.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "white");
        gradient.addColorStop(0.5, "lightskyblue");
        gradient.addColorStop(1, "deepskyblue");
        this.context.fillStyle = gradient;
        this.context.strokeStyle = "white";

        this.particles.forEach(particle => {
            particle.reset();
        })
    }
}

const effect = new Effect(canvas, ctx);

// Runs in a loop, redrawing the shapes
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles(ctx);
    requestAnimationFrame(animate);
}

animate();