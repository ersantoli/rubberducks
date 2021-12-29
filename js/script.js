const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);
let cart = [];
let modalQt = 0;
let key = 0;

modelsJson.map((item, index)=>{
    let modelsItem = c('.models .models-item').cloneNode(true); 
    modelsItem.setAttribute('data-key', index);
    modalQt = 1;
    modelsItem.querySelector('.models-item--img img').src = item.img;
    modelsItem.querySelector('.models-item--price').innerHTML = 'R$'+ item.price[2].toFixed(2);
    modelsItem.querySelector('.models-item--name').innerHTML = item.name;
    modelsItem .querySelector('.models-item--desc').innerHTML = item.description;

    modelsItem .querySelector('a').addEventListener('click' ,(e)=>{
        e.preventDefault();
         key = e.target.closest('.models-item').getAttribute('data-key');
        c('.modelsBig img').src = modelsJson[key].img;
        c('.modelsInfo h1').innerHTML = modelsJson[key].name;
        c('.modelsInfo--desc').innerHTML = modelsJson[key].description;
c('.modelsInfo--size.selected').classList.remove('selected');
        cs('.modelsInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
                c('.modelsInfo--actualPrice').innerHTML = `R$ ${modelsJson[key].price[sizeIndex].toFixed(2)}`;
            }
            //size.innerHTML = modelsJson[key].sizes[sizeIndex]; 
            size.querySelector('span').innerHTML = modelsJson[key].sizes[sizeIndex];
        });
        c('.modelsInfo--qt').innerHTML = modalQt
        c('.modelsWindowArea').style.opacity = 0;
        c('.modelsWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.modelsWindowArea').style.opacity = 1;
        },200);
      

    });

    
    c('.models-area').append(modelsItem )
});

function closeModal(){
    c('.modelsWindowArea').style.opacity= 0;
    setTimeout(()=>{
        c('.modelsWindowArea').style.display = 'none'
    },500);
}
 
//Fechar modal
cs('.modelsInfo--cancelButton, .modelsInfo--cancelMobileButton').forEach((item) =>{
    item.addEventListener('click', closeModal);
});

//botao quantidade
c('.modelsInfo--qtmenos').addEventListener('click',()=>{
    if(modalQt > 1){
        modalQt --;
        c('.modelsInfo--qt').innerHTML= modalQt;
    }
});

c('.modelsInfo--qtmais').addEventListener('click',()=>{
    modalQt++; 
    c('.modelsInfo--qt').innerHTML= modalQt;
});

cs('.modelsInfo--size').forEach((size,  sizeIndex)=>{
    size.addEventListener('click',(e)=>{
        c('.modelsInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
        
        //Atualizar Preço 
        c('.modelsInfo--actualPrice').innerHTML = `R$ ${modelsJson[key].price[sizeIndex].toFixed(2)}`;
    });
});

//carrinho compras
c('.modelsInfo--addButton').addEventListener('click', ()=>{
    //modelo
    console.log("modelo: "+ key);
    
    //qual tamanho
    let size = parseInt(c('.modelsInfo--size.selected').getAttribute('data-key')); 
  //  console.log("Tamanho: "+ size);
  let identifier = modelsJson[key].id+'@'+size;
  let locaId = cart.findIndex((item)=> item.identifier == identifier);
  if(locaId > -1){
      cart[locaId].qt +=modalQt;

  }else{

  
   
    //Quantidade
    console.log("Quantidade: "+ modalQt);

//inserir tudo no carrinho
  
    cart.push({
        identifier,
        id:modelsJson[key].id,
        size,
        qt:modalQt
        
    });
}
    console.log(cart);
    upadateCart();
closeModal();
});
 //Abrir menu carrinho no modo mobile
c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = 0;
    }
});
//fim


//botao fechar carrinho
c('.menu-closer').addEventListener('click', ()=>{
    
        c('aside').style.left = '100vw';
 
});
//fim****
 
c('.cart--finalizar').addEventListener('click', ()=>{
    
    cart = [];
    upadateCart();

});



function upadateCart(){
    //modo mobile mostrar a quantidade de items no carrinho
    c('.menu-openner span').innerHTML = cart.length;
//
    if(cart.length > 0){
c('aside').classList.add('show');
c('.cart').innerHTML= '';

let subtotal = 0;
let desconto = 0;
let total = 0;

cart.map((itemCart, index)=>{
    let modelItem = modelsJson.find((itemBD) =>itemBD.id == itemCart.id);
    let cartItem = c('.models .cart--item').cloneNode(true);
subtotal += modelItem.price[itemCart.size] * itemCart.qt;
    /*    let modeSizeName;
switch(itemCart.size){
 case 0:
    modeSizeName= 'P';
    break;
    case 1:
    modeSizeName = 'M';
    break;
    case 2:
    modeSizeName= 'G';
    break;
}*/
    cartItem.querySelector('img').src = modelItem.img;

    cartItem.querySelector('.cart--item-nome').innerHTML = `${modelItem.name} - ${modelItem.sizes[itemCart.size]}`;
cartItem.querySelector('.cart--item--qt').innerHTML = itemCart.qt;

/*cartItem.querySelector('.cart--item--qtmenos').innerHTML.addEventListener('click', ()=>{
    itemCart.qt++;
    upadateCart();
});*/

//botoes de adcionar dentro do cart
cartItem.querySelector('.cart--item--qtmais').addEventListener('click', ()=>{
itemCart.qt++;
upadateCart();
});

    cartItem.querySelector('.cart--item--qtmenos').addEventListener('click', ()=>{
        //so reduz se for maior que 1
        if(itemCart.qt > 1){
        itemCart.qt--;}
        else{
            cart.splice(index, 1);

        }

        upadateCart();
    });

    c('.cart').append(cartItem);
});
desconto = subtotal * 0.1;
total = subtotal - desconto;
c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    }else{
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';

    }

};