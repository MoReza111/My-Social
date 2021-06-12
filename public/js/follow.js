const usernames = document.querySelectorAll('#username_to_follow')

usernames.forEach(user => {
    user.addEventListener('click',(e)=>{
        e.preventDefault()
        if(user.innerText === "Follow"){
            user.innerText = "Unfollow"
            const set = user.value.split(' ')
            socket.emit('follow',{follower_id:set[1], following_id:set[0]})
        }else{
            user.innerText = "Follow"
            const set = user.value.split(' ')
            socket.emit('unfollow',{follower_id:set[1], following_id:set[0]})
        }
    })
})
