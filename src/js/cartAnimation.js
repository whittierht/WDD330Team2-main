// find the cart button first
const addcartButton = document.getElementById("addToCart");

// Create a addEventListener to create the animation when the
// user click on the button
addcartButton.addEventListener("click", function() {

  // 1)Take the cart icon when clicked and store it in a
  // 2) Add a new class to run the animation that is in the CSS file.
  const cartIcon = document.querySelector(".cart");
  cartIcon.classList.add("shake-animation");

  // Set the time the animation will run. Then, remove the new class
  // to stop the animation
  setTimeout(function() {
    cartIcon.classList.remove("shake-animation");
  }, 700);

  // see the shaking animation.
  cartIcon.offsetTop;
  window.scrollTo({
    top: cartIcon,
    behavior: "smooth"
  });
});
