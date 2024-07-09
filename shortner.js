async function shortenUrl() {
    let originalUrl = document.getElementById('originalUrl').value.trim();
    
    if (originalUrl === '') {
        document.getElementById('error').classList.remove('hidden');
        return;
    } else {
        document.getElementById('error').classList.add('hidden');
    }

    if (!originalUrl.startsWith('https://')) {
        if (originalUrl.startsWith('http://')) {
            originalUrl = 'https://' + originalUrl.substring(7);
        } else {
            originalUrl = 'https://' + originalUrl;
        }
    }

    const apiUrl = 'https://smolurl.com/api/links';

    const requestHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    const requestBody = JSON.stringify({
        url: originalUrl
    });

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: requestHeaders,
            body: requestBody
        });

        const data = await response.json();
        if (data.data && data.data.short_url) {
            const shortenedUrl = data.data.short_url;

            document.getElementById('shortenedUrl').innerHTML = `
                Shortened URL: <a href="${shortenedUrl}" target="_blank" rel="noopener noreferrer">${shortenedUrl}</a>
            `;
            document.getElementById('shortenedUrl').classList.remove('hidden');
            document.getElementById('copyButton').classList.remove('hidden');
            document.getElementById('copyButton').innerText = 'Copy URL';
            document.getElementById('originalUrl').value = '';
        } else {
            throw new Error('Failed to shorten URL');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('shortenedUrl').innerHTML = 'Failed to shorten URL. Please try again later.';
        document.getElementById('shortenedUrl').classList.remove('hidden');
    }
}

function resetForm() {
    document.getElementById('originalUrl').value = '';
    document.getElementById('shortenedUrl').classList.add('hidden');
    document.getElementById('shortenedUrl').innerHTML = '';
    document.getElementById('copyButton').classList.add('hidden');
    document.getElementById('error').classList.add('hidden');
}

function copyUrl() {
    const shortenedUrlElement = document.getElementById('shortenedUrl').querySelector('a');
    if (shortenedUrlElement) {
        const tempInput = document.createElement('input');
        document.body.appendChild(tempInput);
        tempInput.value = shortenedUrlElement.href;
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        document.getElementById('copyButton').innerText = 'Copied';
    }
}
