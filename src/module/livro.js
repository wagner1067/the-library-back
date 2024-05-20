import mongoose from 'mongoose';

const LivroSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
    },
    pagina: {
        type: Number,
        required: true,
    },
    isbn: {
        type: String,
        required: true,
    },
    editora: {
        type: String,
        required: true,
    },
});

const Livro = mongoose.model('Livro', LivroSchema);
export default Livro;
