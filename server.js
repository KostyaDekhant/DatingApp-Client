const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));

app.get('/id:id', (req, res) => {
    const id = req.params.id;
    if(/^\d+$/.test(id)){
        res.sendFile(path.resolve(__dirname, 'public', 'profile.html'));
    }
    else{
        res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.get('/edit', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'profile_edit.html'));
});


app.listen(8082, () => {
    console.log('Server listening on localhost:8082');
})