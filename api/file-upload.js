const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { createWorker } = require('tesseract.js');
const cors = require('cors');

const app = express();
// Enable CORS for all routes
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/file-upload', upload.single('file'), async (req, res) => {
    if (req.file.mimetype === 'application/pdf') {
        pdfParse(req.file.buffer).then(result => {
            res.send({ text: result.text });
        });
    } else if (req.file.mimetype.includes('image')) {
        const worker = createWorker();
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(req.file.buffer);
        await worker.terminate();
        res.send({ text });
    } else {
        res.status(400).send('Unsupported file type');
    }
});

app.listen(3080, () => console.log('Server is running on port 3080'));
