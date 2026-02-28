const pages = ['full-team', 'lead','haptics', 'bci', 'software', 'game', 'business'];
let currentPage = 'full-team';
const FADE_DURATION = 400;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    initNavigation();
    const initialPage = getPageFromHash() || 'full-team';
    showPage(initialPage, true);
});

function initNavigation() {
    const navButtons = document.querySelectorAll('#team-nav button');
    console.log('Found buttons:', navButtons.length);

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const pageName = this.getAttribute('data-page');
            console.log('Clicked:', pageName);
            if (pageName !== currentPage) {
                fadeTransition(pageName);
                updateHash(pageName);
            }
        });
    });

    window.addEventListener('hashchange', function() {
        const page = getPageFromHash();
        if (page && page !== currentPage) {
            fadeTransition(page);
        }
    });
}

function fadeTransition(targetPage) {
    console.log('Transitioning to:', targetPage);
    const cards = document.querySelectorAll('.profile-card');
    console.log('Found cards:', cards.length);

    // Fade out all visible cards
    cards.forEach(card => {
        if (!card.classList.contains('hidden')) {
            card.classList.add('fade-out');
        }
    });

    // After fade out, switch content and fade in
    setTimeout(() => {
        cards.forEach(card => {
            const teams = card.getAttribute('data-teams');
            const shouldShow = targetPage === 'full-team' || teams.includes(targetPage);

            if (shouldShow) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });

        // Force reflow
        document.body.offsetHeight;

        // Fade in visible cards
        requestAnimationFrame(() => {
            cards.forEach(card => {
                if (!card.classList.contains('hidden')) {
                    card.classList.remove('fade-out');
                }
            });
        });

    }, FADE_DURATION);

    currentPage = targetPage;
    updateActiveButton(targetPage);
}

function showPage(pageName, instant = false) {
    console.log('Showing page:', pageName);
    const cards = document.querySelectorAll('.profile-card');

    cards.forEach(card => {
        const teams = card.getAttribute('data-teams');
        const shouldShow = pageName === 'full-team' || teams.includes(pageName);

        if (shouldShow) {
            card.classList.remove('fade-out', 'hidden');
        } else {
            card.classList.add('hidden');
            if (!instant) card.classList.add('fade-out');
        }
    });

    currentPage = pageName;
    updateActiveButton(pageName);
}

function updateActiveButton(pageName) {
    const navButtons = document.querySelectorAll('#team-nav button');

    navButtons.forEach(button => {
        const buttonPage = button.getAttribute('data-page');
        if (buttonPage === pageName) {
            button.setAttribute('data-active', 'true');
        } else {
            button.removeAttribute('data-active');
        }
    });
}

function updateHash(pageName) {
    window.location.hash = pageName;
}

function getPageFromHash() {
    const hash = window.location.hash.slice(1);
    if (pages.includes(hash)) {
        return hash;
    }
    return null;
}