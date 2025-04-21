const express = require('express')
const app = express()
const port = 3000
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('layout', { content: 'content_section.ejs' })
})

app.get('/404', (req, res) => {
    res.status(404).render('layout', { content: '404.ejs' })
})

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Server running at http://127.0.0.1:${port}`))