import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const slideSchema = new mongoose.Schema({
  imageUrl: String,
  eyebrow: String,
  title: String,
  description: String,
  order: Number
});

const Slide = mongoose.model('Slide', slideSchema);

const productSchema = new mongoose.Schema({
  imageUrl: String,
  title: String,
  description: String,
  order: Number
});

const Product = mongoose.model('Product', productSchema);

const slides = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=85',
    eyebrow: 'Built for better business',
    title: 'A clearer way to move your business forward.',
    description: 'Thoughtful digital products and dependable technology for teams ready to do their best work.',
    order: 1
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1800&q=85',
    eyebrow: 'People. Product. Progress.',
    title: 'Good ideas deserve a steady partner.',
    description: 'We bring strategy, design, and engineering together to make complex work feel simple.',
    order: 2
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=85',
    eyebrow: 'Make work feel lighter',
    title: 'Technology that keeps up with you.',
    description: 'From the first conversation to launch day, we make every detail count.',
    order: 3
  }
];

const products = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=85',
    title: 'Northstar',
    description: 'A calm, focused workspace for teams planning their next big move.',
    order: 1
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&w=900&q=85',
    title: 'Fieldnotes',
    description: 'Turn customer conversations into insight your whole team can act on.',
    order: 2
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85',
    title: 'Relay',
    description: 'Keep every project, handoff, and small win moving in the same direction.',
    order: 3
  }
];

await mongoose.connect(process.env.MONGODB_URI);
await Slide.deleteMany({});
await Slide.insertMany(slides);
await Product.deleteMany({});
await Product.insertMany(products);
console.log(`Seeded ${slides.length} slides and ${products.length} products.`);
await mongoose.disconnect();
