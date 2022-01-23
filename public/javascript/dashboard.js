
fetch('/checkUser', { method: 'GET' })
    .then(response => response.text())
    .then(text => {
        if (text != '1') {
            location.href = '/';
        }
    })
