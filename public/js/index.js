const opens = document.querySelector('#open')
const modalContainer = document.querySelector('#modal-container')
const closes = document.querySelector('#close')
const inputFile = document.querySelector('#input-file')
const previewImg = document.querySelector('#preview-img')

opens.addEventListener('click',()=>{
    modalContainer.classList.add('show')
})

closes.addEventListener('click',()=>{
    modalContainer.classList.remove('show')
})


const previewFile = (input)=>{
    const file = inputFile.get(0).files[0]

    if(file){
      const reader = new FileReader();

      reader.onload = function(){
          previewImg.attr("src", reader.result);
      }

      reader.readAsDataURL(file);
    }
}