// Animations for the website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize special animations
    initSpecialAnimations();
});

function initSpecialAnimations() {
    // Animate feature icons with a staggered delay
    animateFeatureIcons();
    
    // Add parallax effect to the hero section
    addParallaxEffect();
    
    // Add hover animations to interactive elements
    addHoverAnimations();
    
    // Add scroll-triggered animations
    addScrollAnimations();
}

// Animate feature icons with a staggered delay
function animateFeatureIcons() {
    const featureIcons = document.querySelectorAll('.feature-icon');
    
    featureIcons.forEach((icon, index) => {
        // Add staggered animation delay
        setTimeout(() => {
            icon.style.animation = 'scale 0.5s ease forwards';
        }, 100 * index);
    });
}

// Add parallax effect to the hero section
function addParallaxEffect() {
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        hero.style.backgroundPosition = `50% ${50 + (scrollPosition * 0.05)}%`;
    });
}

// Add hover animations to interactive elements
function addHoverAnimations() {
    // Buttons hover effect
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
        });
    });
    
    // Nav links hover effect
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.color = 'var(--primary-color)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.color = '';
        });
    });
}

// Add scroll-triggered animations
function addScrollAnimations() {
    // Animate elements when they enter the viewport
    const animatedElements = document.querySelectorAll('.feature-card, .section-title, .section-subtitle, .about-content > *');
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a class to trigger animation
                entry.target.classList.add('animate-in');
                
                // Add a staggered delay to children
                if (entry.target.children.length > 0) {
                    Array.from(entry.target.children).forEach((child, index) => {
                        child.style.transitionDelay = `${0.1 * index}s`;
                        child.classList.add('animate-in');
                    });
                }
                
                // Unobserve the target after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Trigger when at least 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before the element comes into view
    });
    
    // Observe all animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add a typing animation to the hero title
    const heroTitle = document.querySelector('.hero-title');
    
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '0.1em solid var(--primary-color)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                heroTitle.style.borderRight = 'none';
            }
        };
        
        // Start the typing animation after a short delay
        setTimeout(typeWriter, 500);
    }
}

// Create the floating animation for the about section
document.addEventListener('DOMContentLoaded', function() {
    const aboutImage = document.querySelector('.image-placeholder');
    
    if (aboutImage) {
        let floatAnimation;
        
        function startFloatAnimation() {
            let startTime = null;
            const duration = 3000; // 3 seconds per cycle
            const height = 20; // pixels to float up and down
            
            function float(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = (elapsed % duration) / duration;
                
                // Sine wave for smooth up and down motion
                const position = Math.sin(progress * Math.PI * 2) * height;
                aboutImage.style.transform = `translateY(${position}px)`;
                
                floatAnimation = requestAnimationFrame(float);
            }
            
            floatAnimation = requestAnimationFrame(float);
        }
        
        // Start the animation
        startFloatAnimation();
        
        // Pause animation when not in viewport to save resources
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startFloatAnimation();
            } else {
                cancelAnimationFrame(floatAnimation);
            }
        });
        
        observer.observe(aboutImage);
    }
});