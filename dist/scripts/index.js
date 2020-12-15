const ready = () => {
  // Giving vw unit to the body
  document.body.style.setProperty('--vw', document.body.getBoundingClientRect().width / 100 + 'px');

  // Positioning hero elements realative to the phone-bezel
  const mainBody = document.getElementById('body');
  const phoneBezelDiv = document.getElementById('phone-bezel-div');

  const scrolledPosition = mainBody.scrollTop;
  const psuedoElementHeight = +window
    .getComputedStyle(phoneBezelDiv, '::before')
    .getPropertyValue('height')
    .slice(0, -2);

  const phoneBezelDivSizes = phoneBezelDiv.getBoundingClientRect();
  const bodySizes = body.getBoundingClientRect();

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

  const accompanyOneEl = document.getElementById('accompany-1');
  accompanyOneEl.style.setProperty(
    '--pos-top',
    editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.8 + 'px',
  );
  accompanyOneEl.style.setProperty(
    '--pos-left',
    editedPhoneBezelDivSizes.x + editedPhoneBezelDivSizes.width * 1.25 + 'px',
  );

  // Navbar Changing Color while scrolling
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    const scrolledPosition = mainBody.scrollTop;
    document.body.style.setProperty('--view-top', scrolledPosition);
    navbar.style.backgroundColor = 'rgba(254, 205, 26,' + scrolledPosition * 0.007 + ')';
    if (scrolledPosition * 0.0007 <= 0.1) {
      navbar.style.boxShadow = '0 0 1rem rgba(0, 0, 0,' + scrolledPosition * 0.0007 + ')';
    }
  };
  mainBody.onscroll = onScroll;

  // // Adding the Side-Drawer & backdrop on click
  // const backdrop = document.getElementById('backdrop');
  // const sideDrawer = document.getElementById('mobile-nav');
  // const menuToggle = document.getElementById('navi-toggle');

  // const backdropClickHandler = () => {
  //   backdrop.style.display = 'none';
  //   sideDrawer.classList.remove('open');
  //   menuToggle.checked = false;
  // };

  // const menuToggleClickHandler = () => {
  //   if (menuToggle.checked) {
  //     backdrop.style.display = 'block';

  //     sideDrawer.classList.add('open');
  //   } else {
  //     backdropClickHandler();
  //   }
  // };

  // backdrop.addEventListener('click', backdropClickHandler);
  // menuToggle.addEventListener('change', menuToggleClickHandler);

  // // Adding Swipe gestures to pull the Side-drawer out (for mobile-users)
  // let x0 = null;

  // const moveAndOtherListenersRemoved = ev => {
  //   let dx = ev.changedTouches[0].clientX - x0;
  //   let s = Math.sign(dx);

  //   if (s > 0) {
  //     menuToggle.checked = true;
  //     menuToggleClickHandler();
  //   }
  //   if (s < 0) {
  //     menuToggle.checked = false;
  //     menuToggleClickHandler();
  //   }

  //   x0 = null;

  //   sideDrawer.style.transition = 'transform 0.5s ease-out';
  //   if (
  //     sideDrawer.getBoundingClientRect().left / sideDrawer.getBoundingClientRect().width >=
  //     -0.75
  //   ) {
  //     sideDrawer.classList.add('open');
  //     sideDrawer.style.setProperty('--perct', '0px');
  //   }

  //   window.ontouchmove = null;
  //   window.ontouchend = null;
  // };

  // const drag = ev => {
  //   if (sideDrawer.getBoundingClientRect().left >= 0) {
  //     return;
  //   }
  //   sideDrawer.style.setProperty('--perct', Math.round(ev.changedTouches[0].clientX - x0) + 'px');
  // };

  // const lockAndOtherListenersAdded = ev => {
  //   if (!ev.changedTouches) {
  //     return;
  //   }
  //   x0 = ev.changedTouches[0].clientX;
  //   sideDrawer.style.transition = 'none';
  //   console.log(ev);
  //   console.log(ev.changedTouches[0]);
  //   console.log(ev.changedTouches[0].clientX);
  //   window.ontouchmove = drag;
  //   window.ontouchend = moveAndOtherListenersRemoved;
  // };

  // window.addEventListener('touchstart', lockAndOtherListenersAdded);
};

window.onload = ready;
window.onresize = ready;
