let url = "http://localhost:1337/products/";
let productsList = [];

let productsShow = $("#productsShow");
let productsShowCart =$("#productsShowCart");
let productsShow1 =$("productsShow1");


$.get(url)
     .done(function (data){
        sessionStorage.removeItem("reShoppingCart");
        if (Array.isArray(data) && data.length > 0 && productsList.length === 0){
            console.log(productsList.length);
            for (let i in data) {
                if (data[i].name !== null){
                    data[i].InStock = Math.floor((Math.random()*10)+1);
                    productsList.push(data[i]);
                }
            }
            showProduct();
        }else
        console.log("Data not found");
     })
     .fail(function (error) {console.log("Error found!",error)});


function showProduct() {
    productsShow.html("");
    for (let j in productsList)
        productsRender(productsList[j]);
}

function productsRender(product){
    let listProducts = $("<article>");
    let pContent = `<div class="row">
                    <div class="col-md-9">
                        <h2>${product.name}</h2>
                            <ul class="list-group">
                               <li class="list-group-item"><strong>In stock: </strong> ${product.InStock} item(s)</li>
                               <li class="list-group-item"><a onclick="productSelected('${product._id}')" class="btn btn-primary" href="#">More Details</a></li>
                            </ul>
                    </div>
                    <div class="col-md-2">
                            <img src="${product.img.name}" class="thumbnail">
                    </div>
                    </div>`;
    let buyBtn = $("<button>").text("Buy Item");

    if (product.InStock > 0){
        $(buyBtn).click(function (add) {
            addToCart(product);
            alert(product.name + ": Item added to the shopping card");
    });
    }else
        $(buyBtn).prop('disabled', true);
    listProducts.append(pContent, buyBtn);
    productsShow.append(listProducts);
}
function productSelected(id){
    sessionStorage.setItem('productId', id);
    window.location = 'single.html';
    return false;
  }

  function getProduct() {
    let productId = sessionStorage.getItem('productId');
    $.get(url +productId)
     .done(function (data){
         let product = data;
         let output = `
         <div class="row">
         <div class="col-md-4">
           <img src="${product.img.name}" class="thumbnail">
         </div>
         <div class="col-md-8">
           <h2>${product.name}</h2>
           <ul class="list-group">
             <li class="list-group-item"><strong>Price: </strong> ${product.price} SEK</li>
             <li class="list-group-item"><strong>Description: </strong> ${product.discription}</li>
             <li class="list-group-item"><strong>rating: </strong> ${product.rating}</li>
             <button>Buy Item</button>
           </ul>
         </div>
       </div>`;
               $('#productsShow1').html(output);
     })
     .fail(function (error) {console.log("Error found!",error)});
}

let ObjectArray = {
    findIndex(ObjArray,Name,Value) {
        try{
            if (Array.isArray(ObjArray))
                return ObjArray.findIndex(objItem => objItem[Name] === Value);
            else
                return -1;
        }catch(e){return false}
    }
};
function fetchCart() {
    if (typeof(Storage) !== "undefined") {
        if (sessionStorage.reShoppingCart)
            return JSON.parse(sessionStorage.reShoppingCart) || [];
    } else
        console.log("Error");
}
function cacheCart(shoppingCart){
    if (typeof(Storage) !== "undefined") {
        sessionStorage.reShoppingCart = JSON.stringify(shoppingCart);
    } else
        console.log("Error");
}
function updateQuantity(productId) {
    let idxProduct = ObjectArray.findIndex(productsList,"Id",productId);
    if (idxProduct > -1){
        if (productsList[idxProduct].InStock > 0)
            productsList[idxProduct].InStock--;
    }
    showProduct();
}
function addToCart(product) {
    let shoppingCart = fetchCart() || [];
    let addProduct = ObjectArray.findIndex(shoppingCart,"Id",product.Id);
    if (addProduct > -1) {
        shoppingCart[addProduct].Quantity++;
    }else{
        product.Quantity = 1;
        shoppingCart.push(product);
    }
    cacheCart(shoppingCart);
    updateQuantity(product.Id);
    showProductsCart();
}
function showProductsCart() {
    productsShowCart.html("");
    let productsListCart = fetchCart() || [];

    let cartList = $("<article>");
    let sum = 0;


    for (let i in productsListCart) {
        cartList.append(cartRender(productsListCart[i]));
        sum += productsListCart[i].price*productsListCart[i].Quantity;
    }
    let sumTotal = $("<p>").html("<h3>SUM: " + sum.toFixed(1) + " SEK" + "</h3>");
    let orderBtn = $('<button>').html('Order');
    productsShowCart.append(cartList,sumTotal,orderBtn);
}
function cartRender(product) {
    return `
            <div class="row" id="cartCss">
            <div class="col-md-8">
              <h4><strong>  Name: </strong>${product.name}</h4>
              <ul class="list-group">
                <li class="list-group-item"><strong>Price: </strong> ${product.price} SEK</li>
                <li class="list-group-item"><strong>Quantity: </strong> ${product.Quantity} item(s)</li>
                <li class="list-group-item"><strong>Total price: </strong>${(product.price*product.Quantity).toFixed(1)} SEK</li>
              </ul>
            </div>
          </div>
                `;
        
}

showProductsCart();