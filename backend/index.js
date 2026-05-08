const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
    key_id: 'YOUR_RAZORPAY_KEY_ID',
    key_secret: 'YOUR_RAZORPAY_SECRET'
});

// Set up storage
const uploadDir = path.join(__dirname, 'uploads');
const outputDir = path.join(__dirname, 'output');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// API Routes

// 1. PDF Merge
app.post('/api/merge', upload.array('files'), async (req, res) => {
    try {
        const mergedPdf = await PDFDocument.create();
        for (const file of req.files) {
            const pdfBytes = fs.readFileSync(file.path);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
        const mergedPdfBytes = await mergedPdf.save();
        const outputPath = path.join(outputDir, `merged-${Date.now()}.pdf`);
        fs.writeFileSync(outputPath, mergedPdfBytes);
        
        // Clean up uploaded files
        req.files.forEach(file => fs.unlinkSync(file.path));

        res.download(outputPath, 'merged.pdf', () => {
            fs.unlinkSync(outputPath); // Clean up after download
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to merge PDFs' });
    }
});

// 2. PDF Compress (Basic re-save to strip some metadata/unused objects)
app.post('/api/compress', upload.single('file'), async (req, res) => {
    try {
        const pdfBytes = fs.readFileSync(req.file.path);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        
        // Save without some info or streams to try reducing size
        const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: false });
        
        const outputPath = path.join(outputDir, `compressed-${Date.now()}.pdf`);
        fs.writeFileSync(outputPath, compressedPdfBytes);
        
        fs.unlinkSync(req.file.path);

        res.download(outputPath, 'compressed.pdf', () => {
            fs.unlinkSync(outputPath);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to compress PDF' });
    }
});

// 3. Image Conversion: JPG to PNG
app.post('/api/jpg-to-png', upload.single('file'), async (req, res) => {
    try {
        const outputPath = path.join(outputDir, `converted-${Date.now()}.png`);
        await sharp(req.file.path).png().toFile(outputPath);
        
        fs.unlinkSync(req.file.path);

        res.download(outputPath, 'converted.png', () => {
            fs.unlinkSync(outputPath);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to convert image' });
    }
});

// 4. Image Conversion: PNG to JPG
app.post('/api/png-to-jpg', upload.single('file'), async (req, res) => {
    try {
        const outputPath = path.join(outputDir, `converted-${Date.now()}.jpg`);
        await sharp(req.file.path).jpeg({ quality: 90 }).toFile(outputPath);
        
        fs.unlinkSync(req.file.path);

        res.download(outputPath, 'converted.jpg', () => {
            fs.unlinkSync(outputPath);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to convert image' });
    }
});

// 5. Word to PDF & PDF to Word
const convertapi = require('convertapi')('voJSFwBmaevXpc0t26ujGyxbOtqilceI'); // Add free key here

app.post('/api/word-to-pdf', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        
        if (convertapi.config.secret === 'YOUR_CONVERTAPI_SECRET') {
            fs.unlinkSync(req.file.path);
            return res.status(500).json({ message: 'Setup Required: Please add your free ConvertAPI key in backend/index.js to enable document conversion.' });
        }
        
        const result = await convertapi.convert('pdf', { File: req.file.path }, 'docx');
        const savedFiles = await result.saveFiles(outputDir);
        const outputPath = savedFiles[0];
        
        fs.unlinkSync(req.file.path);
        
        res.download(outputPath, 'converted.pdf', () => {
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });
    } catch (error) {
        console.error("ConvertAPI Error:", error);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: 'Failed to convert Word to PDF.' });
    }
});

app.post('/api/pdf-to-word', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        if (convertapi.config.secret === 'YOUR_CONVERTAPI_SECRET') {
            fs.unlinkSync(req.file.path);
            return res.status(500).json({ message: 'Setup Required: Please add your free ConvertAPI key in backend/index.js to enable document conversion.' });
        }
        
        const result = await convertapi.convert('docx', { File: req.file.path }, 'pdf');
        const savedFiles = await result.saveFiles(outputDir);
        const outputPath = savedFiles[0];
        
        fs.unlinkSync(req.file.path);
        
        res.download(outputPath, 'converted.docx', () => {
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });
    } catch (error) {
        console.error("ConvertAPI Error:", error);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: 'Failed to convert PDF to Word.' });
    }
});

// 6. MP4 to MP3
app.post('/api/mp4-to-mp3', upload.single('file'), (req, res) => {
    try {
        const outputPath = path.join(outputDir, `converted-${Date.now()}.mp3`);
        ffmpeg(req.file.path)
            .toFormat('mp3')
            .on('end', () => {
                fs.unlinkSync(req.file.path);
                res.download(outputPath, 'converted.mp3', () => {
                    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
                });
            })
            .on('error', (err) => {
                console.error(err);
                if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
                res.status(500).json({ error: 'Failed to convert video to audio' });
            })
            .save(outputPath);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process request' });
    }
});

// 7. MP4 to GIF
app.post('/api/mp4-to-gif', upload.single('file'), (req, res) => {
    try {
        const outputPath = path.join(outputDir, `converted-${Date.now()}.gif`);
        ffmpeg(req.file.path)
            .outputOptions([
                '-vf', 'fps=10,scale=320:-1:flags=lanczos',
                '-c:v', 'gif'
            ])
            .on('end', () => {
                fs.unlinkSync(req.file.path);
                res.download(outputPath, 'converted.gif', () => {
                    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
                });
            })
            .on('error', (err) => {
                console.error(err);
                if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
                res.status(500).json({ error: 'Failed to convert video to GIF' });
            })
            .save(outputPath);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process request' });
    }
});

// 8. Razorpay Create Order
app.post('/api/create-order', async (req, res) => {
    try {
        const options = {
            amount: 999 * 100, // ₹999 in paise
            currency: "INR",
            receipt: "receipt_order_" + Date.now(),
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// 9. Razorpay Verify Payment
app.post('/api/verify-payment', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', 'YOUR_RAZORPAY_SECRET')
                                    .update(body.toString())
                                    .digest('hex');
    
    if (expectedSignature === razorpay_signature) {
        // In a real app, update user's premium status in database here
        res.json({ success: true, message: 'Payment verified successfully' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid signature' });
    }
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
