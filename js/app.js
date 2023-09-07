const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateCarrito = document.getElementById('template-carrito').content
const templateFooter = document.getElementById('template-footer').content
const fragment = document.createDocumentFragment()

//Variable Global
let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if(localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

cards.addEventListener('click', (e) => {
    addCarrito(e)
})

items.addEventListener('click', (e) => {
    actionsAddDelete(e)
})

const actionsAddDelete = (e) => {
    if(e.target.classList.contains('btn-warning')) {
        const product = carrito[e.target.dataset.id]
        console.log('@@@@ issues => ', product)
        product.cantidad++
        carrito[e.target.dataset.id] = {...product}
        pintarCarrito()
    }
    if(e.target.classList.contains('btn-danger')) {
        const product = carrito[e.target.dataset.id]
        console.log('@@@@ issues => ', product)
        product.cantidad--
        if(product.cantidad == 0) {
            delete carrito[e.target.dataset.id]
        }
        else {
            carrito[e.target.dataset.id] = {...product}
        }
        pintarCarrito()
    }

    e.stopPropagation()
}

const addCarrito = (e) => {
    //console.log('@@@ evennt =>', e)
    if(e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    }
    e.preventDefault()
    e.stopPropagation()
}

const setCarrito = item => {
    const aux = {
        title: item.querySelector('h5').textContent,
        precio: item.querySelector('p').textContent,
        id: item.querySelector('button').dataset.id,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(aux.id)){
        aux.cantidad = carrito[aux.id].cantidad + 1
    }

    carrito[aux.id] = { ...aux }
    pintarCarrito()
    console.log('@@@ compras => ', carrito)
}

const fetchData = async () => {
    const response = await fetch('./api/products.json')
    const products = await response.json()
    console.log('@@@@@ products => ', products)
    drawCards(products)
}

const pintarCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach((item) => {
        
        templateCarrito.querySelector('th').textContent = item.id
        templateCarrito.querySelectorAll('td')[0].textContent = item.title
        templateCarrito.querySelectorAll('td')[1].textContent = item.cantidad
        templateCarrito.querySelector('span').textContent = item.cantidad * item.precio
        templateCarrito.querySelector('.btn-warning').dataset.id = item.id
        templateCarrito.querySelector('.btn-danger').dataset.id = item.id
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    drawFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const drawFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0) {
        footer.innerHTML = ` 
        <th colspan="5" scope="row" class="text-center">
            Carrito Vacio. Agrega productos
        </th>
        `
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nTotal = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + (cantidad * precio), 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nTotal
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })

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