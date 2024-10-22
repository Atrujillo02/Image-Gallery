import '../types/env.d.ts';

const accessKey = import.meta.env.VITE_ACCESS_KEY;
const clientSecret = import.meta.env.VITE_SECRET_KEY;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;
const unsplashUrl = import.meta.env.VITE_UNSPLASH_URL;

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton') as HTMLButtonElement;
    const searchButton = document.getElementById('searchButton') as HTMLButtonElement;
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    const gallery = document.getElementById('gallery') as HTMLDivElement;

    loginButton.addEventListener('click', () => {
        const authUrl = `https://unsplash.com/oauth/authorize?client_id=${accessKey}&redirect_uri=${redirectUri}&response_type=code&scope=public+read_user+write_user+read_photos+write_photos`;
        window.location.href = authUrl;
    });

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        fetchAccessToken(code);
    }

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) fetchPhotos(query);
    });

    function fetchPhotos(query: string): void {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            console.error('No access token found. Please login first.');
            return;
        }

        const url = `${unsplashUrl}?query=${query}`;
        
        fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok. Please try logging in again.');
            }
            return response.json();
        })
        .then(data => displayPhotos(data.results))
        .catch(error => console.error('Error fetching photos:', error));
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

    async function fetchAccessToken(code: string): Promise<void> {
        const tokenUrl = 'https://unsplash.com/oauth/token';
        const payload = {
            client_id: accessKey,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            code: code,
            grant_type: 'authorization_code'
        };

        try {
            const response = await fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            localStorage.setItem('access_token', data.access_token);
            console.log('Access token:', data.access_token);

            window.history.replaceState({}, document.title, redirectUri);

        } catch (error) {
            console.error('Error fetching access token:', error);
        }
    }
});
