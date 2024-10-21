import '../types/env.d.ts';

const accessKey = import.meta.env.VITE_ACCESS_KEY;
const unsplashUrl = import.meta.env.VITE_UNSPLASH_URL;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton') as HTMLButtonElement;
    const searchButton = document.getElementById('searchButton') as HTMLButtonElement;
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    const gallery = document.getElementById('gallery') as HTMLDivElement;

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        fetchPhotos(query);
    });

    function fetchPhotos(query: string): void {
        const url = `${unsplashUrl}?query=${query}&client_id=${accessKey}`;

          const photos = fetch(url).then(response => {
              response.json().then(data => data && displayPhotos(data.results));
            }).catch(error => console.log('hola'));
    }

    function displayPhotos(photos: Array<{ urls: { small: string }, description: string }>): void {
        gallery.innerHTML = '';
        photos && photos.forEach(photo => {
            const img = document.createElement('img');
            img.src = photo.urls.small;
            img.alt = photo.description || 'Photo';
            gallery.appendChild(img);
        });
    }
});