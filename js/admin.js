// C3.js
function renderChart(){
  getItemNum();
  let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
        type: "pie",
        columns: itemArr,
        colors: colorObj,
    },
  });
}
// 整理品項數量
let itemObj={};
let itemArr=[];
let colorObj={};
function getItemNum(){
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
  // colorObj
  let color=['#1f77b4','#9D7FEA','#5434A7','#301E5F']
  itemArr.forEach((item,i)=>{
    colorObj[`${item[0]}`]=color[i]
  })
}

const UID='1UyE6yvoyzfP3B87geEOWqv0VuI3'
// 取得訂單列表
let orderData
function getOrderList(){
  axios.get('https://livejs-api.hexschool.io/api/livejs/v1/admin/tim/orders',
    {
      headers:{
        'authorization': UID
      }
    }
  ).then(res=>{
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
      <td>2021/03/08</td>
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
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/tim/orders/${id}`,
    {
      headers:{
        'authorization': UID
      }
    }  
  ).then(res=>{
    getOrderList()
  }).catch(err=>{
    console.log(err.response);
  })
}
// 刪除全部訂單
const delAllBtn=document.querySelector('.discardAllBtn')
delAllBtn.addEventListener('click',(e)=>{
  e.preventDefault();
  deleteAll()
})
function deleteAll(){
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/tim/orders`,
    {
      headers:{
        'authorization': UID
      }
    }  
  ).then(res=>{
    getOrderList()
  }).catch(err=>{
    console.log(err.response);
  })  
}

// 修改訂單
function editOrder(id,status){
  status=status=='未處理'?true:false;
  axios.put('https://livejs-api.hexschool.io/api/livejs/v1/admin/tim/orders',
    {
      "data":{
        'id':id,
        'paid':status
      }
    },
    {
      headers:{
        'authorization': UID
      }
    } 
  ).then(res=>{
    getOrderList()
  }).catch(err=>{
    console.log(err.response);
  }) 
}
// 初始化
function init(){
  getOrderList()
}
init()