const opens = document.querySelector('#open')
const modalContainer = document.querySelector('#modal-container')
const closes = document.querySelector('#close')

opens.addEventListener('click',()=>{
    modalContainer.classList.add('show')
})

closes.addEventListener('click',()=>{
    modalContainer.classList.remove('show')
})