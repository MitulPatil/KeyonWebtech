import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 5000;
const configuredClientUrls = (process.env.CLIENT_URL || '')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

const slideSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true, trim: true },
    eyebrow: { type: String, default: 'Built for better business' },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    message: { type: String, required: true, trim: true, maxlength: 2000 }
  },
  { timestamps: true }
);

const Slide = mongoose.model('Slide', slideSchema);
const Product = mongoose.model('Product', productSchema);
const Contact = mongoose.model('Contact', contactSchema);

app.use(cors({
  origin(origin, callback) {
    const isLocalOrigin = !origin
      || origin === 'null'
      || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    callback(null, isLocalOrigin || configuredClientUrls.includes(origin));
  }
}));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.get('/api/slides', async (_req, res) => {
  try {
    const slides = await Slide.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json(slides);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load slides.' });
  }
});

app.get('/api/products', async (_req, res) => {
  try {
    const products = await Product.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load products.' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: 'Please complete every field.' });
    }

    await Contact.create({ name, email, phone, message });
    res.status(201).json({ message: 'Thanks. We will be in touch shortly.' });
  } catch (error) {
    res.status(500).json({ message: 'We could not send your message. Please try again.' });
  }
});

if (process.env.NODE_ENV === 'production' || process.env.SERVE_FRONTEND === 'true') {
  const frontendPath = path.resolve(__dirname, '../frontend');
  app.use(express.static(frontendPath));
  app.get('*', (_req, res) => res.sendFile(path.join(frontendPath, 'index.html')));
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () => console.log(`Keyonwebtech API running on port ${port}`));
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
