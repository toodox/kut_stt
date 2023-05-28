const functions = require("firebase-functions");

const admin = require("firebase-admin");

admin.initializeApp();
var db = admin.firestore();

const express = require('express');
const app = express();
const path = require('path');
const filePath = '/public/';

const hanspell = require('hanspell');
const checkEnd = function() {
    console.log("// check ends.");
};
const checkError = function(error) {
    console.error("error occurred: ", error);
};

const keyword = require("keyword-extractor-korean");
const extractor = keyword();

const { Configuration, OpenAIApi } = require("openai");
const { organization, apiKey } = require("./public/assets/js/openAIConfig.js");
const configuration = new Configuration({
    organization: organization,
    apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);


app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + filePath + 'index.html'));
});
// 이용안내 페이지 삭제
// app.get('/info-use', (req, res) => { 
//     res.sendFile(path.join(__dirname + filePath + '이용안내.html'));
// });

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

app.get('/admin-edit-page', (req, res) => {
    res.sendFile(path.join(__dirname + filePath + '관리자수정페이지.html'));
});

app.get('/choiceresults', (req, res) => {
    res.sendFile(path.join(__dirname + filePath + '상세결과면접선택.html'));
});

app.get('/admin-ans-edit', (req, res) => {
    res.sendFile(path.join(__dirname + filePath + '관리자질문유형수정.html'));
});

function sortByNumberDescending(a, b) {
    return b.number - a.number;
}

app.post('/submitForm', (req, res) => {
    const { sentence , num} = req.body;
    const spellCheck = async function(results) {
        var tokens = [];
        var suggestions = [];
        
        console.log(results);
        for await (const element of results) {
            tokens.push(element.token);
            suggestions.push(element.suggestions);
        }

        var keywords = extractor(sentence);
        var keyObj = Object.keys(keywords).map(key => ({ word: key, number: keywords[key] }));;

        const sortedKeyObjArray = keyObj.sort(sortByNumberDescending);
        // key 값만 추출하여 keyObj 배열에 저장
        keyObj = sortedKeyObjArray.map(item => item.word);


        const runGPT = async(prompt) => {
            console.log("running...");
            const responseGPT = await openai.createChatCompletion({
                model: "gpt-3.5-turbo", 
                messages: [{ role: "user", content: prompt }],
            });
            let moreQuestions = responseGPT.data.choices[0].message.content;

            let qArr = moreQuestions.split("가능한 질문들:");
            let kWd = qArr[0].split("핵심 단어: ")[1].replace('\n', '');
            let qst = qArr[1].replace('\n', '');
            if (qst.indexOf('3. ') != -1) {
                qst = qst.split('3. ');
                qst = qst[0];
            }
            console.log(qArr);
            console.log(kWd);
            console.log(qst);

            let response = {
                tokens: tokens, 
                suggestions: suggestions, 
                keyword1: (keyObj[0] == undefined ? '' : keyObj), 
                keywordGPT: kWd, 
                moreQuestions: qst
            };
    
            console.log(response);
            console.log("done");

            res.send(JSON.stringify(response));
        }
        try {
            runGPT(sentence + "이 문장에서 가장 중요한 핵심 단어 2개를 추출해주고, 고등학생이 대학교 입학 면접에서 대답한 내용이라고 가정했을 때 추가로 나올만한 질문들을 2개 알려줘. 답변해줄 때 형식은 다음과 같이 답변해줘. \n핵심 단어: 단어1, 단어2\n가능한 질문들: \n1. 질문\n2. 질문");
        }
        catch (error) {
            console.log("GPT error" + error);

            let response = {
                tokens: tokens, 
                suggestions: suggestions, 
                keyword1: (keyObj[0] == undefined ? '' : keyObj[0]), 
                keywordGPT: '', 
                moreQuestions: ''
            };

            console.log(response);
            res.send(JSON.stringify(response));
        }
    };

    hanspell.spellCheckByDAUM(sentence, 6000, spellCheck, checkEnd, checkError);
    // hanspell.spellCheckByPNU(sentence, 6000, spellCheck, checkEnd, checkError);
});

app.post('/getCollections', (req, res) => {
    db.listCollections().then(snapshot => {
        let collectionName = [];
        snapshot.forEach(snaps => {
            console.log(snaps["_queryOptions"].collectionId);
            collectionName.push(snaps["_queryOptions"].collectionId);
        });

        let response = {
            names: collectionName
        }
        res.send(JSON.stringify(response));
    });
});


const api = functions.https.onRequest(app);

module.exports = {
    api
}