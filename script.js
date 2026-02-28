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