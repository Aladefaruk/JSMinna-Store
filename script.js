let email=document.querySelector('#email');

let password=document.querySelector('#password');
let validemail=document.querySelector('#validemail');
let validpassword=document.querySelector('#validpassword');
let submitButton=document.querySelector('.submit');
let container=document.querySelector('#container');
let itemName=document.querySelector('#itemname');
let itemDescription=document.querySelector('#description');
let reason=document.querySelector('#reason');
let category=document.querySelector('#category');
let loading_ring= document.querySelector('.loading_ring');
let searchCategoryinput=document.querySelector('#inputSearch');
let toggleButton= document.querySelector('.toggles-button');
let mobileNav= document.querySelector('.mobile-nav');
let backdrop= document.querySelector('.backdrop'); 

toggleButton.addEventListener('click',  ()=>{
    if(mobileNav.style.display==='block') {
        mobileNav.style.display='none';
        backdrop.style.display='none'
        toggleButton.src='images/icon-hamburger.svg'
    }else{
        mobileNav.style.display='block';
        backdrop.style.display='block'
        toggleButton.src='images/icon-close.svg'
    }
})



const alphaOnly=  (event) =>{
    var key= event.keyCode;
    return ((key>=65) || key ==8);
}


const passwordCheck=()=>{
    if(password.value===con_password.value){
       span.innerHTML='(&#10004 Passwords Match)';
       span.style.color='green'
       return true
    }else{
        span.innerHTML='(&#10008 Passwords Do Not Match)';
        span.style.color='red'
        return false
    }
}

const passwordLen=()=>{
    if(password.value.length<8){
        validpassword.innerHTML="(Password Must Be 8-Characters Long)"
        validpassword.style.color='grey'
        submitButton.disabled=true;
        return false
    }else{
        validpassword.innerHTML=""
        return true
}
}

const validEmail=()=>{
    let mailformat= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(email.value.match(mailformat)){
        validemail.innerHTML="&#10004";
        validemail.style.color='grey'
        return true
    }else{
        validemail.innerHTML="(&#10008 Email is not valid)";
        validemail.style.color='grey'
        submitButton.disabled=true;
        return false
    }
}

const enableButton=()=>{
    if(passwordCheck() && passwordLen()&& validEmail()){
        submitButton.disabled=false;
    }
}

const loginenableButton=()=>{
    if(passwordLen()&& validEmail()){
        submitButton.disabled=false;
    }
}



const loading=()=>{
    loading_ring.style.display='inline-block'
}
let showData=(data)=>{
    localStorage.setItem('token',JSON.stringify(data))
}



loginChange=(event)=>{  
    event.preventDefault();
    loading()

   fetch('https://jsminnastore.herokuapp.com/auth/login/',{
       method:'post',
       headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'},
       body:JSON.stringify({
           email: email.value,
           password: password.value,
       })
   })
    .then(response=>{
        loading_ring.remove()
    return response.json()}
    )
    .then(text=>{
        showData(text.payload)
        console.log(personObj)
          
        if(!text.success){
        document.querySelector('.notification').insertAdjacentHTML('afterbegin',text.message)
        container.reset()
    }else{
        window.location.replace("home.html")
    } 
     })
}


loadAllsuggestion=()=>{
    fetch('https://jsminnastore.herokuapp.com/suggested',{
    method:'get',
    headers:{
        'Accept':'application/json',
        'Content-Type':'application/json',
        'Authorization': `Bearer ${personObj.token}`
    }    
    
})
.then(response=>{
    if (response.ok){
    return response.json();
} else {
    return Promise.reject(response);
}
}).then(data=>{
    console.log(data);
    const Suggestions= data.payload.result.map(suggestion=>{
        return `
        <div class='card'>
        <p>Item Name: ${suggestion.itemName}</p>
        <p>Item Category: ${suggestion.itemCategory}</p>
        <p>Item Description: ${suggestion.itemDescription}</p>
        <p>Reason: ${suggestion.reason}</p>
        </div>`;
    }).join('')
    document.querySelector('.suggestContainer').insertAdjacentHTML('afterbegin',Suggestions)
}).catch (err=>{
    console.log(err)

})
}




searchbyCategory=()=>{
    loading()
    let categorySearch=searchCategoryinput.value;
    fetch(`https://jsminnastore.herokuapp.com/suggested/${categorySearch}`,{
        method:'get',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization': `Bearer ${personObj.token}`
        }    
        
    })
    .then(response=>{
        loading_ring.remove()
        if (response.ok){
        return response.json();
    } else {
        return Promise.reject(response);
    }
    }).then(data=>{
        console.log(data);
        const Suggestions= data.payload.result.map(suggestion=>{
            return `
            <div class='card'>
            <p>Item Name: ${suggestion.itemName}</p>
            <p>Item Category: ${suggestion.itemCategory}</p>
            <p>Item Description: ${suggestion.itemDescription}</p>
            <p>Reason: ${suggestion.reason}</p>
            </div>`;
        }).join('')
        document.querySelector('.suggestContainer').remove()
        document.querySelector('.suggestContainer1').insertAdjacentHTML('afterbegin',Suggestions)
    }).catch (err=>{
        console.log(err)
        window.alert(`Something went wrong: ${err.status} error`)
        let errr= `<h1 class='error'> Something went wrong:  ${err.status} error</h1>`
        document.querySelector('.suggestContainer').insertAdjacentHTML('afterbegin',errr)
    })

}

loadWelcome=()=>{
    document.querySelector('.welcomemsg').insertAdjacentHTML('afterbegin',`Welcome ${personObj.fullName}`)
}

let personObj= JSON.parse(localStorage.getItem('token'));


let x= document.querySelector('#category');

addItem=(event)=>{
    event.preventDefault();
    loading()
   fetch('https://jsminnastore.herokuapp.com/suggest',{
        method:'post',
        mode: 'cors',
        headers:{
            Accept:'application/json',
            'Content-Type':'application/json',
            'Authorization': `Bearer ${personObj.token}`
        },    
        body:JSON.stringify({
           itemName: itemName.value,
           itemDescription: itemDescription.value,
           itemCategory: x.value,
           reason: reason.value
       })
   })
    .then(response=>{
        loading_ring.remove()
        return response.json()
    
}
    )
    .then(text=>{
        if(text.success){
            document.querySelector('.feedback').insertAdjacentHTML('afterbegin',text.payload.message)
        }else{
            document.querySelector('.feedback').insertAdjacentHTML('afterbegin',text.payload.message)
        } 
        console.log(text)
        console.log(personObj)
    }).catch (err=>{
        console.log(err)
        document.querySelector('.load').remove()
        let errr= `<h1 class='error'> Something went wrong:  ${err.status} error</h1>`
        document.querySelector('#app').insertAdjacentHTML('afterbegin',errr)
    })
}












