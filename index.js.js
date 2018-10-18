let url = "http://demo.edument.se/api/products/";
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
                if (data[i].Name !== null){
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
    let pContent = `<h5>${product.Name}</h5>
                   <div>
                        <img src="${product.Image}">
                        <p>${product.Description}</p>
                        <p>In stock: ${product.InStock} item(s)</p>
                        <a onclick="productSelected('${product.Id}')" class="btn btn-primary" href="#">More Details</a>
                   </div>`;
    let buyBtn = $("<button>").text("Buy Item");

    if (product.InStock > 0){
        $(buyBtn).click(function (add) {
            addToCart(product);
            alert(product.Name + ": Item added to the shopping card");
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
           <img src="${product.Image}" class="thumbnail">
         </div>
         <div class="col-md-8">
           <h2>${product.Name}</h2>
           <ul class="list-group">
             <li class="list-group-item"><strong>Price: </strong> ${product.Price} SEK</li>
             <li class="list-group-item"><strong>InStock: </strong> ${product.InStock} item(s)</li>
             <li class="list-group-item"><strong>Description: </strong> ${product.Description}</li>
           </ul>
           <button>Buy Item</button>
         </div>
       </div>`;
           let buyBtn = $("<button>").text("Buy Item");
               if (product.InStock > 0){
               $(buyBtn).click(function (add) {
                   addToCart(product);
                   alert(product.Name + ": Item added to the shopping card");
               });
           }else
               $(buyBtn).prop('disabled', true);
               $('#productsShow1').html(output, buyBtn);
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
        sum += productsListCart[i].Price*productsListCart[i].Quantity;
    }
    let sumTotal = $("<p>").html("<h3>SUM: " + sum.toFixed(1) + " SEK" + "</h3>");
    productsShowCart.append(cartList,sumTotal);
}
function cartRender(product) {
    return `<div id="cartContent">
                <h5>Product: ${product.Name}</h5>
                <h5>Price: ${product.Price}</h5>
                <h5>Quantity: ${product.Quantity} item(s)</h5>
                <h5>Total price: ${(product.Price*product.Quantity).toFixed(1)} SEK</h5>
            </div>
                `;
}

showProductsCart();