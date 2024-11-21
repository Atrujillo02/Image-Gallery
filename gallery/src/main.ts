import '../types/env.d.ts';

const accessKey = import.meta.env.VITE_ACCESS_KEY;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;
const clientSecret = import.meta.env.VITE_SECRET_KEY;

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton') as HTMLButtonElement;
    console.log('Access key:', accessKey);

    loginButton.addEventListener('click', () => {
        const authUrl = `https://unsplash.com/oauth/authorize?client_id=${accessKey}&redirect_uri=${redirectUri}&response_type=code&scope=public+read_user+write_user+read_photos+write_photos`;
        window.location.href = authUrl;
    });

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
        fetchAccessToken(code);
    }
});

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
        if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            console.log('Access token stored:', localStorage.getItem('access_token'));

            window.location.href = './gallery.html';
        } else {
            console.error('Error: No access token received.');
        }
    } catch (error) {
        console.error('Error fetching access token:', error);
    }
}
