import '../types/env.d.ts';

const unsplashUrl = import.meta.env.VITE_UNSPLASH_URL;

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton') as HTMLButtonElement;
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    const gallery = document.getElementById('gallery') as HTMLDivElement;
    const logoutButton = document.getElementById('logoutButton') as HTMLButtonElement;
    const message = document.getElementById('message') as HTMLDivElement;

    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        window.location.href = '/index.html';
        return;
    }

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('access_token');
        console.log('Logged out');
        window.location.href = '/index.html';
    });

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) fetchPhotos(query);
    });

    function fetchPhotos(query: string): void {
        
        const url = `${unsplashUrl}?query=${query}`;
        fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            displayPhotos(data.results);
            message.textContent = '';
        })
        .catch(error => {
            console.error('Error fetching photos:', error);
            message.textContent = 'Error fetching photos. Please try again.';
        });
    }

    function displayPhotos(photos: Array<{ urls: { small: string }, description: string }>): void {
        gallery.innerHTML = '';
        photos.forEach(photo => {
            const img = document.createElement('img');
            img.src = photo.urls.small;
            img.alt = photo.description || 'Photo';
            gallery.appendChild(img);
        });
    }
});
