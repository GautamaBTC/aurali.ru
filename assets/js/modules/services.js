/**
 * @typedef {Object} Service
 * @property {string} id - The unique identifier for the service.
 * @property {string} title - The title of the service.
 * @property {string} price - The price of the service.
 * @property {string} shortDescription - A brief description of the service.
 * @property {string[]} includes - A list of items included in the service.
 */

/**
 * Module-level state to hold services data.
 * @type {{services: Service[]}}
 */
const state = {
    services: [],
};

/**
 * Displays a modal with detailed information about a specific service.
 * @param {string} serviceId - The ID of the service to display.
 */
const showModal = (serviceId) => {
    const service = state.services.find(s => s.id === serviceId);
    if (!service) return;

    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;

    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h2 class="modal-service-title">${service.title}</h2>
                <p class="modal-service-price">${service.price}</p>
                <p>${service.shortDescription}</p>
                <h3 class="modal-service-subtitle">В процедуру входит:</h3>
                <ul class="modal-service-list">${service.includes.map(item => `<li>${item}</li>`).join('')}</ul>
                <a href="https://wa.me/79215232545?text=Запись на: ${encodeURIComponent(service.title)}" target="_blank" class="btn btn--primary">Записаться</a>
            </div>
        </div>
    `;
    modalContainer.innerHTML = modalHTML;
    document.body.classList.add('body-no-scroll');

    const overlay = modalContainer.querySelector('.modal-overlay');

    // Use setTimeout to allow the element to be painted before adding the transition class
    setTimeout(() => {
        overlay.classList.add('is-visible');
    }, 10);

    const closeModal = () => {
        overlay.classList.remove('is-visible');
        document.body.classList.remove('body-no-scroll');
        // Wait for the transition to finish before removing from DOM
        overlay.addEventListener('transitionend', () => {
            modalContainer.innerHTML = '';
        }, { once: true });
    };

    overlay.addEventListener('click', e => {
        if (e.target.matches('.modal-overlay, .modal-close')) {
            closeModal();
        }
    });
};

/**
 * Renders the service cards into the DOM and sets up click listeners.
 * @param {Service[]} services - An array of service objects to render.
 */
const renderServices = (services) => {
    const container = document.getElementById('services-container');
    if (!container) return;

    state.services = services;

    container.innerHTML = services.map(service => `
        <a href="#" class="service-card" data-id="${service.id}">
            <div class="service-card__bg"></div>
            <div class="service-card__content">
                <div class="service-card__icon">${service.icon_svg || ''}</div>
                <h3>${service.title}</h3>
                <p>${service.shortDescription}</p>
                <p><strong>${service.price}</strong></p>
                <span class="service-card__details">Подробнее</span>
            </div>
        </a>
    `).join('');

    container.addEventListener('click', e => {
        const card = e.target.closest('.service-card');
        if (card && card.dataset.id) {
            e.preventDefault();
            showModal(card.dataset.id);
        }
    });
};

import { fetchWithCache } from '../utils/cache.js';

/**
 * Fetches service data (from cache or network) and initializes the services section.
 * Renders the services or an error message if the fetch fails.
 * @returns {Promise<boolean>} A promise that resolves to true on success and false on failure.
 */
export const initServices = async () => {
    const container = document.getElementById('services-container');
    if (!container) return false;

    try {
        const servicesData = await fetchWithCache('services.json', 'services-cache-v3');
        renderServices(servicesData);
        return true; // Indicate success
    } catch (error) {
        console.error("Failed to load services:", error);
        container.innerHTML = '<p class="text-center">Не удалось загрузить услуги. Попробуйте обновить страницу.</p>';
        return false; // Indicate failure
    }
};
