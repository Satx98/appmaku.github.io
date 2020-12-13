const ready = () => {
  const phoneBezelDiv = document.getElementById('phone-bezel-div');

  const scrolledPosition = document.documentElement.scrollTop || document.body.scrollTop;
  const psuedoElementHeight = +window
    .getComputedStyle(phoneBezelDiv, '::before')
    .getPropertyValue('height')
    .slice(0, -2);

  const phoneBezelDivSizes = phoneBezelDiv.getBoundingClientRect();

  const editedPhoneBezelDivSizes = {
    height: phoneBezelDivSizes.height - psuedoElementHeight * 2,
    width: phoneBezelDivSizes.width,
    x: phoneBezelDivSizes.x,
    y: phoneBezelDivSizes.y + psuedoElementHeight + scrolledPosition,
    top: phoneBezelDivSizes.top + psuedoElementHeight + scrolledPosition,
    bottom: phoneBezelDivSizes.bottom - psuedoElementHeight + scrolledPosition,
    left: phoneBezelDivSizes.left,
    right: phoneBezelDivSizes.right,
  };

  document.body.style.setProperty('--unit', editedPhoneBezelDivSizes.height / 100 + 'px');

  console.log(phoneBezelDiv);
  console.dir(phoneBezelDiv);
  console.log(phoneBezelDivSizes);
  console.log(editedPhoneBezelDivSizes);

  const accompanyOneEl = document.getElementById('accompany-1');
  accompanyOneEl.style.setProperty(
    '--pos-top',
    editedPhoneBezelDivSizes.y + editedPhoneBezelDivSizes.height * 0.8 + 'px',
  );
  accompanyOneEl.style.setProperty(
    '--pos-left',
    editedPhoneBezelDivSizes.x + editedPhoneBezelDivSizes.width * 1.25 + 'px',
  );

  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    const scrolledPosition = document.documentElement.scrollTop || document.body.scrollTop;
    navbar.style.backgroundColor = 'rgba(254, 205, 26,' + scrolledPosition * 0.007 + ')';
  };

  const backdrop = document.getElementById('backdrop');
  const sideDrawer = document.getElementById('mobile-nav');
  const menuToggle = document.getElementById('navi-toggle');

  const backdropClickHandler = () => {
    backdrop.style.display = 'none';
    sideDrawer.classList.remove('open');
    menuToggle.checked = false;
  };

  const menuToggleClickHandler = () => {
    if (menuToggle.checked) {
      backdrop.style.display = 'block';
      sideDrawer.classList.add('open');
    } else {
      backdropClickHandler();
    }
  };

  backdrop.addEventListener('click', backdropClickHandler);
  menuToggle.addEventListener('change', menuToggleClickHandler);

  window.onscroll = onScroll;
};

window.onload = ready;
window.onresize = ready;
