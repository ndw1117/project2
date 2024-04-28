
/*  The following code & structure was adapted from a personal project on particle systems, inspired by a tutorial 
    from Franks Laboratory: https://www.youtube.com/c/Frankslaboratory
*/

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

// Special particles that contain content and have additional behavior
class ContentParticle extends Particle {
    constructor(effect, coordinates, project) {
        // Call the constructor of the parent class (Particle) using super()
        super(effect);

        // Add or override properties specific to special particles

        this.radius = 40; // Set a larger radius for special particles
        this.x = coordinates.x;
        this.y = coordinates.y;
        this.anchorX = this.x;
        this.anchorY = this.y;

        // The data for the corresponding project
        this.project = project;

        this.img = new Image();
        this.img.src = `data:${this.project.imageType};base64,${this.project.image}`;

    }

    draw(context) {
        // First, draw particle using super class's draw() method
        super.draw(context);

        // Draw the content image on the particle
        this.drawImage(context);
    }

    drawImage(context) {

        // Draw the content image
        // const img = new Image();
        // img.src = this.imgPath;
        const imgWidth = (this.radius * 0.85) * 2;
        const imgHeight = (this.radius * 0.85) * 2;
        const imgX = this.x - (imgWidth / 2);
        const imgY = this.y - (imgHeight / 2);
        const cornerRadius = imgWidth / 2;

        context.save();
        context.beginPath();
        context.moveTo(imgX + cornerRadius, imgY);
        context.arcTo(imgX + imgWidth, imgY, imgX + imgWidth, imgY + imgHeight, cornerRadius);
        context.arcTo(imgX + imgWidth, imgY + imgHeight, imgX, imgY + imgHeight, cornerRadius);
        context.arcTo(imgX, imgY + imgHeight, imgX, imgY, cornerRadius);
        context.arcTo(imgX, imgY, imgX + imgWidth, imgY, cornerRadius);
        context.closePath();
        context.clip();


        context.drawImage(this.img, imgX, imgY, imgWidth, imgHeight);
        context.restore();
    }

    reset(index) {
        this.x = this.effect.contentParticleCoordinates[index].x;
        this.y = this.effect.contentParticleCoordinates[index].y;

        this.anchorX = this.x;
        this.anchorY = this.y;
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
        this.numberOfParticles = 64;    // Must be divisible by maxContentParticles
        this.maxContentParticles = 8;   // Must be a factor or numberOfParticles
        this.contentParticleCoordinates = this.calcContentCoordinates();

        canvas.onclick = e => { this.showContent(e) };

        this.projects;

        // The following will be utilized in certain functions to reference canvas coordinates instead of screen coordinates
        // this.rect = canvas.getBoundingClientRect(); // Gets the bounds of the canvas
        // this.scaleX = canvas.width / this.rect.width;    // Relationship bitmap vs element for X
        // this.scaleY = canvas.height / this.rect.height;  // Relationship bitmap vs element for Y

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
            const scaleX = canvas.width / rect.width;    // Relationship bitmap vs element for X
            const scaleY = canvas.height / rect.height;  // Relationship bitmap vs element for Y

            this.mouse.x = (event.clientX - rect.left) * scaleX; // X coordinate within the canvas
            this.mouse.y = (event.clientY - rect.top) * scaleY;  // Y coordinate within the canvas
        };


        window.onresize = () => {
            this.resize(this.canvas.clientWidth, this.canvas.clientHeight);
        }

        // We are calling the function but not awaiting it here
        this.init();

    }

    async init() {
        this.projects = await this.loadProjectsFromServer();
        this.createParticles();
    }

    loadProjectsFromServer = async () => {
        const response = await fetch(`/getRandomProjects?num=${this.maxContentParticles}`);
        const data = await response.json();
        return data.projects;
    };

    createParticles() {
        for (let i = 0; i < this.numberOfParticles; i++) {
            if (i % (this.numberOfParticles / this.maxContentParticles) === 0) {
                let contentIndex = i / (this.numberOfParticles / this.maxContentParticles);
                // Only add the content particle if we have a project to assign it
                if (this.projects[contentIndex]) {
                    this.particles.push(new ContentParticle(this, this.contentParticleCoordinates[contentIndex], this.projects[contentIndex]));
                }
            }
            else {
                this.particles.push(new Particle(this));
            }
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

                if (distance < maxDistance) {
                    context.save();
                    const opacity = 1 - (distance / maxDistance);
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

        this.contentParticleCoordinates = this.calcContentCoordinates();

        let index = 0;
        this.particles.forEach(particle => {
            if (particle instanceof ContentParticle) {
                particle.reset(index);
                index++;
            }
            else {
                particle.reset();
            }
        });
    }

    calcContentCoordinates() {
        return [
            { x: Math.floor(this.width * .40), y: Math.floor(this.height * .65) }, // Position 4
            { x: Math.floor(this.width * .60), y: Math.floor(this.height * .35) }, // Position 5

            { x: Math.floor(this.width * .13), y: Math.floor(this.height * .14) }, //Position 1  (About 200, 100)
            { x: Math.floor(this.width * .88), y: Math.floor(this.height * .70) },  // Position 8  (About 1350, 500)

            { x: Math.floor(this.width * .14), y: Math.floor(this.height * .77) }, // Position 2  (About 220, 550)
            { x: Math.floor(this.width * .846), y: Math.floor(this.height * .21) },// Position 7  (About 1300, 150)

            { x: Math.floor(this.width * .30), y: Math.floor(this.height * .40) }, // Position 3
            { x: Math.floor(this.width * .65), y: Math.floor(this.height * .77) } // Position 6
        ]
    }

    showContent(event) {

        const rect = canvas.getBoundingClientRect(); // Gets the bounds of the canvas
        const scaleX = canvas.width / rect.width;    // Relationship bitmap vs element for X
        const scaleY = canvas.height / rect.height;  // Relationship bitmap vs element for Y

        const mouseX = (event.clientX - rect.left) * scaleX; // X coordinate within the canvas
        const mouseY = (event.clientY - rect.top) * scaleY;  // Y coordinate within the canvas

        const focusParticle = document.querySelector("#focusParticle");

        if (focusParticle.style.display === "flex") {
            focusParticle.style.display = "none";
            return;
        }

        this.particles.forEach(particle => {
            if (particle instanceof ContentParticle) {
                const distance = Math.sqrt(Math.pow(mouseX - particle.x, 2) + Math.pow(mouseY - particle.y, 2));
                if (distance <= particle.radius) {
                    // This means a content particle was clicked, so the focused content particle should be shown
                    focusParticle.style.display = "flex";
                    this.setProjectInfo(particle.project);
                    return;
                }
            }
        });
    }

    setProjectInfo(project) {
        const focusParticle = document.querySelector("#focusParticle");

        focusParticle.querySelector("#focusTitle").innerHTML = project.title;
        focusParticle.querySelector("img").src = `data:${project.imageType};base64,${project.image}`;
        focusParticle.querySelector("#focusDescription").innerHTML = project.description;
        
        if (project.link) {
            const link = focusParticle.querySelector("a");
            link.href = project.link;
            link.style.visibility = 'visible';
        }
        else {
            focusParticle.querySelector("a").visibility = 'hidden';
        }

        focusParticle.querySelector("#creator").innerHTML = `<b>Creator: <b>${project.ownerName}`;

        if (project.ownerEmail) {
            const contact = focusParticle.querySelector("#contact");
            contact.innerHTML = `<b>Contact: <b>${project.ownerEmail}`;
            contact.style.visibility = 'visible';
        }
        else {
            focusParticle.querySelector("#contact").visibility = 'hidden';
        }
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