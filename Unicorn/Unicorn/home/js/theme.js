// Theme toggle functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
});

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    
    // Check for saved theme preference or respect OS preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        // Toggle dark-theme class on body
        document.body.classList.toggle('dark-theme');
        
        // Save theme preference
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
        
        // Apply theme transition animation
        applyThemeTransition();
    });
    
    // Listen for OS theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
            applyThemeTransition();
        }
    });
}

function applyThemeTransition() {
    // Create a ripple effect for theme transition
    const ripple = document.createElement('div');
    ripple.className = 'theme-transition-ripple';
    
    // Style for the ripple effect
    ripple.style.position = 'fixed';
    ripple.style.top = '0';
    ripple.style.left = '0';
    ripple.style.width = '100%';
    ripple.style.height = '100%';
    ripple.style.opacity = '0';
    ripple.style.zIndex = '9999';
    ripple.style.pointerEvents = 'none';
    
    // Set background color based on theme
    if (document.body.classList.contains('dark-theme')) {
        ripple.style.backgroundColor = 'rgba(18, 18, 18, 0.2)';
    } else {
        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    }
    
    // Add ripple to the body
    document.body.appendChild(ripple);
    
    // Animate the ripple
    let start = null;
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        
        // Fade in and out
        if (progress < 300) {
            ripple.style.opacity = progress / 300;
        } else {
            ripple.style.opacity = 1 - ((progress - 300) / 300);
        }
        
        if (progress < 600) {
            requestAnimationFrame(animate);
        } else {
            document.body.removeChild(ripple);
        }
    }
    
    requestAnimationFrame(animate);
}