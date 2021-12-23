# Mattress e-commerce platform

## Table of contents
- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

Index
- Add products to the cart
- Filter products based on the categories
- Edit number of item in the cart
- Delete single item from the cart
- Delete all of the items from the cart
- Inputs validation
- Submit order to the database

Admin panel
- See all of the order from the database
- See pie chart of revenue ratio based on different items
- See pie chart of revenue ratio based on different categories
- Filter chart based on the categories
- Delete single order from the order list
- Delete all of the orders from the order list
- Change status of each order

### Links

- [Index](https://timmylin21.github.io/JS-FinalProject/)
- [Admin](https://timmylin21.github.io/JS-FinalProject/admin.html)

## My process

### Built with

- The vanilla js
- RESTful api
- C3
- Validate.js

### What I learned
It's better to seperate rendering function and adding event listener function, because you might have high chance to re-add the same event listener.
```js
function renderProductList(data){
  let str='';
  data.forEach(data=>{
    str+=`<li class="productCard">
    <h4 class="productType">新品</h4>
    <img src="${data.images}" alt="">
    <a href="#" class="addCardBtn" data-id="${data.id}">加入購物車</a>
    <h3>${data.title}</h3>
    <del class="originPrice">NT$${data.origin_price}</del>
    <p class="nowPrice">NT$${data.price}</p>
</li>`
  })
  productList.innerHTML=str
}

function addProductListEvent() {
  productList.addEventListener('click',(e)=>{
    if(e.target.nodeName=='A'){
      e.preventDefault();
      let id=e.target.getAttribute('data-id');
      addToCart(id);
    }
  })
}
```
Set submit button disabled before user passing validation
```js
function formValidate(){
  errors=validate(form,constraints);
  if(errors){
    Object.keys(errors).forEach(key=>{
      document.querySelector(`p[data-message=${key}]`).textContent=errors[key]
    })
    // submit control
    submitBtn.classList.add('disabledInput')
  }else{
    submitBtn.classList.remove('disabledInput')
  }
}
```
Remember using trim method to each input values before submitting your form
```js
function postOrder(){
  axios.post(`${api}orders`,{
    "data": {
      "user": {
        "name": inputs[0].value.trim(),
        "tel": inputs[1].value.trim(),
        "email": inputs[2].value.trim(),
        "address": inputs[3].value.trim(),
        "payment": inputs[4].value.trim(),
      }
    }    
  }).then(res=>{
    alert('訂單送出成功！')
    getCartList()
    inputs.forEach((input,i)=>{
      if(i!==4){
        input.value=""
      }
    })
  }).catch(err=>{
    console.log(err.response);
  })
}
```
Sort method with compare function can arrange array in ascending order or descending order.
```js
function compare(a,b){
  const numA=a[1]
  const numB=b[1]
  let comparison=0;
  if(numA>numB){
    comparison=-1;
  }else if(numA<numB){
    comparison=1;
  }
  return comparison;
}
itemArr.sort(compare);
```


### Continued development

In the next project, I would like to give ESLint-airbnb and Tailwind a shot. Because ESLint will help my code more consistent and avoiding bugs. Also, according to state-of-css, Tailwind is getting popular recently. Therefore, getting familiar with it might be helpful for me in the near future. 

### Useful resources

- [常用的陣列處理方法](https://hackmd.io/nJECTHpxQdu0FzJ_i8hzFg) - This reminds me of a lot of common and handy array methods.

## Author

- FrontEnd - HungJeng Lin
- UI Design - [HexSchool](https://www.hexschool.com/courses/js-training.html)
- BackEnd - [HexSchool](https://hexschool.github.io/hexschoolliveswagger/)
