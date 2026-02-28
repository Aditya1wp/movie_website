const data = [
  "NFL, NHL, CNBC, CNN, Fox TV, BBC, ABC, Fashion TV",
  "NFL, NHL, Villo Tennis, Villo Football, Villo Baseball",
  "Sun TV, Star Vijay, Zee Tamil, Colors Tamil, Jaya TVo",
  "Gemini TV, MAA TV, Zee Telugu, Star Maa, ETV HD",
  "Zee24Taas, Saam TV, 9X Jhakaas, Colors Marathi",
  "Asianet, Asianet Movies, Surya TV, Flowers TV",
  "Colors Kannada, Udaya TV, Zee Kannada, TV9 Karnataka",
  "Colors Bangla, Star Jalsha, Zee Bangla, Sony Aath",
  "9X Tashan, DD Punjabi, PTC Punjabi, Zee Punjabi",
  "DD Girnar, Colors Gujarati, ABP Asmita, GSTV",
  "Zee TV, Star Plus, Sony, Colors, Zee Cinema"

];

const heading = [
"American",
"American Sport",
"Tamil",
"telugu",
"Marathi",
"Malayalam",
"Kannada",
"Bangali",
"Punjabi",
"Gujarati",
"Hindi"
];

const container = document.querySelector(".channel-box");


for (let i = 0; i < data.length; i++) {
  const box = document.createElement("div");
  box.className = "channel-box-1";

  box.innerHTML = `
    <p class="channel-box-heading">${heading[i]}</p>
    <p class="channel-box-content">${data[i]}</p>
  `;

  container.appendChild(box);
}




// For the Plans tab
document.querySelector('.plans').onclick = function() {
  document.getElementById('main_Payment_card').scrollIntoView({ behavior: 'smooth' });
};

// For the Features tab
document.querySelector('.Features').onclick = function() {
  document.getElementById('features-section').scrollIntoView({ behavior: 'smooth' });
};

// For the Contact tab
document.querySelector('.Contact').onclick = function() {
  document.getElementById('contact-section').scrollIntoView({ behavior: 'smooth' });
};

// Animated Background
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// Mouse position
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 80) * (canvas.width / 80)
}

window.addEventListener('mousemove',
    function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

// Create Particle
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    // Method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#00bfff';
        ctx.fill();
    }
    // Check particle position, check mouse position, move the particle, draw the particle
    update() {
        // Check if particle is still within canvas
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Check collision detection - mouse position / particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x -= 3;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x += 3;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y -= 3;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y += 3;
            }
        }
        
        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;
        
        // Draw particle
        this.draw();
    }
}

// Create particle array
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 2) - 1;
        let directionY = (Math.random() * 2) - 1;
        let color = '#00bfff';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth, innerHeight);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
}

window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = ((canvas.height/80) * (canvas.height/80));
    init();
});

window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
})

init();
animate();