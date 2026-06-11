let searchInput = document.getElementById('searchInput')
let searchBtn = document.getElementById('searchBtn')
let savedDiv = document.getElementById('savedDiv')
let results = document.getElementById('results')

let savedNews = []

//загрузка изб
let temporary = localStorage.getItem('myFavorites')
if (temporary) {
    savedNews = JSON.parse(temporary)
    for (let i = 0; i < savedNews.length; i++) {
        let n = savedNews[i]
        savedDiv.innerHTML = savedDiv.innerHTML + '<div class="article">  <h3>'+n.title+'</h3>  <p>'+(n.description || '')+'</p>  </div>'
    }
}

//поиск
searchBtn.addEventListener('click', () => {
    let query = searchInput.value
    
    //если стрка поиска пустая
    if (query.trim() === '') {
        results.innerHTML = '<div class="error">Введите слово для поиска</div>'
        return
    }
    
    fetch('/api/news?q=' + query)
        .then(function(res) {
            return res.json()
        })
        .then(function(articles) {
            results.innerHTML = ''
            
            //если новостей нету
            if (!articles || articles.length === 0) {
                results.innerHTML = '<div class="error">Ничего не найдено</div>'
                return
            }
            
            window.allArticles = articles
            for (let i = 0; i < articles.length; i++) {
                let a = articles[i]
                results.innerHTML = results.innerHTML + '<div class="article">  <h3>'+a.title+'</h3>  <p>'+(a.description || '')+'</p>  <button onclick="save(' + i + ')">В избранное</button>  </div>'
            }
        })
        .catch(function(error) {
            //ошибка
            results.innerHTML = '<div class="error">Ошибка загрузки. Проверьте интернет или попробуйте позже</div>'
        })
})

//сохр
function save(index) {
    let news = window.allArticles[index]
    
    //проверка
    let alreadySaved = false
    for (let i = 0; i < savedNews.length; i++) {
        if (savedNews[i].title === news.title) {
            alreadySaved = true
            break
        }
    }
    
    if (alreadySaved) {
        alert('Эта новость уже добавлена в избранное')
        return
    }
    
    //добавление
    savedNews.push(news)
    localStorage.setItem('myFavorites', JSON.stringify(savedNews))
    savedDiv.innerHTML = savedDiv.innerHTML + '<div class="article">  <h3>'+news.title+'</h3>  <p>'+(news.description || '')+'</p>  </div>'
    alert('Сохранено')
}