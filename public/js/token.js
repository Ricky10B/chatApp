let token = document.getElementById('aToken').getAttribute('data-token')

let tokens = JSON.parse(localStorage.getItem('token')) || []

if(tokens !== []){
    if(token !== tokens[0]){
        tokens.push(token)
        localStorage.setItem('token', JSON.stringify(tokens))
    }
}else{
    localStorage.setItem('token', JSON.stringify(tokens))
}