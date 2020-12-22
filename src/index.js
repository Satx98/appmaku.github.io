const sideDrawer = document.getElementById('mobile-nav');
const mainBody = document.getElementById('body');

const backdrop = document.getElementById('backdrop');
const menuToggle = document.getElementById('navi-toggle');
const navbar = document.getElementById('navbar');
const phoneBezelDiv = document.getElementById('phone-bezel-div');
const bgImgOneEl = document.getElementById('bg-img-1');
const accompanyOneEl = document.getElementById('accompany-1');
const spacefillerOneEl = document.getElementById('spacefiller-1');
const bgImgTwoEl = document.getElementById('bg-img-2');
const accompanyTwoEl = document.getElementById('accompany-2');
const spacefillerTwoEl = document.getElementById('spacefiller-2');
const bgImgThreeEl = document.getElementById('bg-img-3');
const accompanyThreeEl = document.getElementById('accompany-3');
const spacefillerThreeEl = document.getElementById('spacefiller-3');
const bgImgFourEl = document.getElementById('bg-img-4');
const accompanyFourEl = document.getElementById('accompany-4');
const spacefillerFourEl = document.getElementById('spacefiller-4');
const headerPrimaryOneEl = document.getElementById('header-primary-1');
const headerPrimaryTwoEl = document.getElementById('header-primary-2');
const headerPrimaryThreeEl = document.getElementById('header-primary-3');
const headerPrimaryFourEl = document.getElementById('header-primary-4');

let bodySizes = null;
let timeoutCounter = null;
let fps = null;

let editedPhoneBezelDivSizes = null;
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

  bgImgOneEl.style.opacity = 0;
  bgImgTwoEl.style.opacity = 0;
  bgImgThreeEl.style.opacity = 0;
  bgImgFourEl.style.opacity = 0;

  accompanyOneEl.style.opacity = 0;
  accompanyTwoEl.style.opacity = 0;
  accompanyThreeEl.style.opacity = 0;
  accompanyFourEl.style.opacity = 0;

  spacefillerOneEl.style.opacity = 0;
  spacefillerTwoEl.style.opacity = 0;
  spacefillerThreeEl.style.opacity = 0;
  spacefillerFourEl.style.opacity = 0;

  headerPrimaryOneEl.style.opacity = 0;
  headerPrimaryTwoEl.style.opacity = 0;
  headerPrimaryThreeEl.style.opacity = 0;
  headerPrimaryFourEl.style.opacity = 0;

  headerPrimaryOneEl.style.display = 'none';
  headerPrimaryTwoEl.style.display = 'none';
  headerPrimaryThreeEl.style.display = 'none';
  headerPrimaryFourEl.style.display = 'none';

  fps = null;
  timeoutCounter = 0;
  let startfps = () => {
    posHandler();
    fps = requestAnimationFrame(startfps);
    if (timeoutCounter >= 10) {
      cancelAnimationFrame(fps);
      fullSlideHeroAnimationHandler();
      fps = null;
      timeoutCounter = null;
      startfps = null;
    }
    timeoutCounter++;
  };
  fps = requestAnimationFrame(startfps);
};

const delay = delayTime => {
  const promise = new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, delayTime);
  });
  return promise;
};

const animate = ({
  time,
  run,
  delayTime = null,
  backward = false,
  stop = null,
  onComplete = null,
}) => {
  let duration;
  let end;
  let resolveStep = () => {};

  const initializer = () => {
    duration = time * 1000;
    end = Date.now() + duration;
  };

  const step = () => {
    if (stop && stop()) {
      resolveStep();
      return onComplete ? onComplete() : null;
    }
    const current = Date.now();
    const remaining = end - current;

    if (remaining < 6) {
      if (backward) {
        run(1);
      } else {
        run(0);
      }
      resolveStep();
      return onComplete ? onComplete() : null;
    } else {
      const rate = backward
        ? Math.pow(Math.cos(remaining / duration), 3)
        : 1 - Math.pow(Math.cos(remaining / duration), 3);
      run(rate);
    }
    requestAnimationFrame(step);
  };

  const promise = new Promise(resolve => {
    resolveStep = resolve;
    if (delayTime) {
      delay(delayTime * 1000).then(() => {
        initializer();
        step();
      });
    } else {
      initializer();
      step();
    }
  });
  return promise;
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
};

// Menu Button Click Handler
const menuToggleClickHandler = async () => {
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
    await animate({
      time: 0.5,
      run: rate => {
        factor = 1 - rate;
        mainBody.style.width = rate * sideDrawerWidth + mainBodyShrinkSize + 'px';
        navbar.style.transform = `translateX(${mainBody.offsetLeft}px)`;
        navbar.previousElementSibling.style.transform = `translateX(${mainBody.offsetLeft}px)`;
        backdrop.style.opacity = factor * 1;
      },
      backward: true,
    });
    onAnimationComplete();
  }
};

// Touch Handlers Start
let x0 = null;

const moveAndOtherTouchListenersRemoved = async ev => {
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

    await animate({
      time: 0.5 * factor,
      run: rate => {
        factor = mainBody.offsetLeft / sideDrawerWidth;
        mainBody.style.width = bodySizes.width - rate * mainBody.offsetLeft + 'px';
        navbar.style.transform = `translateX(${mainBody.offsetLeft}px)`;
        navbar.previousElementSibling.style.transform = `translateX(${mainBody.offsetLeft}px)`;
        backdrop.style.opacity = factor * 1;
      },
    });
    onAnimationComplete();
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

// Handles Hero Animation
const forwardHeroAnimationHandler = async item => {
  animate({
    time: 0.75,
    run: rate => {
      item.elements[0].style.opacity = 1 - rate;
      item.elements[0].style.top =
        item.bgImgPos + rate * editedPhoneBezelDivSizes.height * 0.15 + 'px';
    },
  });
  animate({
    delayTime: 0.5,
    time: 0.75,
    run: rate => {
      item.elements[1].style.opacity = 1 - rate;
      item.elements[1].style.top =
        item.accompanyPos + rate * editedPhoneBezelDivSizes.height * 0.1 + 'px';
    },
  });
  animate({
    delayTime: 1,
    time: 0.75,
    run: rate => {
      item.elements[2].style.opacity = 1 - rate;
      item.elements[2].style.top =
        item.spacefillerPos + rate * editedPhoneBezelDivSizes.height * 0.1 + 'px';
    },
  });
  await animate({
    delayTime: 1.65,
    time: 0.75,
    run: rate => {
      item.elements[3].style.display = 'block';
      item.elements[3].style.opacity = 1 - rate;
      item.elements[3].style.transform = `translateY(${
        rate * editedPhoneBezelDivSizes.height * 0.05
      }px)`;
    },
  });
};

const backwardHeroAnimationHandler = async item => {
  animate({
    delayTime: 3,
    time: 0.5,
    run: rate => {
      item.elements[3].style.opacity = 1 - rate;
      item.elements[3].style.transform = `translateY(${
        rate * editedPhoneBezelDivSizes.height * 0.05
      }px)`;
    },
    backward: true,
    onComplete: () => {
      item.elements[3].style.display = 'none';
    },
  });
  animate({
    delayTime: 3.3,
    time: 0.7,
    run: rate => {
      item.elements[0].style.opacity = 1 - rate;
      item.elements[0].style.top =
        item.bgImgPos + rate * editedPhoneBezelDivSizes.height * 0.15 + 'px';
    },
    backward: true,
  });
  animate({
    delayTime: 3.5,
    time: 0.5,
    run: rate => {
      item.elements[1].style.opacity = 1 - rate;
      item.elements[1].style.top =
        item.accompanyPos + rate * editedPhoneBezelDivSizes.height * 0.1 + 'px';
    },
    backward: true,
  });
  await animate({
    delayTime: 3.5,
    time: 0.5,
    run: rate => {
      item.elements[2].style.opacity = 1 - rate;
      item.elements[2].style.top =
        item.spacefillerPos + rate * editedPhoneBezelDivSizes.height * 0.1 + 'px';
    },
    backward: true,
  });
};

const oneSlideHeroAnimationHandler = async item => {
  await forwardHeroAnimationHandler(item);
  await backwardHeroAnimationHandler(item);
};

const fullSlideHeroAnimationHandler = async () => {
  const slideDetails = [
    {
      elements: [bgImgOneEl, accompanyOneEl, spacefillerOneEl, headerPrimaryOneEl],
      bgImgPos: editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.45,
      accompanyPos: editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.1,
      spacefillerPos: editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.7,
    },
    {
      elements: [bgImgTwoEl, accompanyTwoEl, spacefillerTwoEl, headerPrimaryTwoEl],
      bgImgPos: editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.35,
      accompanyPos: editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.7,
      spacefillerPos: editedPhoneBezelDivSizes.y,
    },
    {
      elements: [bgImgThreeEl, accompanyThreeEl, spacefillerThreeEl, headerPrimaryThreeEl],
      bgImgPos: editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.5,
      accompanyPos: editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.8,
      spacefillerPos: editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.2,
    },
    {
      elements: [bgImgFourEl, accompanyFourEl, spacefillerFourEl, headerPrimaryFourEl],
      bgImgPos: editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.4,
      accompanyPos: editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.25,
      spacefillerPos: editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.75,
    },
  ];

  for (let index = 0; index < slideDetails.length; index = (index + 1) % slideDetails.length) {
    const item = slideDetails[index];
    await oneSlideHeroAnimationHandler(item);
  }
};

// Positioning hero elements realative to the phone-bezel
const posHandler = () => {
  const bezelPsuedoElementHeight = +window
    .getComputedStyle(phoneBezelDiv, '::before')
    .getPropertyValue('height')
    .slice(0, -2);

  const phoneBezelDivSizes = phoneBezelDiv.getBoundingClientRect();

  const scrolledPosition = mainBody.scrollTop;
  editedPhoneBezelDivSizes = {
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

  bgImgOneEl.style.top = editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.45 + 'px';
  accompanyOneEl.style.top =
    editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.1 + 'px';
  spacefillerOneEl.style.top =
    editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.7 + 'px';

  bgImgOneEl.style.left =
    editedPhoneBezelDivSizes.right - editedPhoneBezelDivSizes.width * 0.5 + 'px';
  accompanyOneEl.style.left =
    editedPhoneBezelDivSizes.right - editedPhoneBezelDivSizes.width * 0.8 + 'px';
  spacefillerOneEl.style.left =
    editedPhoneBezelDivSizes.right - editedPhoneBezelDivSizes.width * 0.2 + 'px';

  bgImgTwoEl.style.top = editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.35 + 'px';
  accompanyTwoEl.style.top =
    editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.7 + 'px';
  spacefillerTwoEl.style.top = editedPhoneBezelDivSizes.y + 'px';

  bgImgTwoEl.style.left =
    editedPhoneBezelDivSizes.right - editedPhoneBezelDivSizes.width * 0.15 + 'px';
  accompanyTwoEl.style.left =
    editedPhoneBezelDivSizes.right - editedPhoneBezelDivSizes.width * 0.15 + 'px';
  spacefillerTwoEl.style.left =
    editedPhoneBezelDivSizes.right - editedPhoneBezelDivSizes.width * 0.4 + 'px';

  bgImgThreeEl.style.top =
    editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.5 + 'px';
  accompanyThreeEl.style.top =
    editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.8 + 'px';
  spacefillerThreeEl.style.top =
    editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.2 + 'px';

  bgImgThreeEl.style.left =
    editedPhoneBezelDivSizes.right - editedPhoneBezelDivSizes.width * 0.5 + 'px';
  accompanyThreeEl.style.left =
    editedPhoneBezelDivSizes.right - editedPhoneBezelDivSizes.width * -0.25 + 'px';
  spacefillerThreeEl.style.left =
    editedPhoneBezelDivSizes.right - editedPhoneBezelDivSizes.width * 1 + 'px';

  bgImgFourEl.style.top = editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.4 + 'px';
  accompanyFourEl.style.top =
    editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.25 + 'px';
  spacefillerFourEl.style.top =
    editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.75 + 'px';

  bgImgFourEl.style.left =
    editedPhoneBezelDivSizes.right - editedPhoneBezelDivSizes.width * 0.65 + 'px';
  accompanyFourEl.style.left =
    editedPhoneBezelDivSizes.right - editedPhoneBezelDivSizes.width * 0.7 + 'px';
  spacefillerFourEl.style.left = editedPhoneBezelDivSizes.right + 'px';
};

// Adding an onscroll listener
mainBody.addEventListener('scroll', onScroll);
// Adding an onchange listener to menu button
menuToggle.addEventListener('change', menuToggleClickHandler);
// Adding listener for touch-screen users
window.addEventListener('touchstart', lockAndOtherTouchListenersAdded, false);

window.onload = ready;
window.addEventListener('resize', ready);
