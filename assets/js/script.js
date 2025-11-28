// Hero
const heroSwiper = new Swiper('.heroSwiper', {
  direction: 'horizontal',
  loop: true,
  speed: 900,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});
function safeQuery(slide, selector) {
  if (!slide) return null;
  try {
    return slide.querySelector(selector);
  } catch (e) {
    return null;
  }
}
function animateIn(slide) {
  const content = safeQuery(slide, '.slide_content');
  const title = safeQuery(slide, '.slide_title');
  const desc = safeQuery(slide, '.slide_desc');
  gsap.killTweensOf([content, title, desc]);

  const tl = gsap.timeline();
  if (content) tl.fromTo(content, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0);
  if (title) tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.12, ease: 'power3.out' }, 0.12);
  if (desc) tl.fromTo(desc, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.0, delay: 0.26, ease: 'power3.out' }, 0.26);
}
function animateOut(slide) {
  const content = safeQuery(slide, '.slide_content');
  const title = safeQuery(slide, '.slide_title');
  const desc = safeQuery(slide, '.slide_desc');

  gsap.killTweensOf([content, title, desc]);

  const tl = gsap.timeline();
  if (desc) tl.to(desc, { opacity: 0, y: -18, duration: 0.35, ease: 'power2.in' }, 0);
  if (title) tl.to(title, { opacity: 0, y: -28, duration: 0.45, ease: 'power2.in' }, 0.06);
  if (content) tl.to(content, { opacity: 0, y: -40, duration: 0.55, ease: 'power2.in' }, 0.12);
}
const initialSlide = heroSwiper.slides[heroSwiper.activeIndex] || null;
if (initialSlide) {
  setTimeout(() => animateIn(initialSlide), 60);
}

heroSwiper.on('slideChangeTransitionStart', function () {
  const prevSlide = this.slides && typeof this.previousIndex !== 'undefined' ? this.slides[this.previousIndex] : null;
  if (prevSlide) animateOut(prevSlide);

  const activeSlide = this.slides && typeof this.activeIndex !== 'undefined' ? this.slides[this.activeIndex] : null;
  if (activeSlide) {
    setTimeout(() => animateIn(activeSlide), 80);
  }
});

heroSwiper.on('transitionEnd', function () {
  this.slides.forEach((s, idx) => {
    if (idx !== this.activeIndex) {
      const content = safeQuery(s, '.slide_content');
      const title = safeQuery(s, '.slide_title');
      const desc = safeQuery(s, '.slide_desc');
      if (content) gsap.set(content, { opacity: 0, y: -40 });
      if (title) gsap.set(title, { opacity: 0, y: -30 });
      if (desc) gsap.set(desc, { opacity: 0, y: -30 });
    }
  });
});




// Sections
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  function splitTextKeepMarkup(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(node => {
      const txt = node.textContent;
      if (!txt.trim()) {
        node.parentNode.replaceChild(document.createTextNode(txt), node);
        return;
      }
      const frag = document.createDocumentFragment();
      for (let ch of txt.split("")) {
        const span = document.createElement("span");
        span.className = "char";
        span.innerHTML = (ch === " ") ? "&nbsp;" : ch;
        frag.appendChild(span);
      }
      node.parentNode.replaceChild(frag, node);
    });

    return el.querySelectorAll(".char");
  }

  document.querySelectorAll(".account-sec").forEach(section => {
    const title = section.querySelector(".sec-heading");
    const subtitle = section.querySelector(".sec-sub-title");

    if (!title) return;

    const chars = splitTextKeepMarkup(title);
    title.style.opacity = 1;
    gsap.fromTo(chars,
      { y: 30, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        stagger: 0.04,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
        }
      }
    );

    gsap.fromTo(subtitle,
      { y: 30, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.7,
        ease: "power2.out",
        delay: 1.0,
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
        }
      }
    );
  });
});


gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

  let cards = gsap.utils.toArray(".card");
  const totalCards = cards.length;
  const cardWidth = cards[0]?.offsetWidth || 280;
  const cardContainer = document.querySelector('.card-container');

  let mm = gsap.matchMedia();

  mm.add({
    isDesktop: `(min-width: 1301px)`,
    isMedium: `(min-width: 951px) and (max-width: 1300px)`,
    isMobile: `(max-width: 950px)`
  }, (context) => {

    let { isDesktop, isMedium, isMobile } = context.conditions;

    const verticalOffsetPerCard = isMobile ? 50 : 35;
    const rotationAmount = isDesktop ? 2 : 0;
    const cardAppearDuration = 1.0;

    const mediumBaseRotation = -3;
    const mediumRotationStep = 1.5; 

    let centeringOffsetX = 0;
    let desktopHorizontalStep = 0;

    if (isDesktop) {
      desktopHorizontalStep = cardWidth - 20;
      const totalSpreadWidth = cardWidth + (totalCards - 1) * desktopHorizontalStep;
      const containerWidth = cardContainer.offsetWidth || 1250;
      centeringOffsetX = (containerWidth - totalSpreadWidth) / 2;
    }

    let mediumCenterX = 0;
    let mediumGap = 0;

    if (isMedium) {
      const containerWidth = cardContainer.offsetWidth || window.innerWidth;
      const totalCardsWidth = totalCards * cardWidth;
      mediumGap = -35; 
      const totalWidth = totalCardsWidth + mediumGap * (totalCards - 1);
      mediumCenterX = (containerWidth - totalWidth) / 2;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#card-pin-section",
        pin: true,
        start: "top top",
        end: "+=3500",
        scrub: 1,
        markers: false,
      }
    });

    tl.fromTo(cards, {
      opacity: 0,
      x: 0,
      y: "90vh",
      rotation: 0,
      scale: isMedium ? 0.9 : 1
    }, {
      opacity: 1,

      x: (index) =>
        isDesktop
          ? centeringOffsetX + index * desktopHorizontalStep
          : isMedium
            ? mediumCenterX + index * (cardWidth + mediumGap)
            : 0,

      y: (index) =>
        isMedium ? -10 : index * verticalOffsetPerCard,

      rotation: (index) =>
        isMedium
          ? mediumBaseRotation + index * mediumRotationStep
          : isDesktop
            ? (index - (totalCards - 1) / 2) * rotationAmount
            : 0,

      ease: "power2.out",
      duration: cardAppearDuration,

      stagger: isMobile ? cardAppearDuration : { amount: 0.8 }
    }, 0);

    tl.to({}, { duration: 0.7 });

    tl.to(cards, {
      opacity: 0,
      y: "-=100vh",
      x: isMobile ? "+=20" : (index) => `+=${index * 3}`,
      ease: "power1.in",
      duration: 0.6,
      stagger: { amount: 0.6 }
    }, ">");

  });
});







// Market Table
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  gsap.set(".table-markt", { opacity: 0, y: 0, rotateX: 0, transformOrigin: "top center", willChange: "transform, opacity" });
  gsap.set(".btns-markt", { opacity: 0, y: 0, willChange: "transform, opacity" });

  ScrollTrigger.batch(".table-markt", {
    onEnter: batch => {
      gsap.to(batch, {
        startAt: {
          y: 140,
          rotateX: 35,
          scale: 1.65,
          transformOrigin: "top center"
        },
        opacity: 1,
        y: 0,
        delay: 1.3,
        rotateX: 0,
        scale: 1,
        duration: 1.3,
        ease: "power3.out",
        overwrite: "auto"
      });
    },
    once: true,
    start: "top 85%",
    trigger: ".market-sec"
  });

  ScrollTrigger.batch(".btns-markt", {
    onEnter: batch => {
      gsap.to(batch, {
        startAt: { y: -120 },
        opacity: 1,
        y: 0,
        delay: 1.3,
        duration: 0.9,
        ease: "power3.out",
        overwrite: "auto",
        stagger: { each: 0.06 }
      });
    },
    once: true,
    start: "top 85%",
    trigger: ".market-sec"
  });
});



gsap.registerPlugin(ScrollTrigger);

function initCardAnimation() {
  const cards = document.querySelectorAll('.card-st');
  const stickyContainer = document.querySelector('.sticky-container');
  const windowWidth = window.innerWidth;
  const numCards = cards.length;

  let cardWidth, cardGap;

  if (windowWidth < 950) {
    const cardsPerRow = 2;
    const containerPaddingLeft = 16;
    const containerPaddingRight = 16;
    const cardGapValue = 10;
    const containerWidth = stickyContainer.offsetWidth - containerPaddingLeft - containerPaddingRight;
    cardWidth = (containerWidth / cardsPerRow) - ((cardGapValue * (cardsPerRow - 1)) / cardsPerRow);
    cardGap = cardGapValue;
  } else {
    const cardWidthRatio = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card-width-ratio'));
    const cardGapRatio = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card-gap-ratio'));
    const totalRatioUnits = (numCards * cardWidthRatio) + ((numCards + 1) * cardGapRatio);
    const ratioUnit = windowWidth / totalRatioUnits;
    cardWidth = cardWidthRatio * ratioUnit;
    cardGap = cardGapRatio * ratioUnit;
  }

  cards.forEach(card => {
    card.style.width = `${cardWidth}px`;
  });

  gsap.set(cards, {
    x: -windowWidth - 100,
    opacity: 0,
    scale: 0.8
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.cards-section',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      pin: stickyContainer,
      anticipatePin: 1
    }
  });

  if (windowWidth < 950) {
    const cardsPerRow = 2;
    const secondRowYOffset = -50;

    cards.forEach((card, i) => {
      const row = Math.floor(i / cardsPerRow);
      const col = i % cardsPerRow;
      let yPos = row * (cardWidth * 0.8 + cardGap);

      if (row === 1) {
        yPos += secondRowYOffset;
      }

      const xPos = col * (cardWidth + cardGap);

      tl.to(card, {
        x: xPos,
        y: yPos,
        opacity: 1,
        scale: 1,
        duration: 0.15,
        ease: "power2.out"
      }, i * 0.1);
    });
  } else {
    for (let i = 0; i < numCards; i++) {
      const xPos = cardGap + (i * (cardWidth + cardGap));
      tl.to(cards[i], {
        x: xPos,
        opacity: 1,
        scale: 1,
        duration: 0.15,
        ease: "power2.out"
      }, i * 0.1);
    }
  }

  tl.to({}, { duration: 0.3 });

  tl.to(cards, {
    x: (i) => windowWidth + (i * 50),
    y: (i) => i * -20,
    rotate: (i) => i * 3,
    scale: 0.9,
    opacity: (i) => 1 - (i * 0.15),
    stagger: 0.03,
    duration: 0.3,
    ease: "power3.in"
  });

  const missionBox = document.querySelector('.mission-box');
  const menaServ = document.querySelector('.mena-serv');

  tl.to(missionBox, {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 0.6,
    ease: "back.out(1.7)"
  }, "+=0.1");

  tl.to(menaServ, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power3.out"
  }, "-=0.2");
}

document.addEventListener('DOMContentLoaded', initCardAnimation);
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});






document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  function splitTextKeepMarkup(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(node => {
      const txt = node.textContent;
      if (!txt.trim()) {
        node.parentNode.replaceChild(document.createTextNode(txt), node);
        return;
      }
      const frag = document.createDocumentFragment();
      for (let ch of txt.split("")) {
        const span = document.createElement("span");
        span.className = "char";
        span.innerHTML = (ch === " ") ? "&nbsp;" : ch;
        frag.appendChild(span);
      }
      node.parentNode.replaceChild(frag, node);
    });
    return el.querySelectorAll(".char");
  }

  document.querySelectorAll(".about-sec").forEach(section => {
    const title = section.querySelector(".sec-heading");
    const subtitle = section.querySelector(".sec-sub-title");

    if (!title) return;

    const chars = splitTextKeepMarkup(title);
    title.style.opacity = 1;
    gsap.fromTo(chars,
      { y: 30, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        stagger: 0.04,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
        }
      }
    );

    gsap.fromTo(subtitle,
      { y: 30, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.7,
        ease: "power2.out",
        delay: 1.0,
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none none",
        }
      }
    );
  });
});
