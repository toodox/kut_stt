const functions = require("firebase-functions");

const hanspell = require('hanspell');
const checkEnd = function() {
    console.log("// check ends.");
};
const checkError = function(error) {
    console.error("error occurred: ", error);
};

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    organization: "org-bTK9dZIheZ2DtTRncOdFg1hn",
    apiKey: "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",
});

const path = require('path');

const express = require('express');
const app = express();

const filePath = '/public/';


app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + filePath + 'index.html'));
});

app.get('/info-use', (req, res) => {
    res.sendFile(path.join(__dirname + filePath + '이용안내.html'));
});

app.get('/select-type', (req, res) => {
    res.sendFile(path.join(__dirname + filePath + '유형선택.html'));
});

app.get('/notice', (req, res) => {
    res.sendFile(path.join(__dirname + filePath + '유의사항.html'));
});

app.get('/mock-interview', (req, res) => {
    res.sendFile(path.join(__dirname + filePath + '모의면접.html'));
});

app.get('/submit', (req, res) => {
    res.sendFile(path.join(__dirname + filePath + '완료및제출.html'));
});

app.get('/results', (req, res) => {
    res.sendFile(path.join(__dirname + filePath + '상세결과.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + filePath + '로그인.html'));
});

app.get('/sign-up', (req, res) => {
    res.sendFile(path.join(__dirname + filePath + '회원가입2.html'));
});

app.get('/announcement', (req, res) => {
    res.sendFile(path.join(__dirname + filePath + '공지사항.html'));
});

app.get('/questions', (req, res) => {
    res.sendFile(path.join(__dirname + filePath + '자주하는질문.html'));
});

app.get('/admin-page1', (req, res) => {
    res.sendFile(path.join(__dirname + filePath + '관리자페이지.html'));
});

app.get('/admin-page2', (req, res) => {
    res.sendFile(path.join(__dirname + filePath + '관리자페이지2.html'));
});

app.post('/submitForm', (req, res) => {
    const { sentence } = req.body;
    const spellCheck = async function(results) {
        var tokens = [];
        var suggestions = [];
        
        console.log(results);
        for await (const element of results) {
            tokens.push(element.token);
            suggestions.push(element.suggestions);
        }

        console.log(tokens);
        console.log(suggestions);

        let response = {
            tokens: tokens, 
            suggestions: suggestions
        };

        res.send(JSON.stringify(response));
    };

    hanspell.spellCheckByPNU(sentence, 6000, spellCheck, checkEnd, checkError);
});


const api = functions.https.onRequest(app);

module.exports = {
    api
}