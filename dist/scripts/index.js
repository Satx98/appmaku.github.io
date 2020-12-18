const sideDrawer = document.getElementById('mobile-nav');
const mainBody = document.getElementById('body');

const backdrop = document.getElementById('backdrop');
const menuToggle = document.getElementById('navi-toggle');
const navbar = document.getElementById('navbar');
const navIcon = document.getElementById('navigation-icon');
const phoneBezelDiv = document.getElementById('phone-bezel-div');
const accompanyOneEl = document.getElementById('accompany-1');
const bgImg1 = document.getElementById('bg-img-1');

let bodySizes = null;
let timeoutCounter = null;
let fps = null;

let mainBodyShrinkSize = 0; // Add media queries later here
let sideDrawerWidth = 0;
let factor = 0;

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
        ? 1 - Math.sin(Math.pow(remaining / duration, 3))
        : Math.sin(Math.pow(remaining / duration, 3));
      // console.log(rate);
      item.run(rate);
    }
    requestAnimationFrame(step);
  };
  step();
};

// Navbar Changing Color while scrolling
const onScroll = () => {
  const scrolledPosition = mainBody.scrollTop;
  navbar.style.backgroundColor = 'rgba(254, 205, 26,' + scrolledPosition * 0.007 + ')';
  if (scrolledPosition * 0.0007 <= 0.1) {
    navbar.style.boxShadow = '0 0 1rem rgba(0, 0, 0,' + scrolledPosition * 0.0007 + ')';
  }
};

// Menu Button Click Handler
const menuToggleClickHandler = () => {
  if (menuToggle.checked) {
    backdrop.classList.add('backdrop-display');
    animate({
      time: 0.5,
      run: rate => {
        factor = 1 - rate;
        mainBody.style.width = rate * +sideDrawerWidth + +mainBodyShrinkSize + 'px';
        navbar.style.transform = `translateX(${factor * +sideDrawerWidth}px)`;
        navbar.previousElementSibling.style.transform = `translateX(${
          factor * +sideDrawerWidth
        }px)`;
        backdrop.style.opacity = factor * 1;
      },
    });
  } else {
    animate({
      time: 0.5,
      run: rate => {
        factor = 1 - rate;
        mainBody.style.width = rate * +sideDrawerWidth + +mainBodyShrinkSize + 'px';
        navbar.style.transform = `translateX(${factor * +sideDrawerWidth}px)`;
        navbar.previousElementSibling.style.transform = `translateX(${
          factor * +sideDrawerWidth
        }px)`;
        backdrop.style.opacity = factor * 1;
      },
      backward: true,
      onComplete: () => {
        backdrop.classList.remove('backdrop-display');
      },
    });
  }
};

// Touch Handlers Start
let x0 = null;

const moveAndOtherTouchListenersRemoved = ev => {
  let dx = ev.changedTouches[0].clientX - x0;
  let s = Math.sign(dx);

  if ((s > 0 && factor.toFixed(2) > 0.25) || (s < 0 && factor.toFixed(2) >= 0.75)) {
    menuToggle.checked = true;

    animate({
      time: 0.5 * (1 - factor),
      run: rate => {
        factor = mainBody.offsetLeft / +sideDrawerWidth;
        mainBody.style.width =
          rate * (mainBody.clientWidth - +mainBodyShrinkSize) + +mainBodyShrinkSize + 'px';
        navbar.style.transform = `translateX(${factor * +sideDrawerWidth}px)`;
        navbar.previousElementSibling.style.transform = `translateX(${
          factor * +sideDrawerWidth
        }px)`;
        backdrop.style.opacity = factor * 1;
      },
    });
  }

  if ((s < 0 && factor.toFixed(2) < 0.75) || (s > 0 && factor.toFixed(2) <= 0.25)) {
    menuToggle.checked = false;

    animate({
      time: 0.5 * factor,
      run: rate => {
        factor = mainBody.offsetLeft / +sideDrawerWidth;
        mainBody.style.width = bodySizes.width - rate * mainBody.offsetLeft + 'px';
        navbar.style.transform = `translateX(${factor * +sideDrawerWidth}px)`;
        navbar.previousElementSibling.style.transform = `translateX(${
          factor * +sideDrawerWidth
        }px)`;
        backdrop.style.opacity = factor * 1;
      },
      onComplete: () => {
        backdrop.classList.remove('backdrop-display');
      },
    });
  }

  x0 = null;
  changedBodySize = null;

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
    if (![...backdrop.classList].includes('backdrop-display')) {
      backdrop.classList.add('backdrop-display');
    }
    factor = dxa / +sideDrawerWidth;
    changedBodySize = bodySizes.width - dxa;

    navbar.style.transform = `translateX(${dxa}px)`;
    navbar.previousElementSibling.style.transform = `translateX(${dxa}px)`;
  }
  if (s < 0 && menuToggle.checked) {
    const diff = +sideDrawerWidth - dxa;
    factor = diff / +sideDrawerWidth;
    changedBodySize = +mainBodyShrinkSize + dxa;

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
    x: phoneBezelDivSizes.x - bodySizes.x,
    y: phoneBezelDivSizes.y + bezelPsuedoElementHeight + scrolledPosition,
    top: phoneBezelDivSizes.top + bezelPsuedoElementHeight + scrolledPosition,
    bottom: phoneBezelDivSizes.bottom - bezelPsuedoElementHeight + scrolledPosition,
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
    editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.75 + 'px',
  );
  accompanyOneEl.style.setProperty(
    '--pos-left',
    editedPhoneBezelDivSizes.x + editedPhoneBezelDivSizes.width * 1.25 + 'px',
  );
  bgImg1.style.setProperty(
    '--pos-top',
    editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.45 + 'px',
  );
  bgImg1.style.setProperty(
    '--pos-left',
    editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.width * 0 + 'px',
  );
};

// Adding an onscroll listener
mainBody.addEventListener('scroll', onScroll);
// Adding an onchange listener to menu button
menuToggle.addEventListener('change', menuToggleClickHandler);
// Adding listener for touch-screen users
window.addEventListener('touchstart', lockAndOtherTouchListenersAdded, false);

const ready = () => {
  const menuToggleSizes = document.getElementById('navi-toggle-displayed').getBoundingClientRect();
  bodySizes = document.body.getBoundingClientRect();

  mainBodyShrinkSize = (40 + menuToggleSizes.width).toFixed(2); // Add media queries later here
  sideDrawerWidth = (bodySizes.width - mainBodyShrinkSize).toFixed(2);

  // Giving vw unit to the body and setting the size of the side drawer
  sideDrawer.style.width = sideDrawerWidth + 'px';
  navbar.style.transform = `translateX(${mainBody.offsetLeft}px)`;
  navbar.previousElementSibling.style.transform = `translateX(${mainBody.offsetLeft}px)`;
  document.body.style.setProperty('--vw', bodySizes.width / 100 + 'px');
  // document.body.style.setProperty('--main-body-shrink-size', mainBodyShrinkSize + 'px');
  document.body.style.setProperty('--side-drawer-width', sideDrawerWidth + 'px');

  fps = null;
  timeoutCounter = 0;
  let startfps = () => {
    posHandler();
    fps = requestAnimationFrame(startfps);
    if (timeoutCounter >= 3) {
      cancelAnimationFrame(fps);
      fps = null;
      timeoutCounter = null;
      startfps = null;
    }
    timeoutCounter++;
  };
  fps = requestAnimationFrame(startfps);
};

window.onload = ready;
window.addEventListener('resize', ready);