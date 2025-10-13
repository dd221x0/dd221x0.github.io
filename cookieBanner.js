// Cookie Banner Functionality
const initializeCookieBanner = () => {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');
    
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (cookieConsent === null) {
        // Show banner if no choice has been made
        cookieBanner.classList.remove('hidden');
    } else if (cookieConsent === 'accepted') {
        // Load Google Analytics if previously accepted
        loadGoogleAnalytics();
    }
    
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.classList.add('hidden');
        loadGoogleAnalytics();
    });
    
    declineBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.classList.add('hidden');
    });
};

const loadGoogleAnalytics = () => {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-MNQGK06S1X';
    document.head.appendChild(script);
    
    script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-MNQGK06S1X');
        window.gtag = gtag;
    };
};

export {
    initializeCookieBanner,
};
