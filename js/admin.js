// 圖表選擇
const chartSelect = document.querySelector('.chartSelect');
const chartTitle = document.querySelector('.section-title');
chartSelect.addEventListener('change',renderChart);
// C3.js
function renderChart(){
  if(chartSelect.value === 'product'){
    getItemNum();
    let chart = c3.generate({
      bindto: '#chart', // HTML 元素綁定
      data: {
          type: "pie",
          columns: itemArr,
      },
      color:{
        pattern:['#1f77b4','#9D7FEA','#5434A7','#301E5F']
      }
    });
    chartTitle.textContent = '全品項營收比重';
  } else {
    getCateArr();
    let chart = c3.generate({
      bindto: '#chart', // HTML 元素綁定
      data: {
          type: "pie",
          columns: cateArr,
      },
      color:{
        pattern:['#fbbf24','#fb923c','#f87171']
      }
    });
    chartTitle.textContent = '全產品類別營收比重';
  }
}
// 整理品項數量
let itemObj={};
let itemArr=[];
function getItemNum(){
  itemObj={};
  itemArr=[];
  orderData.forEach(order=>{
    order.products.forEach(item=>{
      if(!itemObj[`${item.title}`]){
        itemObj[`${item.title}`]=1
      }else{
        itemObj[`${item.title}`]+=1
      }
    })
  })
  // 建立itemArr [item,num]
  let keys=Object.keys(itemObj);
  keys.forEach(key=>{
    itemArr.push([key,itemObj[key]])
  })
  // 排序
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
  let arr=[];
  let num=0;
  itemArr.forEach((item,i)=>{
    if(i<4){
      arr.push(item)
    }else{
      num+=item[1]
      arr[3]=['其他',num]
    }
  })
  itemArr=arr
}

let cateObj = 
{
  床架: 0,
  收納: 0,
  窗簾: 0,
};
let cateArr = [];
function getCateArr() {
  if(cateArr.length === 0){
    orderData.forEach((order) => {
      order.products.forEach((product) => {
        cateObj[product.category] += product.quantity
      })
    })
    let keys = Object.keys(cateObj);
    keys.forEach((key) => {
      cateArr.push([key,cateObj[key]])
    })
  }
}
// API
const UID = '1UyE6yvoyzfP3B87geEOWqv0VuI3'
const header = 
{
  headers:{
    'authorization': UID
  }
};
const api = 'https://livejs-api.hexschool.io/api/livejs/v1/admin/tim/orders'  
// 取得訂單列表
let orderData
function getOrderList(){
  axios.get(api, header)
  .then(res=>{
    orderData=res.data.orders
    renderOrderList()
    renderChart()
  }).catch(err=>{
    console.log(err.response);
  })
}
// 渲染訂單料表
const orderList=document.querySelector('.orderPage-table')
function renderOrderList(){
  let str=`
  <thead>
    <tr>
        <th>訂單編號</th>
        <th>聯絡人</th>
        <th>聯絡地址</th>
        <th>電子郵件</th>
        <th>訂單品項</th>
        <th>訂單日期</th>
        <th>訂單狀態</th>
        <th>操作</th>
    </tr>
  </thead>  
  `
  orderData.forEach(data=>{
    let status=data.paid?'已處理':'未處理';
    let title="";
    let time=(new Date(data.createdAt*1000)).toLocaleDateString()
    data.products.forEach(item=>{
      title+=`<p>${item.title}</p>`
    })
    str+=`
    <tr>
      <td>${data.createdAt}</td>
      <td>
        <p>${data.user.name}</p>
        <p>${data.user.tel}</p>
      </td>
      <td>${data.user.address}</td>
      <td>${data.user.email}</td>
      <td>
        ${title}
      </td>
      <td>${time}</td>
      <td class="orderStatus">
        <a href="#" class='editLink' data-id=${data.id}>${status}</a>
      </td>
      <td>
        <input type="button" class="delSingleOrder-Btn" value="刪除" data-id=${data.id}>
      </td>
    </tr>      
    `
  })
  orderList.innerHTML=str;
  // 監聽刪除項目
  const deleteBtns=document.querySelectorAll('.delSingleOrder-Btn')
  deleteBtns.forEach(btn=>{
    btn.addEventListener('click',()=>{
      let id=btn.getAttribute('data-id')
      deleteOrder(id);
    })
  })
  // 監聽修改選項
  const editLinks=document.querySelectorAll('.editLink')
  editLinks.forEach(link=>{
    link.addEventListener('click',(e)=>{
      e.preventDefault();
      let id=link.getAttribute('data-id')
      let status=link.textContent
      editOrder(id,status);
    })
  })
}

// 刪除訂單
function deleteOrder(id){
  axios.delete(`api/${id}`, header)
  .then(res=>{
    orderData=res.data.orders
    renderOrderList()
    renderChart()
    alert('刪除成功！')
  }).catch(err=>{
    console.log(err.response);
  })
}
// 刪除全部訂單
const delAllBtn=document.querySelector('.discardAllBtn')
delAllBtn.addEventListener('click',(e)=>{
  e.preventDefault();
  deleteModal.classList.add('active');
})
function deleteAll(){
  axios.delete( api, header) 
  .then(res=>{
    orderData=res.data.orders
    renderOrderList()
    renderChart()
    alert('刪除成功！')
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
  deleteAll();
  deleteModal.classList.remove('active')
})
delCloseBtn.addEventListener('click',(e)=>{
  e.preventDefault()
  deleteModal.classList.remove('active')
})

// 修改訂單
function editOrder(id,status){
  status=status=='未處理'?true:false;
  axios.put( api ,
    {
      "data":{
        'id':id,
        'paid':status
      }
    }, header)
  .then(res=>{
    orderData=res.data.orders
    renderOrderList()
    renderChart()
    alert('修改成功！')
  }).catch(err=>{
    console.log(err.response);
  }) 
}
// 初始化
function init(){
  getOrderList()
}
init()