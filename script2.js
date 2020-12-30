let email=document.querySelector('#email');
let fullName=document.querySelector('#name');
let mobileNumber=document.querySelector('#phone');
let address=document.querySelector('#address');
let gender;
let password=document.querySelector('#password');
let validemail=document.querySelector('#validemail');
let validpassword=document.querySelector('#validpassword');
let submitButton=document.querySelector('.submit');
let loading_ring= document.querySelector('.loading_ring');
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


if(document.querySelector('#opt1').checked){
    gender=document.querySelector('#opt1')
}else if(document.querySelector('#opt2').checked){
    gender=document.querySelector('#opt2')
}else{
}


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

registrationChange=(event)=>{  
    event.preventDefault();
    loading()
   fetch('https://jsminnastore.herokuapp.com/auth/signup',{
       method:'post',
       headers:{
        Accept:'application/json',
           'Content-Type':'application/json'},
       body:JSON.stringify({
           fullName: fullName.value,
           email: email.value,
           mobileNumber: mobileNumber.value,
           address: address.value,
           gender: gender,
           password: password.value,
       })
   })
    .then(response=>{
        loading_ring.remove()
        return response.json();
    }
    ).then(text=>{
        if(text.success){
            document.querySelector('.feedbackreg').insertAdjacentHTML('afterbegin',text.payload.message)
            window.alert("Your Registration was Successful");
            container.reset()
    }else{
        document.querySelector('.feedbackreg').insertAdjacentHTML('afterbegin',text.payload.message)
        window.alert(text.message)
    }
}).catch (err=>{
    console.log(err)
    window.alert(`Something went wrong: ${err.status} error`)
    loading_ring.remove()
})
}