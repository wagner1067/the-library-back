import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Livro from './module/livro.js';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

const dbURI = process.env.DATABASE_URI || 'mongodb://localhost:27017/local';

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.error('Erro ao conectar ao MongoDB', err));

app.get('/livros', async (_, res) => {
    try {
        const livros = await Livro.find({});
        return res.status(200).json(livros);
    } catch (error) {
        console.error('Erro ao buscar livros:', error);
        return res.status(500).json({ message: 'Erro ao buscar livros' });
    }
});

app.get('/livros/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const livro = await Livro.findById(id);
        if (!livro) {
            return res.status(404).json({ message: 'Livro não encontrado' });
        }
        return res.status(200).json(livro);
    } catch (error) {
        console.error('Erro ao buscar livro:', error);
        return res.status(500).json({ message: 'Erro ao buscar livro' });
    }
});

app.post('/livros', async (req, res) => {
    const { titulo, pagina, isbn, editora } = req.body;

    if (!titulo || !pagina || !isbn || !editora) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    try {
        const livro = await Livro.create({ titulo, pagina, isbn, editora });
        return res.status(201).json(livro);
    } catch (error) {
        console.error('Erro ao criar livro:', error);
        return res.status(500).json({ message: 'Erro ao criar livro' });
    }
});

app.put('/livros/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, pagina, isbn, editora } = req.body;

    try {
        const livro = await Livro.findByIdAndUpdate(id, { titulo, pagina, isbn, editora }, { new: true });
        if (!livro) {
            return res.status(404).json({ message: 'Livro não encontrado' });
        }
        return res.status(200).json(livro);
    } catch (error) {
        console.error('Erro ao atualizar livro:', error);
        return res.status(500).json({ message: 'Erro ao atualizar livro' });
    }
});

app.delete('/livros/:id', async (req, res) => {
    const { id } = req.params;

    console.log(`Tentando deletar o livro com ID: ${id}`);

    try {
        const livro = await Livro.findByIdAndDelete(id);
        if (!livro) {
            console.log(`Livro com ID ${id} não encontrado`);
            return res.status(404).json({ message: 'Livro não encontrado' });
        }
        console.log(`Livro com ID ${id} deletado com sucesso`);
        return res.status(200).json({ message: 'Livro deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar livro:', error);
        return res.status(500).json({ message: 'Erro ao deletar livro' });
    }
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor funcionando na porta ${PORT}`);
});
