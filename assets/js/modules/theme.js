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
    const desktopSwitch = document.getElementById('theme-switch-desktop');
    const mobileSwitch = document.getElementById('theme-switch-mobile');
    const switches = [desktopSwitch, mobileSwitch].filter(Boolean);

    if (switches.length === 0) return;

    const syncSwitches = (state) => {
        switches.forEach(sw => {
            sw.checked = state;
        });
    };

    // 1. Set initial theme and switch state on page load
    const currentTheme = getPreferredTheme();
    applyTheme(currentTheme);
    syncSwitches(currentTheme === 'dark');


    // 2. Create a shared handler for the change event
    const handleThemeToggle = (e) => {
        const isChecked = e.target.checked;
        const newTheme = isChecked ? 'dark' : 'light';
        applyTheme(newTheme);
        saveTheme(newTheme);
        syncSwitches(isChecked);
    };

    // 3. Add change listener to all available switches
    switches.forEach(toggle => {
        toggle.addEventListener('change', handleThemeToggle);
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
