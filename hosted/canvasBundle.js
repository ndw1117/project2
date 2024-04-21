(()=>{const t=document.querySelector("#mainCanvas"),i=t.getContext("2d");t.width=t.clientWidth,t.height=t.clientHeight;const s=i.createLinearGradient(0,0,t.width,t.height);s.addColorStop(0,"white"),s.addColorStop(.5,"lightskyblue"),s.addColorStop(1,"deepskyblue"),i.fillStyle=s,i.strokeStyle="white";class h{constructor(t){this.effect=t,this.radius=Math.floor(4*Math.random()+3),this.x=this.radius+Math.random()*(this.effect.width-2*this.radius),this.x+this.radius>.2*this.effect.width&&this.x-this.radius<.8*this.effect.width?Math.random()<.5?this.y=this.radius+Math.random()*(.2*this.effect.height-2*this.radius):this.y=this.radius+.8*this.effect.height+Math.random()*(.2*this.effect.height-2*this.radius):this.y=this.radius+Math.random()*(this.effect.height-2*this.radius),this.vx=.16*(Math.random()-.5),this.vy=.16*(Math.random()-.5),this.anchorX=this.x,this.anchorY=this.y,this.pullX=0,this.pullY=0,this.pushX=0,this.pushY=0}draw(t){t.beginPath(),t.arc(this.x,this.y,this.radius,0,2*Math.PI),t.fill()}update(){let t=this.calcDistance(this.x,this.y,this.effect.mouse.x,this.effect.mouse.y);if(t.distance<this.effect.mouse.radius){const i=Math.atan2(t.dy,t.dx);this.pushX=.12*Math.cos(i),this.pushY=.12*Math.sin(i)}else this.pushX=0,this.pushY=0;if(t=this.calcDistance(this.x,this.y,this.anchorX,this.anchorY),t.distance>=3*this.radius){const i=Math.atan2(t.dy,t.dx);this.pullX=-.1*Math.cos(i),this.pullY=-.1*Math.sin(i)}else t.distance<.5&&(this.pullX=0,this.pullY=0);this.x+=this.pushX+this.pullX+this.vx,this.y+=this.pushY+this.pullY+this.vy,this.x<this.radius?(this.x=this.radius,this.vx*=-1):this.x>this.effect.width-this.radius&&(this.x=this.effect.width-this.radius,this.vx*=-1),this.y<this.radius?(this.y=this.radius,this.vy*=-1):this.y>this.effect.height-this.radius&&(this.y=this.effect.height-this.radius,this.vy*=-1)}reset(){this.x=this.radius+Math.random()*(this.effect.width-2*this.radius),this.x+this.radius>.2*this.effect.width&&this.x-this.radius<.8*this.effect.width?Math.random()<.5?this.y=this.radius+Math.random()*(.2*this.effect.height-2*this.radius):this.y=this.radius+.8*this.effect.height+Math.random()*(.2*this.effect.height-2*this.radius):this.y=this.radius+Math.random()*(this.effect.height-2*this.radius),this.anchorX=this.x,this.anchorY=this.y}calcDistance(t,i,s,h){const e=t-s,a=i-h;return{dx:e,dy:a,distance:Math.hypot(e,a)}}}const e=new class{constructor(t,i){this.canvas=t,this.context=i,this.width=this.canvas.width,this.height=this.canvas.height,this.particles=[],this.numberOfParticles=60,this.createParticles(),this.mouse={x:-100,y:-100,radius:100},t.onmousemove=i=>{const s=t.getBoundingClientRect(),h=t.width/s.width,e=t.height/s.height;this.mouse.x=(i.clientX-s.left)*h,this.mouse.y=(i.clientY-s.top)*e},window.onresize=()=>{this.resize(this.canvas.clientWidth,this.canvas.clientHeight)}}createParticles(){for(let t=0;t<this.numberOfParticles;t++)this.particles.push(new h(this))}handleParticles(t){this.connectParticles(t),this.particles.forEach((i=>{i.draw(t),i.update()}))}connectParticles(t){for(let i=0;i<this.particles.length;i++)for(let s=i;s<this.particles.length;s++){const h=this.particles[i].x-this.particles[s].x,e=this.particles[i].y-this.particles[s].y,a=Math.hypot(h,e);if(a<100){t.save();const h=1-a/100;t.globalAlpha=h,t.beginPath(),t.moveTo(this.particles[i].x,this.particles[i].y),t.lineTo(this.particles[s].x,this.particles[s].y),t.stroke(),t.restore()}}}resize(t,i){this.canvas.width=t,this.canvas.height=i,this.width=t,this.height=i;const s=this.context.createLinearGradient(0,0,t,i);s.addColorStop(0,"white"),s.addColorStop(.5,"lightskyblue"),s.addColorStop(1,"deepskyblue"),this.context.fillStyle=s,this.context.strokeStyle="white",this.particles.forEach((t=>{t.reset()}))}}(t,i);!function s(){i.clearRect(0,0,t.width,t.height),e.handleParticles(i),requestAnimationFrame(s)}()})();