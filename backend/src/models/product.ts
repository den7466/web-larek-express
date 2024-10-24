import mongoose from 'mongoose';

interface Iimage {
  fileName: string;
  originalName: string;
}

interface IProduct {
  title: string;
  image: object;
  category: string;
  description: string;
  price: number;
}

const imagesSchema = new mongoose.Schema<Iimage>({
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  }
});

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    unique: true
  },
  image: {
    type: imagesSchema,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    default: null
  }
});

export default mongoose.model<IProduct>('product', productSchema);