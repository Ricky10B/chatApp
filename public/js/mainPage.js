const iconoMeGusta = document.querySelector('.iconoMeGusta')
const like = document.querySelector('.meGusta')
const noLike = document.querySelector('.meGustaNo')
const counts = document.querySelector('.countLikes')

EventListeners()

function EventListeners(){
    iconoMeGusta.addEventListener('click', async () =>{
        if(iconoMeGusta.firstElementChild.classList.contains('meGusta') && iconoMeGusta.firstElementChild.classList.contains('d-inline-block')){
            iconoMeGusta.innerHTML = '<i class="far fa-thumbs-up fa-lg meGustaNo"></i>'
        }else{
            iconoMeGusta.innerHTML = '<i class="fas fa-thumbs-up fa-lg text-primary meGusta d-inline-block"></i>'
        }

        data = {
            token: JSON.parse(localStorage.getItem('token'))[0]
        }

        await fetch('/like', {
            method: 'POST',
            mode: 'same-origin',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
        .then(res => {
            counts.textContent = res.message
        })
        .catch(err => console.log(err))
    })

}