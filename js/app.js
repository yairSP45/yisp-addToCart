const cards = document.getElementById('cards')
const items = document.getElementById('items')
const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()

//Variable Global
let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})

const fetchData = async () => {
    const response = await fetch('./api/products.json')
    const products = await response.json()
    console.log('@@@@@ products => ', products)
    drawCards(products)
}

const drawCards = (products) => {
    products.forEach((item) => {
        templateCard.querySelector('h5').textContent = item.title
        templateCard.querySelector('p').textContent = item.price
        templateCard.querySelector('button').dataset.id = item.id
        templateCard.querySelector('img').setAttribute('src', item.urlImage)
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}