import '../types/env.d.ts';

const unsplashUrl = import.meta.env.VITE_UNSPLASH_URL;

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton') as HTMLButtonElement;
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    const gallery = document.getElementById('gallery') as HTMLDivElement;
    const logoutButton = document.getElementById('logoutButton') as HTMLButtonElement;
    const message = document.getElementById('message') as HTMLDivElement;
    const favoritesButton = document.getElementById('favoritesButton') as HTMLButtonElement;

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

    favoritesButton.addEventListener('click', () => {
        showFavorites();
    });

    function fetchPhotos(query: string): void {
        const url = `${unsplashUrl}?query=${query}`;
        fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
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
    }

    function getFavorites(): Set<string> {
        const favorites = localStorage.getItem('favorites');
        return favorites ? new Set(JSON.parse(favorites)) : new Set();
    }

    function isFavorite(photoId: string): boolean {
        const favorites = getFavorites();
        return favorites.has(photoId);
    }

    function toggleFavorite(photoId: string, favoriteButton: HTMLButtonElement): void {
        const favorites = getFavorites();

        if (favorites.has(photoId)) {
            favorites.delete(photoId);
            favoriteButton.innerHTML = '<i class="bi bi-balloon-heart"></i>';
        } else {
            favorites.add(photoId);
            favoriteButton.innerHTML = '<i class="bi bi-balloon-heart-fill"></i>';
        }
        localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
    }

    function normalizePhotoId(url: string): string {
        const [baseUrl] = url.split('?');
        return baseUrl;
    }

    function displayPhotos(photos: Array<{ urls: { regular: string }, description: string }>): void {
        gallery.innerHTML = '';

        photos.forEach(photo => {
            const photoContainer = document.createElement('div');
            photoContainer.classList.add('photo-container');

            const img = document.createElement('img');
            img.src = photo.urls.regular;
            img.alt = photo.description || 'Photo';

            const photoId = normalizePhotoId(photo.urls.regular);

            const favoriteButton = document.createElement('button');
            favoriteButton.classList.add('favorite-button');

            favoriteButton.innerHTML = isFavorite(photoId) 
                ? '<i class="bi bi-balloon-heart-fill"></i>' 
                : '<i class="bi bi-balloon-heart"></i>';

            favoriteButton.addEventListener('click', () => {
                toggleFavorite(photoId, favoriteButton);
            });
            
            photoContainer.appendChild(img);
            photoContainer.appendChild(favoriteButton);;

            gallery.appendChild(photoContainer);

        });
    }

    function showFavorites() {
        const favorites = getFavorites();
        const favoritePhotos = Array.from(favorites).map(photoId => {
            return {
                urls: { regular: photoId },
                description: 'Favorite Photo'
            };
        });
    
        displayPhotos(favoritePhotos);
        
    }
});
