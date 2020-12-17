const changeInMainBodyWidthEvent = new Event('changeInMainBodyWidth');

const sideDrawer = document.getElementById('mobile-nav');
const mainBody = document.getElementById('body');

const backdrop = document.getElementById('backdrop');
const menuToggle = document.getElementById('navi-toggle');
const navbar = document.getElementById('navbar');
const phoneBezelDiv = document.getElementById('phone-bezel-div');
const accompanyOneEl = document.getElementById('accompany-1');

let bodySizes = null;

let mainBodyShrinkSize = 0; // Add media queries later here
let sideDrawerWidth = 0;
let factor = 0;

const onChangeInMainBodyWidth = ev => {
  factor = ev
    ? ev.target.offsetLeft / sideDrawerWidth
    : mainBody.getBoundingClientRect().x / sideDrawerWidth;
  document.body.style.setProperty('--f', factor.toFixed(2));
  backdrop.style.opacity = factor.toFixed(2);
};

// Navbar Changing Color while scrolling
const onScroll = () => {
  const scrolledPosition = mainBody.scrollTop;
  navbar.style.backgroundColor = 'rgba(254, 205, 26,' + scrolledPosition * 0.007 + ')';
  if (scrolledPosition * 0.0007 <= 0.1) {
    navbar.style.boxShadow = '0 0 1rem rgba(0, 0, 0,' + scrolledPosition * 0.0007 + ')';
  }
};

// Making and triggering a custom event changeInMainBodyWidth
let fps = null;
let tempX = null;
let counterToStopFps = 0;

const stopfps = () => {
  clearInterval(fps);
  fps = null;
  tempX = null;
  counterToStopFps = 0;

  menuToggle.classList.remove('.button-icon-animation--1');
  mainBody.classList.remove('smooth-animation--1');
  navbar.classList.remove('smooth-animation--1');
  navbar.previousElementSibling.classList.remove('smooth-animation--1');

  menuToggle.classList.remove('.button-icon-animation--2');
  mainBody.classList.remove('smooth-animation--2');
  navbar.classList.remove('smooth-animation--2');
  navbar.previousElementSibling.classList.remove('smooth-animation--2');

  menuToggle.classList.remove('.button-icon-animation--3');
  mainBody.classList.remove('smooth-animation--3');
  navbar.classList.remove('smooth-animation--3');
  navbar.previousElementSibling.classList.remove('smooth-animation--3');

  if (!menuToggle.checked) {
    backdrop.classList.remove('backdrop-display');
  }
};

const triggeringChangeInMainBodyWidth = () => {
  if (tempX === mainBody.offsetLeft) {
    counterToStopFps++;
    if (counterToStopFps >= 10) {
      stopfps();
    }
    return;
  }
  mainBody.dispatchEvent(changeInMainBodyWidthEvent);
  tempX = mainBody.offsetLeft;
};

const startfps = () => {
  fps = setInterval(triggeringChangeInMainBodyWidth, 16);
};

// Menu Button Click Handler
const menuToggleClickHandler = () => {
  menuToggle.classList.add('.button-icon-animation--1');
  mainBody.classList.add('smooth-animation--1');
  navbar.classList.add('smooth-animation--1');
  navbar.previousElementSibling.classList.add('smooth-animation--1');

  if (menuToggle.checked) {
    backdrop.classList.add('backdrop-display');
    mainBody.classList.add('scroll-view-shrink');
    navbar.classList.add('navigation-move');
    navbar.previousElementSibling.classList.add('navigation-move');
  } else {
    mainBody.classList.remove('scroll-view-shrink');
    navbar.classList.remove('navigation-move');
    navbar.previousElementSibling.classList.remove('navigation-move');
  }
};

// Touch Handlers Start
let x0 = null;

const moveAndOtherTouchListenersRemoved = ev => {
  let dx = ev.changedTouches[0].clientX - x0;
  let s = Math.sign(dx);

  menuToggle.classList.remove('checkbox-transition');

  if (s > 0) {
    if (factor.toFixed(2) > 0.25) {
      startfps();
      menuToggle.classList.add('.button-icon-animation--2');
      mainBody.classList.add('smooth-animation--2');
      navbar.classList.add('smooth-animation--2');
      navbar.previousElementSibling.classList.add('smooth-animation--2');

      menuToggle.checked = true;

      mainBody.classList.add('scroll-view-shrink');
      navbar.classList.add('navigation-move');
      navbar.previousElementSibling.classList.add('navigation-move');
    } else {
      startfps();
      backdrop.classList.remove('backdrop-display');

      menuToggle.classList.add('.button-icon-animation--3');
      mainBody.classList.add('smooth-animation--3');
      navbar.classList.add('smooth-animation--3');
      navbar.previousElementSibling.classList.add('smooth-animation--3');

      menuToggle.checked = false;
    }
  }

  if (s < 0) {
    if (factor.toFixed(2) < 0.75) {
      startfps();
      menuToggle.classList.add('.button-icon-animation--3');
      mainBody.classList.add('smooth-animation--3');
      navbar.classList.add('smooth-animation--3');
      navbar.previousElementSibling.classList.add('smooth-animation--3');

      menuToggle.checked = false;

      mainBody.classList.remove('scroll-view-shrink');
    } else {
      startfps();
      menuToggle.classList.add('.button-icon-animation--2');
      mainBody.classList.add('smooth-animation--2');
      navbar.classList.add('smooth-animation--2');
      navbar.previousElementSibling.classList.add('smooth-animation--2');

      navbar.classList.add('navigation-move');
      navbar.previousElementSibling.classList.add('navigation-move');

      menuToggle.checked = true;
    }
  }

  x0 = null;
  document.body.style.removeProperty('--main-body-change-size');

  window.removeEventListener('touchmove', touchDrag);
  window.removeEventListener('touchend', moveAndOtherTouchListenersRemoved);
};

const touchDrag = ev => {
  let dx = ev.changedTouches[0].clientX - x0;
  let s = Math.sign(dx);
  let changedBodySize = null;

  let dxa = Math.abs(dx);

  if (dxa > sideDrawerWidth) {
    return;
  }

  if (s > 0 && !menuToggle.checked) {
    menuToggle.classList.add('checkbox-transition');
    backdrop.classList.add('backdrop-display');
    changedBodySize = (bodySizes.width - dxa).toFixed(2);
    document.body.style.setProperty('--main-body-change-size', changedBodySize + 'px');
    onChangeInMainBodyWidth();
  }
  if (s < 0 && menuToggle.checked) {
    menuToggle.classList.add('checkbox-transition');
    navbar.classList.remove('navigation-move');
    navbar.previousElementSibling.classList.remove('navigation-move');
    changedBodySize = (+mainBodyShrinkSize + dxa).toFixed(2);
    document.body.style.setProperty('--main-body-change-size', changedBodySize + 'px');
    onChangeInMainBodyWidth();
  }
};

const lockAndOtherTouchListenersAdded = ev => {
  if (!ev.changedTouches) {
    return;
  }
  x0 = ev.changedTouches[0].clientX;
  window.addEventListener('touchmove', touchDrag);
  window.addEventListener('touchend', moveAndOtherTouchListenersRemoved);
};
// Touch Handlers Start

// Adding a listener to changeInMainBodyWidth
mainBody.addEventListener('changeInMainBodyWidth', onChangeInMainBodyWidth);
// Adding an onscroll listener
mainBody.addEventListener('scroll', onScroll);
// Adding an onchange listener to menu button
menuToggle.addEventListener('change', () => {
  menuToggleClickHandler();
  startfps();
});
// Adding listener for touch-screen users
window.addEventListener('touchstart', lockAndOtherTouchListenersAdded, false);

const ready = () => {
  const psuedoElementHeight = +window
    .getComputedStyle(phoneBezelDiv, '::before')
    .getPropertyValue('height')
    .slice(0, -2);

  const menuToggleSizes = document.getElementById('navi-toggle-displayed').getBoundingClientRect();
  bodySizes = document.body.getBoundingClientRect();
  const phoneBezelDivSizes = phoneBezelDiv.getBoundingClientRect();

  mainBodyShrinkSize = (40 + menuToggleSizes.width).toFixed(2); // Add media queries later here
  sideDrawerWidth = (bodySizes.width - mainBodyShrinkSize).toFixed(2);

  // Giving vw unit to the body and setting the size of the side drawer
  sideDrawer.style.width = sideDrawerWidth + 'px';
  document.body.style.setProperty('--vw', bodySizes.width / 100 + 'px');
  document.body.style.setProperty('--main-body-shrink-size', mainBodyShrinkSize + 'px');
  document.body.style.setProperty('--side-drawer-width', sideDrawerWidth + 'px');

  // Positioning hero elements realative to the phone-bezel
  const scrolledPosition = mainBody.scrollTop;
  const editedPhoneBezelDivSizes = {
    height: phoneBezelDivSizes.height - psuedoElementHeight * 2,
    width: phoneBezelDivSizes.width,
    x: phoneBezelDivSizes.x - bodySizes.x,
    y: phoneBezelDivSizes.y + psuedoElementHeight + scrolledPosition,
    top: phoneBezelDivSizes.top + psuedoElementHeight + scrolledPosition,
    bottom: phoneBezelDivSizes.bottom - psuedoElementHeight + scrolledPosition,
    left: phoneBezelDivSizes.left - bodySizes.x,
    right: phoneBezelDivSizes.right - bodySizes.x,
  };

  document.body.style.setProperty('--unit', editedPhoneBezelDivSizes.height / 100 + 'px');

  // console.log(bodySizes);
  // console.log(phoneBezelDiv);
  // console.dir(phoneBezelDiv);
  // console.log(phoneBezelDivSizes);
  // console.log(editedPhoneBezelDivSizes);

  accompanyOneEl.style.setProperty(
    '--pos-top',
    editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.8 + 'px',
  );
  accompanyOneEl.style.setProperty(
    '--pos-left',
    editedPhoneBezelDivSizes.x + editedPhoneBezelDivSizes.width * 1.25 + 'px',
  );
};

window.onload = ready;
window.addEventListener('resize', ready);
