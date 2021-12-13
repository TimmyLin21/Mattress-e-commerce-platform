// 取得和渲染產品列表
const productList=document.querySelector('.productWrap')
let allProductData;
function getProductList(){
  axios.get('https://livejs-api.hexschool.io/api/livejs/v1/customer/tim/products')
    .then(res=>{
      allProductData=res.data.products;
      renderProductList(allProductData)
      filterProductList()
    })
}
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
  // 購物車按鈕監聽
  productList.addEventListener('click',(e)=>{
    if(e.target.nodeName=='A'){
      e.preventDefault();
      let id=e.target.getAttribute('data-id');
      addToCart(id);
    }
  })
}
// 過濾產品列表
const productSelect=document.querySelector('.productSelect');
function filterProductList(){
  productSelect.addEventListener('change',()=>{
    let filterData;
    switch (productSelect.value) {
      case "全部":
        renderProductList(allProductData);
        break;
      case "床架":
        filterData=allProductData.filter(data=>data.category=='床架')
        renderProductList(filterData);
        break;
      case "收納":
        filterData=allProductData.filter(data=>data.category=='收納')
        renderProductList(filterData);
        break;
      case "窗簾":
        filterData=allProductData.filter(data=>data.category=='窗簾')
        renderProductList(filterData);
        break;
    }
  })
}

// 加入購物車
function addToCart(id){
  let quantity=1;
  cartData.carts.forEach(data=>{
    if(data.product.id==id){
      quantity=data.quantity+1
    }
  })
  axios.post('https://livejs-api.hexschool.io/api/livejs/v1/customer/tim/carts',{
    "data":{
      'productId':id,
      'quantity':quantity
    }
  }).then(res=>{
    getCartList()
  }).catch(err=>{
    console.log(err.response)
  })
}

// 渲染購物車選單
let cartData;
function getCartList(){
  axios.get('https://livejs-api.hexschool.io/api/livejs/v1/customer/tim/carts')
    .then(res=>{
      cartData=res.data
      renderCartList()
    })
    .catch(err=>{
      console.log(err.response);
    })
}
const cartList=document.querySelector('.shoppingCart-table')
function renderCartList(){
  if(cartData.carts.length!=0){
    let str=`<tr>
      <th width="40%">品項</th>
      <th width="15%">單價</th>
      <th width="15%">數量</th>
      <th width="15%">金額</th>
      <th width="15%"></th>
    </tr>`
    cartData.carts.forEach(data=>{
      str+=`
      <tr>
          <td>
              <div class="cardItem-title">
                  <img src=${data.product.images} alt="">
                  <p>${data.product.title}</p>
              </div>
          </td>
          <td>${data.product.price}</td>
          <td>${data.quantity}</td>
          <td>NT$${data.product.price}</td>
          <td class="btnGroup">
              <a href="#" class="material-icons editItemBtn" data-id=${data.id} data-num=${data.quantity}>
                  edit
              </a>            
              <a href="#" class="material-icons deleteItemBtn" data-id=${data.id}>
                  clear
              </a>
          </td>
      </tr>`
    })
    str+=`
    <tr>
      <td>
          <a href="#" class="discardAllBtn">刪除所有品項</a>
      </td>
      <td></td>
      <td></td>
      <td>
          <p>總金額</p>
      </td>
      <td>NT$${cartData.finalTotal}</td>
    </tr>  
    `
    cartList.innerHTML=str
    // 修改按鈕監聽
    const editBtns=document.querySelectorAll('.editItemBtn');
    editBtns.forEach(btn=>{
      btn.addEventListener('click',(e)=>{
        editId = e.target.getAttribute('data-id')
        editNum.value=e.target.getAttribute('data-num')
        editModal.classList.add('active')
      })
    })
    // 刪除按鈕監聽
    const deleteItemBtns=document.querySelectorAll('.deleteItemBtn');
    deleteItemBtns.forEach(btn=>{
      btn.addEventListener('click',(e)=>{
        e.preventDefault();
        let id = e.target.getAttribute('data-id')
        deleteItem(id);
      })
    })
    // 刪除全部按鈕監聽
    const deleteAllBtn=document.querySelector('.discardAllBtn')
    deleteAllBtn.addEventListener('click',(e)=>{
      deleteModal.classList.add('active')
    })
  }else{
    cartList.innerHTML='<p class="text-muted">購物車內還沒有商品喔！</p>'
  }
}
// 編輯購物車
function editItem(id,num){
  axios.patch('https://livejs-api.hexschool.io/api/livejs/v1/customer/tim/carts',{
    "data":{
      "id":id,
      "quantity":num
    }
  }).then(res=>{
    getCartList()
    cartList.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }).catch(err=>{
    console.log(err.response);
  })
}
// Modal監聽
// delModal
const deleteModal=document.querySelector('#deleteModal')
const delConfirmBtn=document.querySelector('#deleteModal .confirmBtn')
const delCloseBtn=document.querySelector('#deleteModal .closeBtn')
delConfirmBtn.addEventListener('click',(e)=>{
  alert('刪除成功')
  deleteAll();
  deleteModal.classList.remove('active')
})
delCloseBtn.addEventListener('click',(e)=>{
  e.preventDefault()
  deleteModal.classList.remove('active')
})
// editModal
const editModal=document.querySelector('#editModal')
const editConfirmBtn=document.querySelector('#editModal .confirmBtn')
const editCloseBtn=document.querySelector('#editModal .closeBtn')
const editNum=document.querySelector('#editNum')
let editId;
editCloseBtn.addEventListener('click',(e)=>{
  e.preventDefault()
  editModal.classList.remove('active')
})
editConfirmBtn.addEventListener('click',function edit(){
  let num=+editNum.value
  editItem(editId,num)
  editModal.classList.remove('active')
})
// 刪除單個項目
function deleteItem(id){
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/tim/carts/${id}`)
    .then(res=>{
      getCartList()
    }).catch(err=>{
      console.log(err.response);
    })
}
// 刪除全部項目
function deleteAll(){
  axios.delete('https://livejs-api.hexschool.io/api/livejs/v1/customer/tim/carts')
    .then(res=>{
      getCartList()
      cartList.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }).catch(err=>{
      console.log(err.response);
    })
}

// Validate
const constraints = {
  姓名:{
    presence:{message:"^必填"},
  },
  電話:{
    presence:{message:"^必填"},
    format: {
      pattern: '[0-9]+',
      message:'^只能輸入數字'
    },
    length:{
      minimum:10,
      maximum:12,
      tooShort:'^長度必須介於10~12',
      tooLong:'^長度必須介於10~12',
    }
  },
  Email:{
    presence:{message:"^必填"},
    email:{message:'^必須是有效的Email'}
  },
  寄送地址:{
    presence:{message:"^必填"},
  },
}
let errors
const form=document.querySelector('.orderInfo-form')
const inputs=document.querySelectorAll('.orderInfo-input')
const messages=document.querySelectorAll('.orderInfo-message')
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
  //input監聽
inputs.forEach(input=>{
  input.addEventListener('change',()=>{
    messages.forEach(message=>{
      message.textContent=''
    })
    formValidate();
  })
})
// 送出表單
const submitBtn=document.querySelector('.orderInfo-btn')
submitBtn.addEventListener('click',(e)=>{
  e.preventDefault();
  formValidate()
  if(!errors){
    postOrder();
  }
})
function postOrder(){
  axios.post('https://livejs-api.hexschool.io/api/livejs/v1/customer/tim/orders',{
    "data": {
      "user": {
        "name": inputs[0].value,
        "tel": inputs[1].value,
        "email": inputs[2].value,
        "address": inputs[3].value,
        "payment": inputs[4].value
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
// 初始狀態
function init(){
  getProductList()
  getCartList()
}
init()