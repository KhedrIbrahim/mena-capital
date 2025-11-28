const navbar = document.getElementById("navbar");
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');


window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
});



menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
});


const dropdownTrigger = document.querySelector('.dropdown-trigger');
const dropdown = document.getElementById('dropDownLinks');

dropdownTrigger.addEventListener('click', (e) => {
    dropdown.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && !dropdownTrigger.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});





// Ticker bar
const tickerSwiper = new Swiper(".marketTickerSwiper", {
    slidesPerView: 6,
    spaceBetween: 0,
    loop: true,
    speed: 600,
    autoplay: {
        delay: 1500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
    },

    breakpoints: {
        0: {
            slidesPerView: 2
        },
        768: {
            slidesPerView: 3
        },
        1100: {
            slidesPerView: 4
        },
        1300: {
            slidesPerView: 5
        },
        1500: {
            slidesPerView: 6
        }
    }
});

function animateRandomColors() {
    const prices = document.querySelectorAll(".rand_color");
    prices.forEach(price => {
        const isGreen = Math.random() > 0.5;
        price.style.color = isGreen ? "#16A249" : "#d63031";
    });
}
setInterval(animateRandomColors, 500);
animateRandomColors();




// Smooth scroll
const links = document.querySelectorAll('.mov-link');
const lenis = new Lenis({
    duration: 1.4,
    smooth: true
});
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
links.forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        const scrollTargetId = this.getAttribute('ele-to-scroll');
        const targetElement = document.getElementById(scrollTargetId);
        if (targetElement) {
            lenis.scrollTo(targetElement);
        }
        document.body.classList.remove('nav-active');
    });
});
function handleActiveNavOnScroll() {
    let currentSection = '';

    links.forEach(link => {
        const sectionId = link.getAttribute('ele-to-scroll');
        const section = document.getElementById(sectionId);
        const sectionTop = section.offsetTop - window.innerHeight / 2;
        const sectionBottom = section.offsetTop + section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            currentSection = sectionId;
        }
    });

    links.forEach(link => {
        if (link.getAttribute('ele-to-scroll') === currentSection) {
            link.classList.add('active-nav');
        } else {
            link.classList.remove('active-nav');
        }
    });
}
window.addEventListener('scroll', handleActiveNavOnScroll);


// Cursor
const cursor = document.querySelector('.cursor');
const hoverElements = document.querySelectorAll('a, button, td');
window.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});



// Footer
document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(".footer .cont",
        { opacity: 0, y: 200 },
        {
            opacity: 1,
            y: 0,
            delay: 1.2,
            duration: 1.3,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".footer",
                start: "top 100%",
                toggleActions: "play reverse play reverse",
            }
        }
    );
});
