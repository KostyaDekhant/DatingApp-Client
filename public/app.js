const IP = "https://45.12.255.26";//localhost
const PORT = "8081"

async function fetchWithAuth(url, options = {}) {
    const response = await fetch(url, options);
    if (response.status === 401) {
        window.location.href = "/";
        return; // чтобы дальше не обрабатывалось
    }
    return response;
}

async function auth() {
    const login = document.getElementById('username').value; 
    const password = document.getElementById('password').value; 

    try{
        const response = await fetch(IP+":"+PORT+"/auth/login",{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({login, password})
        });

        if(!response.ok){
            alert("Неверный логин или пароль!");
            return;
        }

        const result = await response.json();

        localStorage.setItem('token', result.token);
        localStorage.setItem('refreshToken', result.refreshToken);
        localStorage.setItem('userId', result.userId);

        window.location.href = `/id${result.userId}`;//profile.html
        
        console.log("Server response: ", result);
    }
    catch(error){
        console.error("Auth error: ", error);
    }
    
}

function dataParser(timestamp){
    const currentDate = new Date();
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.getMonth();
    const year = date.getFullYear();

    const hour = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    let months = ["янв", "фев", "мар","апр","мая","июн",
                "июл","авг","сен","окт","ноя","дек"];

    let res = ``

    if(year == currentDate.getFullYear() &&
        month == currentDate.getMonth() && 
        (day == currentDate.getDay()-1 || 
        (currentDate.getDay() == 1 && day == new Date(year, currentDate.getMonth()-1, 0))))
        res = `вчера в ${hour}:${minutes}`
    else if (year != currentDate.getFullYear())
        res = `${day} ${months[month]} ${year} в ${hour}:${minutes}`
    else
        res = `${day} ${months[month]} в ${hour}:${minutes}`

    return res;
}

function birthParser(birth){
    const date = new Date(birth);

    const day = date.getDate().toString().padStart(2, "0");
    const month = date.getMonth();
    const year = date.getFullYear();

    let months = ["янв", "фев", "мар","апр","мая","июн",
                "июл","авг","сен","окт","ноя","дек"];

    let res = `${day} ${months[month]} ${year}`


    return res;
}

function getAge(birth){
    const today = new Date();
    const date = new Date(birth);

    let age = today.getFullYear() - date.getFullYear();

    const m = today.getMonth() - date.getMonth();
    const d = today.getDay() - date.getDay();

    if(m < 0 || (m === 0 && d < 0))
        age--;
    return age;
}

async function loadImage(userId) {
    try{
        const token = localStorage.getItem('token');
        const response = await fetch(IP+":"+PORT+"/api/users/"+userId+"/images?limit=1", {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if(!response.ok) throw new Error("Ошибка загрузки изображения");
        const data = await response.json();
        const byteArray = data[0];
        const base64Img = byteArray[2];

        const img = "data:image/jpeg;base64,"+base64Img;
        
        document.getElementById('photo').src = img;
    }
    catch(error){
        console.error("Ошибка: ", error);
    }
    
}