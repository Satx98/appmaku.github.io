const sideDrawer = document.getElementById('mobile-nav');
const mainBody = document.getElementById('body');

const backdrop = document.getElementById('backdrop');
const menuToggle = document.getElementById('navi-toggle');
const navbar = document.getElementById('navbar');
const phoneBezelDiv = document.getElementById('phone-bezel-div');
const bgImgOneEl = document.getElementById('bg-img-1');
const accompanyOneEl = document.getElementById('accompany-1');
const spacefillerOneEl = document.getElementById('spacefiller-1');
const accompanyThreeEl = document.getElementById('accompany-3');
const bgImgThreeEl = document.getElementById('bg-img-3');

let bodySizes = null;
let timeoutCounter = null;
let fps = null;

let mainBodyShrinkSize = 0; // Add media queries later here
let sideDrawerWidth = 0;
let factor = 0;

const ready = () => {
  const menuToggleSizes = document.getElementById('navi-toggle-displayed').getBoundingClientRect();
  bodySizes = document.body.getBoundingClientRect();

  mainBodyShrinkSize = +(40 + menuToggleSizes.width).toFixed(2); // Add media queries later here
  sideDrawerWidth = +(bodySizes.width - mainBodyShrinkSize).toFixed(2);

  // Giving vw unit to the body and setting the size of the side drawer
  sideDrawer.style.width = sideDrawerWidth + 'px';
  navbar.style.transform = `translateX(${mainBody.offsetLeft}px)`;
  navbar.previousElementSibling.style.transform = `translateX(${mainBody.offsetLeft}px)`;
  document.body.style.setProperty('--vw', bodySizes.width / 100 + 'px');
  document.body.style.setProperty('--side-drawer-width', sideDrawerWidth + 'px');

  fps = null;
  timeoutCounter = 0;
  let startfps = () => {
    posHandler();
    fps = requestAnimationFrame(startfps);
    if (timeoutCounter >= 10) {
      cancelAnimationFrame(fps);
      fps = null;
      timeoutCounter = null;
      startfps = null;
    }
    timeoutCounter++;
  };
  fps = requestAnimationFrame(startfps);
};

const animate = item => {
  const duration = item.time * 1000;
  const end = Date.now() + duration;

  const step = () => {
    const current = Date.now();
    const remaining = end - current;

    if (remaining < 30) {
      if (item.backward) {
        item.run(1);
      } else {
        item.run(0);
      }
      return item.onComplete ? item.onComplete() : null;
    } else {
      const rate = item.backward
        ? Math.pow(Math.cos(remaining / duration), 3)
        : 1 - Math.pow(Math.cos(remaining / duration), 3);
      item.run(rate);
    }
    requestAnimationFrame(step);
  };
  step();
};

const onAnimationComplete = () => {
  backdrop.classList.remove('backdrop-display');
  mainBody.style.removeProperty('width');
  navbar.style.removeProperty('transform');
  navbar.previousElementSibling.style.removeProperty('transform');
};

// Navbar Changing Color while scrolling
const onScroll = () => {
  const scrolledPosition = mainBody.scrollTop;
  navbar.style.backgroundColor = 'rgba(254, 205, 26,' + scrolledPosition * 0.007 + ')';
  if (scrolledPosition * 0.0007 <= 0.1) {
    navbar.style.boxShadow = '0 0 1rem rgba(0, 0, 0,' + scrolledPosition * 0.0007 + ')';
  }

  navbar.style.transform = `translateX(${mainBody.offsetLeft}px)`;
  navbar.previousElementSibling.style.transform = `translateX(${mainBody.offsetLeft}px)`;
};

// Menu Button Click Handler
const menuToggleClickHandler = () => {
  if (menuToggle.checked) {
    backdrop.classList.add('backdrop-display');
    animate({
      time: 0.5,
      run: rate => {
        factor = 1 - rate;
        mainBody.style.width = rate * sideDrawerWidth + mainBodyShrinkSize + 'px';
        navbar.style.transform = `translateX(${mainBody.offsetLeft}px)`;
        navbar.previousElementSibling.style.transform = `translateX(${mainBody.offsetLeft}px)`;
        backdrop.style.opacity = factor * 1;
      },
    });
  } else {
    animate({
      time: 0.5,
      run: rate => {
        factor = 1 - rate;
        mainBody.style.width = rate * sideDrawerWidth + mainBodyShrinkSize + 'px';
        navbar.style.transform = `translateX(${mainBody.offsetLeft}px)`;
        navbar.previousElementSibling.style.transform = `translateX(${mainBody.offsetLeft}px)`;
        backdrop.style.opacity = factor * 1;
      },
      backward: true,
      onComplete: onAnimationComplete,
    });
  }
};

// Touch Handlers Start
let x0 = null;

const moveAndOtherTouchListenersRemoved = ev => {
  let dx = ev.changedTouches[0].clientX - x0;
  let s = Math.sign(dx);

  if ((s > 0 && factor > 0.25) || (s < 0 && factor >= 0.75)) {
    menuToggle.checked = true;

    animate({
      time: 0.5 * (1 - factor),
      run: rate => {
        factor = mainBody.offsetLeft / sideDrawerWidth;
        mainBody.style.width =
          rate * (mainBody.clientWidth - mainBodyShrinkSize) + mainBodyShrinkSize + 'px';
        navbar.style.transform = `translateX(${mainBody.offsetLeft}px)`;
        navbar.previousElementSibling.style.transform = `translateX(${mainBody.offsetLeft}px)`;
        backdrop.style.opacity = factor * 1;
      },
    });
  }

  if ((s < 0 && factor < 0.75) || (s > 0 && factor <= 0.25)) {
    menuToggle.checked = false;

    animate({
      time: 0.5 * factor,
      run: rate => {
        factor = mainBody.offsetLeft / sideDrawerWidth;
        mainBody.style.width = bodySizes.width - rate * mainBody.offsetLeft + 'px';
        navbar.style.transform = `translateX(${mainBody.offsetLeft}px)`;
        navbar.previousElementSibling.style.transform = `translateX(${mainBody.offsetLeft}px)`;
        backdrop.style.opacity = factor * 1;
      },
      onComplete: onAnimationComplete,
    });
  }

  x0 = null;

  window.removeEventListener('touchmove', touchDrag);
  window.removeEventListener('touchend', moveAndOtherTouchListenersRemoved);
};

const touchDrag = ev => {
  let dx = ev.changedTouches[0].clientX - x0;
  let s = Math.sign(dx);
  let dxa = Math.abs(dx);
  let changedBodySize = null;

  if (dxa > sideDrawerWidth) {
    return;
  }

  if (s > 0 && !menuToggle.checked) {
    if (![...backdrop.classList].includes('backdrop-display')) {
      backdrop.classList.add('backdrop-display');
    }
    factor = dxa / sideDrawerWidth;
    changedBodySize = bodySizes.width - dxa;

    navbar.style.transform = `translateX(${dxa}px)`;
    navbar.previousElementSibling.style.transform = `translateX(${dxa}px)`;
  }
  if (s < 0 && menuToggle.checked) {
    const diff = sideDrawerWidth - dxa;
    factor = diff / sideDrawerWidth;
    changedBodySize = mainBodyShrinkSize + dxa;

    navbar.style.transform = `translateX(${diff}px)`;
    navbar.previousElementSibling.style.transform = `translateX(${diff}px)`;
  }
  if ((s > 0 && !menuToggle.checked) || (s < 0 && menuToggle.checked)) {
    mainBody.style.width = changedBodySize + 'px';
    backdrop.style.opacity = factor * 1;
  }
};

const lockAndOtherTouchListenersAdded = ev => {
  x0 = ev.changedTouches[0].clientX;
  window.addEventListener('touchmove', touchDrag);
  window.addEventListener('touchend', moveAndOtherTouchListenersRemoved);
};
// Touch Handlers Start

// Positioning hero elements realative to the phone-bezel
const posHandler = () => {
  const bezelPsuedoElementHeight = +window
    .getComputedStyle(phoneBezelDiv, '::before')
    .getPropertyValue('height')
    .slice(0, -2);

  const phoneBezelDivSizes = phoneBezelDiv.getBoundingClientRect();

  const scrolledPosition = mainBody.scrollTop;
  const editedPhoneBezelDivSizes = {
    height: phoneBezelDivSizes.height - bezelPsuedoElementHeight * 2,
    width: phoneBezelDivSizes.width,
    x: phoneBezelDivSizes.x - mainBody.offsetLeft,
    y: phoneBezelDivSizes.y + bezelPsuedoElementHeight + scrolledPosition,
    top: phoneBezelDivSizes.top + bezelPsuedoElementHeight + scrolledPosition,
    bottom: phoneBezelDivSizes.bottom - bezelPsuedoElementHeight + scrolledPosition,
    left: phoneBezelDivSizes.left - mainBody.offsetLeft,
    right: phoneBezelDivSizes.right - mainBody.offsetLeft,
  };

  document.body.style.setProperty('--unit', editedPhoneBezelDivSizes.height / 100 + 'px');

  // console.log(bodySizes);
  // console.log(phoneBezelDiv);
  // console.dir(phoneBezelDiv);
  // console.log(phoneBezelDivSizes);
  // console.log(editedPhoneBezelDivSizes);

  // bgImgOneEl.style.setProperty(
  //   '--pos-top',
  //   editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.45 + 'px',
  // );
  // bgImgOneEl.style.setProperty(
  //   '--pos-left',
  //   editedPhoneBezelDivSizes.right - editedPhoneBezelDivSizes.width * 0.5 + 'px',
  // );
  // accompanyOneEl.style.setProperty(
  //   '--pos-top',
  //   editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.1 + 'px',
  // );
  // accompanyOneEl.style.setProperty(
  //   '--pos-left',
  //   editedPhoneBezelDivSizes.right - editedPhoneBezelDivSizes.width * 0.8 + 'px',
  // );
  // spacefillerOneEl.style.setProperty(
  //   '--pos-top',
  //   editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.7 + 'px',
  // );
  // spacefillerOneEl.style.setProperty(
  //   '--pos-left',
  //   editedPhoneBezelDivSizes.right - editedPhoneBezelDivSizes.width * 0.2 + 'px',
  // );
  // accompanyThreeEl.style.setProperty(
  //   '--pos-top',
  //   editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.75 + 'px',
  // );
  // accompanyThreeEl.style.setProperty(
  //   '--pos-left',
  //   editedPhoneBezelDivSizes.x + editedPhoneBezelDivSizes.width * 1.25 + 'px',
  // );
  // bgImgThreeEl.style.setProperty(
  //   '--pos-top',
  //   editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.45 + 'px',
  // );
  // bgImgThreeEl.style.setProperty(
  //   '--pos-left',
  //   editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.width * 0 + 'px',
  // );
};

// Adding an onscroll listener
mainBody.addEventListener('scroll', onScroll);
// Adding an onchange listener to menu button
menuToggle.addEventListener('change', menuToggleClickHandler);
// Adding listener for touch-screen users
window.addEventListener('touchstart', lockAndOtherTouchListenersAdded, false);

window.onload = ready;
window.addEventListener('resize', ready);
