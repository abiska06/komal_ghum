document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        burger.classList.toggle('toggle');
    });

    // Smooth scrolling for "Learn More" button
    const learnMoreBtn = document.getElementById('learn-more');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function () {
            document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Gallery Navigation
    const galleryItems = document.querySelectorAll('.gallery-item');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentIndex = 0;

    galleryItems.forEach((item, index) => {
        if (index !== 0) {
            item.style.display = 'none';
        }
    });

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            galleryItems[currentIndex].style.display = 'none';
            currentIndex = (currentIndex + 1) % galleryItems.length;
            galleryItems[currentIndex].style.display = 'block';
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            galleryItems[currentIndex].style.display = 'none';
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            galleryItems[currentIndex].style.display = 'block';
        });
    }

    // Navbar scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 1)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // Scroll reveal animation
    const revealElements = document.querySelectorAll('.container');

    function checkScroll() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    checkScroll();
    window.addEventListener('scroll', checkScroll);

    // 🔵 INTERNAL Login Button (in-page toggle only)
    const internalLoginBtn = document.getElementById('form-login-btn');
    if (internalLoginBtn) {
        internalLoginBtn.addEventListener('click', function (event) {
            event.preventDefault();
            const loginSection = document.getElementById('login');
            loginSection.classList.toggle('active');
            if (loginSection.classList.contains('active')) {
                loginSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // 🟢 DO NOT block navbar login link — no preventDefault() here
});
