const card = document.querySelector(".about-card");
const glow = document.querySelector(".card-glow");
const avatar = document.querySelector(".avatar-core");

card.addEventListener("mousemove", (e) => {
  const rect = card.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Glow follows cursor
  glow.style.left = `${x - 110}px`;
  glow.style.top = `${y - 110}px`;

  // Calculate rotation
  const rotateY = (x / rect.width - 0.5) * 18;
  const rotateX = (y / rect.height - 0.5) * -18;

  card.style.transform = `
        perspective(1200px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1.03)
    `;

  avatar.style.transform = `translateZ(80px) rotate(${rotateY * 0.6}deg) scale(1.06)`;

  document.querySelector(".ring-one").style.transform =
    `rotate(${rotateY * 2}deg)`;
  document.querySelector(".ring-two").style.transform =
    `rotate(${-rotateY * 2}deg)`;
  document.querySelector(".ring-three").style.transform =
    `rotate(${rotateY * 3}deg)`;
});

card.addEventListener("mouseleave", () => {
  card.style.transform = `
        perspective(1200px)
        rotateX(0deg)
        rotateY(0deg)
        scale(1)
    `;
  avatar.style.transform = `
        translateZ(80px)
        rotate(0deg)
        scale(1)
    `;
  document.querySelector(".ring-one").style.transform = `rotate(0deg)`;
  document.querySelector(".ring-two").style.transform = `rotate(0deg)`;
  document.querySelector(".ring-three").style.transform = `rotate(0deg)`;
});

const toolCards = document.querySelectorAll(".tool-card");
toolCards.forEach((card) => {
  const glow = card.querySelector(".tool-glow");
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glow.style.left = `${x - 125}px`;
    glow.style.top = `${y - 125}px`;
    const rotateY = (x / rect.width - 0.5) * 10;
    const rotateX = (y / rect.height - 0.5) * -10;
    card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-8px)
        `;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = `
            perspective(1000px)
            rotateX(0deg)
            rotateY(0deg)
            translateY(0)
        `;
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.25,
  },
);
toolCards.forEach((card) => observer.observe(card));

const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

let particles = [];

const mouse = {
  x: null,
  y: null,
  radius: 160,
};
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
class Particle {
  constructor() {
    this.reset();
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
  }
  reset() {
    this.radius = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * 0.35;
    this.speedY = (Math.random() - 0.5) * 0.35;
    const colors = ["#00F5FF", "#7C3AED", "#3B82F6"];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
    if (mouse.x !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x += dx * 0.02 * force * 20;
        this.y += dy * 0.02 * force * 20;
      }
    }
  }
  draw() {
    ctx.beginPath();
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 22;
    ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
    ctx.fillStyle = this.color + "20";
    ctx.fill();
  }
}
function createParticles() {
  particles = [];
  const amount = Math.floor(window.innerWidth / 45);
  for (let i = 0; i < amount; i++) {
    particles.push(new Particle());
  }
}
createParticles();
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}
animate();
const mouseLight = document.querySelector(".mouse-light");

window.addEventListener("mousemove", (e) => {
  mouseLight.style.left = e.clientX + "px";
  mouseLight.style.top = e.clientY + "px";
});

function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,245,255,${1 - dist / 120})`;
        ctx.lineWidth = 0.6;
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}
connectParticles();
