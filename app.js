const express = require('express');
const fs = require('fs');
const path = require('path');
const methodOverride = require('method-override');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride('_method'));

const arquivo = path.join(__dirname, 'public', 'cursos.json');

function carregarCursos() {
    const dados = fs.readFileSync(arquivo, 'utf8');
    return JSON.parse(dados);
}

function salvarCursos(cursos) {
    fs.writeFileSync(
        arquivo,
        JSON.stringify(cursos, null, 2)
    );
}

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/cursos', (req, res) => {
    const cursos = carregarCursos();
    res.render('cursos', { cursos });
});

app.get('/curso/:id', (req, res) => {
    const cursos = carregarCursos();

    const curso = cursos.find(
        c => c.id == req.params.id
    );

    res.render('curso', { curso });
});

app.get('/novo', (req, res) => {
    res.render('formCurso', {
        curso: null
    });
});

app.post('/cursos', (req, res) => {

    const cursos = carregarCursos();

    const novoCurso = {
        id: Date.now(),
        nome: req.body.nome,
        sigla: req.body.sigla,
        coordenador: req.body.coordenador,
        descricao: req.body.descricao
    };

    cursos.push(novoCurso);

    salvarCursos(cursos);

    res.redirect('/cursos');
});

app.get('/editar/:id', (req, res) => {

    const cursos = carregarCursos();

    const curso = cursos.find(
        c => c.id == req.params.id
    );

    res.render('formCurso', {
        curso
    });
});

app.post('/editar/:id', (req, res) => {

    const cursos = carregarCursos();

    const indice = cursos.findIndex(
        c => c.id == req.params.id
    );

    cursos[indice] = {
        id: cursos[indice].id,
        nome: req.body.nome,
        sigla: req.body.sigla,
        coordenador: req.body.coordenador,
        descricao: req.body.descricao
    };

    salvarCursos(cursos);

    res.redirect('/cursos');
});

app.post('/excluir/:id', (req, res) => {

    let cursos = carregarCursos();

    cursos = cursos.filter(
        c => c.id != req.params.id
    );

    salvarCursos(cursos);

    res.redirect('/cursos');
});

app.listen(3000, () => {
    console.log('Servidor rodando');
});