const express = require('express')
const fs = require('fs');
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const notes = require('./db/db.json')
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname,'/public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname,'/public/notes.html')));

app.get('/api/notes', (req, res) => res.json(notes));

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);
    
    const { title, text } = req.body

    if(title && text) {
        const newNote = {
            title,
            text,
            note_id: uuidv4(),
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if(err) {
                console.error(err);
            }
            else {
                const parsedNotes = JSON.parse(data)
                parsedNotes.push(newNote)

                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 3), (err) => {
                    err ? console.error(err) : console.log (`New Note for ${newNote.title} has been written to the JSON file`)
                })
            }
        })
    }
})

app.get('*', (req, res) => res.sendFile(path.join(__dirname,'/public/index.html')));

app.listen(PORT, () => console.log(`Express Server listening at http://localhost:${PORT}`));