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

// Animation loop
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

let currentMovies = []; // Store fetched movies here

async function performSearch() {
    const query = searchInput.value.trim();
    const externalLinkSection = document.getElementById('external-link-section');
    if (query) {
        // Store original icon
        const originalContent = searchBtn.innerHTML;
        
        // Change to spinner and disable
        searchBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
        searchBtn.disabled = true;
        
        // Show loading state for external links
        externalLinkSection.style.display = 'block';
        externalLinkSection.innerHTML = `
            <h2 style="color: white; margin-bottom: 15px; padding-left: 5px;">Download Links</h2>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button class="external-link-btn" disabled style="cursor: wait; opacity: 0.8;">
                    <i class="fa-solid fa-circle-notch fa-spin"></i> Generating...
                </button>
                <button class="external-link-btn" disabled style="background: linear-gradient(90deg, #00c6ff, #0072ff); cursor: wait; opacity: 0.8;">
                    <i class="fa-solid fa-circle-notch fa-spin"></i> Generating...
                </button>
                <button class="external-link-btn" disabled style="background: linear-gradient(90deg, #8e2de2, #4a00e0); cursor: wait; opacity: 0.8;">
                    <i class="fa-solid fa-circle-notch fa-spin"></i> Generating...
                </button>
            </div>
        `;

        try {
            const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_TOKEN}&query=${encodeURIComponent(query)}&language=en-US&page=1`;
            const response = await fetch(url);
            const data = await response.json();
            currentMovies = data.results || []; // Update global list

            const row = document.getElementById('movieRow');
            if (data.results && data.results.length > 0) {
                row.innerHTML = data.results.map(movie => `
                    <div class="movie-card" data-id="${movie.id}">
                      <img src="${movie.poster_path ? 'https://image.tmdb.org/t/p/w300' + movie.poster_path : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${movie.title}">
                      <p>${movie.title.length > 20 ? movie.title.substring(0, 20) + '...' : movie.title}</p>
                    </div>
                `).join('');
            } else {
                row.innerHTML = '<p style="text-align:center; width:100%; padding: 20px;">No results found.</p>';
            }

            // Generate and display the external link button
            const encodedQuery = encodeURIComponent(query);
            const olaMoviesUrl = `https://n1.olamovies.info/?s=${encodedQuery}`;
            const filmyzillaUrl = `https://www.google.com/m/search?q=${encodedQuery}&as_sitesearch=www.filmyzilla32.com`;
            const uhdMoviesUrl = `https://uhdmovies.loan/search/${encodedQuery}`;
            
            externalLinkSection.innerHTML = `
                <h2 style="color: white; margin-bottom: 15px; padding-left: 5px;">Download Links</h2>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <a href="${olaMoviesUrl}" target="_blank" class="external-link-btn">
                        Find '${query}' on OlaMovies
                    </a>
                    <a href="${filmyzillaUrl}" target="_blank" class="external-link-btn" style="background: linear-gradient(90deg, #00c6ff, #0072ff);">
                        Find '${query}' on FilmyZilla
                    </a>
                    <a href="${uhdMoviesUrl}" target="_blank" class="external-link-btn" style="background: linear-gradient(90deg, #8e2de2, #4a00e0);">
                        Find '${query}' on UHDMovies
                    </a>
                </div>
            `;
            externalLinkSection.style.display = 'block';

        } catch (error) {
            console.error("Search Error:", error);
            externalLinkSection.style.display = 'none';
            externalLinkSection.innerHTML = '';
        } finally {
            // Revert changes
            searchBtn.innerHTML = originalContent;
            searchBtn.disabled = false;
        }
    } else {
        // If query is empty, hide the external link section
        externalLinkSection.style.display = 'none';
        externalLinkSection.innerHTML = '';
    }
}

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

searchInput.addEventListener('input', () => {
    if (searchInput.value.trim() === '') {
        const externalLinkSection = document.getElementById('external-link-section');
        externalLinkSection.style.display = 'none';
        externalLinkSection.innerHTML = '';
    }
});

const TMDB_TOKEN = config.TMDB_TOKEN; // This is correct!

async function loadMovies() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_TOKEN}&language=en-US&page=1`;
  
  try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results) {
          // 1. RANDOMIZE: Shuffle the 20 results and pick 20 (enough for 4 slides of 5)
          const randomMovies = data.results.sort(() => Math.random() - 0.5).slice(0, 20);
          currentMovies = randomMovies; // Update global list

          // 2. RENDER: Put them on the screen
          const row = document.getElementById('movieRow');
          row.innerHTML = randomMovies.map(movie => `
            <div class="movie-card" data-id="${movie.id}">
              <img src="${movie.poster_path ? 'https://image.tmdb.org/t/p/w300' + movie.poster_path : 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${movie.title}">
              <p>${movie.title.length > 20 ? movie.title.substring(0, 20) + '...' : movie.title}</p>
            </div>
          `).join('');
      }
  } catch (error) {
      console.error("Error loading movies:", error);
  }
}

// 3. SCROLL LOGIC: For the buttons
function sideScroll(direction) {
  const row = document.getElementById('movieRow');
  const scrollAmount = row.clientWidth; // Scroll exactly one visible width
  if (direction === 'left') {
    row.scrollLeft -= scrollAmount;
  } else {
    row.scrollLeft += scrollAmount;
  }
}

loadMovies();

// --- Modal Logic ---
const modal = document.getElementById('movie-modal');
const closeBtn = document.querySelector('.close-btn');
const modalTitle = document.getElementById('modal-title');
const modalPoster = document.getElementById('modal-poster');
const modalOverview = document.getElementById('modal-overview');
const modalDate = document.getElementById('modal-date');
const modalRating = document.getElementById('modal-rating');

// Event Delegation: Listen for clicks on the container
document.getElementById('movieRow').addEventListener('click', (e) => {
    const card = e.target.closest('.movie-card');
    if (card) {
        const movieId = card.dataset.id;
        const movie = currentMovies.find(m => m.id == movieId);
        if (movie) {
            openModal(movie);
        }
    }
});

function openModal(movie) {
    modalTitle.textContent = movie.title;
    modalPoster.src = movie.poster_path 
        ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path 
        : 'https://via.placeholder.com/300x450?text=No+Image';
    modalOverview.textContent = movie.overview || "No overview available.";
    modalDate.textContent = movie.release_date ? `Released: ${movie.release_date}` : '';
    modalRating.innerHTML = `<i class="fa-solid fa-star" style="color: gold;"></i> ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}`;
    
    modal.style.display = 'flex';
}

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});