const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggle.querySelector('i');

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Switch icon between Moon and Sun
    if (body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});

// --- 3D Background Animation ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height;

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resize);
resize();

// 3D Sphere Configuration
const particles = [];
const particleCount = 600; // Number of dots
const sphereRadius = 250;  // Size of the sphere

// Generate particles using Golden Angle for even distribution
for(let i = 0; i < particleCount; i++) {
    const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    
    const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
    const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
    const z = sphereRadius * Math.cos(phi);
    
    particles.push({x, y, z});
}

let rotX = 0;
let rotY = 0;
let targetRotX = 0;
let targetRotY = 0;

// Mouse interaction
document.addEventListener('mousemove', (e) => {
    targetRotY = (e.clientX - width/2) * 0.001;
    targetRotX = (e.clientY - height/2) * 0.001;
});

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Smooth rotation interpolation
    rotX += (targetRotX - rotX) * 0.05;
    rotY += (targetRotY - rotY) * 0.05;
    
    // Check theme for particle color
    const isDark = document.body.classList.contains('dark-mode');
    // Blue in light mode, White in dark mode
    const color = isDark ? '255, 255, 255' : '32, 80, 221'; 
    
    particles.forEach(p => {
        // Rotate Y axis
        let x1 = p.x * Math.cos(rotY) - p.z * Math.sin(rotY);
        let z1 = p.x * Math.sin(rotY) + p.z * Math.cos(rotY);
        
        // Rotate X axis
        let y1 = p.y * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = p.y * Math.sin(rotX) + z1 * Math.cos(rotX);
        
        // Perspective Projection
        const scale = 400 / (400 + z2); // Field of view
        const x2d = x1 * scale + width/2;
        const y2d = y1 * scale + height/2;
        
        // Draw Particle
        const alpha = (z2 + sphereRadius) / (2 * sphereRadius); // Fade distant particles
        const size = Math.max(0.5, 2 * scale);
        
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fill();
    });
    
    requestAnimationFrame(animate);
}

animate();

// --- Search Button Logic ---
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('movie-search');

function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
        // Store original icon
        const originalContent = searchBtn.innerHTML;
        
        // Change to spinner and disable
        searchBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
        searchBtn.disabled = true;
        
        // Simulate API call (2 seconds)
        setTimeout(() => {
            // Revert changes
            searchBtn.innerHTML = originalContent;
            searchBtn.disabled = false;
        }, 2000);
    }
}

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});