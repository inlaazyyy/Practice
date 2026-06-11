let express = require('express')
let axios = require('axios')
require('dotenv').config()

let app = express()
let PORT = process.env.PORT || 8000

app.use(express.static('public'))

app.get('/api/news', function(req, res) {
    let word = req.query.q
    
    if (!word) {
        res.send('Напишите что-нибудь')
        return
    }
    
    axios.get('https://newsapi.org/v2/everything', {
        params: {
            q: word,
            apiKey: process.env.NEWS_API_KEY,
            pageSize: 10
        }
    }).then(function(result) {
        res.send(result.data.articles)
    }).catch(function() {
        res.send('Ошибка загрузки. Проверьте интернет или попробуйте позже')
    })
})

app.listen(PORT, function() {
    console.log('Сервер на порту ' + PORT)
})