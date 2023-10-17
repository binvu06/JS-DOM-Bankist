'use strict';

const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);

  // console.log(e.target.getBoundingClientRect());
  // console.log(e.target);

  // console.log('Current scroll (X/Y)', window.pageXOffset, pageYOffset);

  // console.log(
  //   'height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // Cách 1
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // Cách 2
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // Cách 3
  section1.scrollIntoView({ behavior: 'smooth' });
});
/////////////////////////////////////////////
/////////////////////////////////////////////
// Page navigation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Delegation event + Matching strategy
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component

// tabs.forEach(t => t.addEventListener('click', () => console.log('TAB')));

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation

// fn return fn
const handleHover = function (o) {
  return function (e) {
    if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      const siblings = link.closest('.nav').querySelectorAll('.nav__link');
      const logo = link.closest('.nav').querySelector('img');

      siblings.forEach(el => {
        if (el !== link) el.style.opacity = o;
      });
      logo.style.opacity = o;
    }
  };
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover(0.5));
// nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover(1));

// Sticky navigation
// const initialCoord = section1.getBoundingClientRect();

// window.addEventListener('scroll', function (e) {
//   if (window.scrollY > initialCoord.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//////////////////// Sticky navigation" Intersection Observer API

// console.log(section1.getBoundingClientRect());
const obsCallback = function (entries, observer) {
  entries.forEach(entry => console.log(entry));
  // console.log(observer);
};

const observer = new IntersectionObserver(obsCallback, {
  root: null,
  threshold: 0.1,
  rootMargin: `-90px`,
});
observer.observe(section1);

////////////////

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries; // destruct arr, because it will return arr literal
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, //default
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  // Guard clause
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// Lazy loading img
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  // Guard clause
  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

let curSlide = 0;
const maxSlide = slides.length;

// const slider = document.querySelector('.slider');
// slider.style.overflow = 'visible';

// 0%, 100%, 200%, 300%

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
goToSlide(0);

// Next slide
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  goToSlide(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////

/*
console.log(document.documentElement);
// console.log(document.body);
console.log(document.head);

// const allSections = document.querySelectorAll('.section');
// console.log(allSections); // Nodelist

// const allButtons = document.getElementsByTagName('section');
// console.log(allButtons);

// // const allClassBtn = document.getElementsByClassName('btn');
// // console.log(allButtons);

// const first = document.querySelector('.section__title');
// console.log(first);

// console.log(document.querySelector('#section--1'));
// console.log(document.getElementById('section--1'));

// console.log(document.querySelector('.section'));
// console.log(document.getElementsByClassName('section'));

const allButtons = document.getElementsByTagName('section');
// console.log(allButtons);

const header = document.querySelector('.header');

const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class = "btn btn--close-cookie">Got it!</button>';

// header.before(message);
// header.after(message);
// header.prepend(message);
// header.append(message.cloneNode(true));
// // header.append(message);

header.append(message);
const btnClose = document.querySelector('.btn--close-cookie');
btnClose.addEventListener('click', function () {
  message.remove();
  message.parentElement.removeChild(message);
});

message.style.backgroundColor = 'black';
// message.style.width = '120%';

console.log(message.style.backgroundColor);
console.log(message.style.width);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).backgroundColor);
console.log(getComputedStyle(message).width);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';
console.log(getComputedStyle(message).height);

console.log(Number.parseFloat('9.3px'));

document.documentElement.style.setProperty('--color-primary', 'orangered');

// document.documentElement.style.setProperty('width', '1px');
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className);
console.log(logo.designer);
logo.alt = 'Beautiful';
console.log(logo.alt);

logo.setAttribute('comany', 'Bankist');
console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

console.log(logo.dataset.versionNumber);
*/

/*

*/

// h1.addEventListener('mouseenter', function () {
//   // alert('addEventListener: Great! You are reading the heading');
// });

// h1.onmouseenter = function () {
//   alert('hello');
// };

// h1.onclick = function () {
//   alert('hello');
// };

/*
const h1 = document.querySelector('h1');

const alertH1 = function () {
  alert('addEventListener1: Great! You are reading the heading');
  // h1.removeEventListener('mouseenter', alertH1);
};
// const alertH2 = function () {
//   alert('addEventListener2: Great! You are reading the heading');
// };

h1.addEventListener('mouseenter', alertH1);
// h1.addEventListener('click', alertH2);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 10000);
*/

/*
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
console.log(randomColor());

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  // console.log(e.currentTarget === this);
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);

  e.stopPropagation();
});

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('NAV', e.target, e.currentTarget);
  },
  true
);
*/

//////////////////////////////
// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target);
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target);
// });

/*
const h1 = document.querySelector('h1');
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);

// console.log(h1.firstElementChild);
// console.log(h1.lastElementChild);

console.log(h1.parentNode);
console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';

console.log(h1.closest('.header'));
console.log(h1.closest('h1'));

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});

const str = 'vu le gia hoa';
str.split(' ').forEach(function (el) {
  if (el === 'hoa') console.log('hello');
});
*/

/*
// bind method
const addTax = (rate, value) => value + value * rate;

const addVAT = addTax.bind(null, 0.23); // rate => fn
console.log(addVAT(100)); // value

// fn return fn
const addVATReturn = function (rate) {
  return function (value) {
    return value + value * rate;
  };
};
const result = addVATReturn(0.23); // Notice
console.log(result(100));

//..
// const handleHo = function (e) {};
// nav.addEventListener('mouseout', handleHo.bind(1));

// const btn1 = function () {
//   console.log('hello');
// };
// btn.addEventListener('click', btn1);
// btn.addEventListener('click', btn1());
*/
