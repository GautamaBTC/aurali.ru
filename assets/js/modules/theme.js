/**
 * @file Manages the light/dark theme of the application.
 */

const THEME_STORAGE_KEY = 'li-studio-theme';

/**
 * Applies the selected theme by setting the 'data-theme' attribute on the html element.
 * @param {string} theme - The theme to apply ('light' or 'dark').
 */
const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
};

/**
 * Saves the user's theme preference to localStorage.
 * @param {string} theme - The theme to save.
 */
const saveTheme = (theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
};

/**
 * Gets the preferred theme based on saved preference or OS setting.
 * @returns {string} The preferred theme ('light' or 'dark').
 */
const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
        return savedTheme;
    }
    // Default to light theme as requested by the client.
    return 'light';
};

/**
 * Initializes the theme switcher functionality.
 * - Sets the initial theme based on user preference or OS setting.
 * - Adds a click listener to the theme toggle button.
 * - Listens for changes in OS theme preference.
 */
export const initTheme = () => {
    const desktopToggle = document.getElementById('theme-toggle-desktop');
    const mobileToggle = document.getElementById('theme-toggle-mobile');
    const toggles = [desktopToggle, mobileToggle].filter(Boolean); // Filter out nulls

    if (toggles.length === 0) return;

    // 1. Set initial theme on page load
    applyTheme(getPreferredTheme());

    // 2. Create a shared handler for the click event
    const handleThemeToggle = (e) => {
        const button = e.currentTarget;
        // Add spinning class for animation
        button.classList.add('is-spinning');

        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        saveTheme(newTheme);

        // Remove the class after the animation completes
        button.addEventListener('transitionend', () => {
            button.classList.remove('is-spinning');
        }, { once: true });
    };

    // 3. Add click listener to all available toggles
    toggles.forEach(toggle => {
        toggle.addEventListener('click', handleThemeToggle);
    });

    // 4. Listen for OS-level theme changes
    // This will only apply if the user has NOT manually overridden the theme.
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
        const isThemeSaved = localStorage.getItem(THEME_STORAGE_KEY);
        if (!isThemeSaved) {
            const newTheme = e.matches ? 'light' : 'dark';
            applyTheme(newTheme);
        }
    });
};
