let currentIndex = 0;
const track = document.getElementById("carouselTrack");
const cardWidth = 420; // 400 + margin

function moveCarousel(direction) {
  const totalCards = track.children.length;
  currentIndex += direction;

  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex > totalCards - 1) currentIndex = totalCards - 1;

  track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

let productsIndex = 0;

function moveProducts(direction) {
  const track = document.getElementById("productsTrack");
  const productCards = track.querySelectorAll(".product");
  const cardWidth = productCards[0].offsetWidth + 20; // 20 = gap
  const visibleCards = Math.floor(track.offsetWidth / cardWidth);

  productsIndex += direction;
  if (productsIndex < 0) productsIndex = 0;
  if (productsIndex > productCards.length - visibleCards) productsIndex = productCards.length - visibleCards;

  track.style.transform = `translateX(-${productsIndex * cardWidth}px)`;
  track.style.transition = "transform 0.3s";
}