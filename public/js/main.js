const chatform = document.getElementById('chatform');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('roomname');
const userList = document.getElementById('users');
const socket = io();

const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
});

socket.emit('joinroom',{username, room})

socket.on('roomUsers',({room, users})=>{
    outputRoomName(room);
    outputUsers(users);
}) 

socket.on('message', message =>{
    console.log(message);
    displayMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatform.addEventListener('submit',(e)=>{
    e.preventDefault();

    const message = e.target.elements.message.value;
    console.log(message);

    socket.emit('chatmsg',message)

    e.target.elements.message.value =''
    e.target.elements.message.focus();

})

function displayMessage(msg){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${msg.username}<span>${msg.time}</span></p>
    <p class="text">
    ${msg.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div)
}

function outputRoomName(room){
    roomName.innerText = room;
}

function outputUsers(users){
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`
}