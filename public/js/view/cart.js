
// add count cart 
function up(event)
{
    var quantity =  event.target.parentElement.children[1].firstElementChild.value;
    var quantityConvert = parseInt(quantity);
    if(quantity < 300)
    {
        event.target.parentElement.children[1].firstElementChild.value = parseInt(quantityConvert) + 1
        console.log(event.target.parentElement.children[1].firstElementChild.value )
    }
    else
    {
        event.target.parentElement.children[1].firstElementChild.value = 300;
    }
  
    

}


// mignus count  cart 
function down()
{
    var  quantity =   event.target.parentElement.children[1].firstElementChild.value
    if(quantity > 1)
    {
        event.target.parentElement.children[1].firstElementChild.value = parseInt(quantity) - 1 ; 
    }   
    else
    {
        event.target.parentElement.children[1].firstElementChild.value = 1;
    }
}

// tổng tiền chi tiết sản phẩm 
function process()
{
    var price = document.querySelectorAll("td.price span");
    var totalCost = document.querySelector("li.total-cost span:last-child");
    var fee = document.querySelector("li.fee span:last-child");
    var amount = document.querySelectorAll("input.qty-text");
    var totalPayment = document.querySelector( "li.total-payment span:last-child");
    
    console.log(price);
    listPrice = Array.from(price).map((e) => parseInt(e.textContent));
    listAmount = Array.from(amount).map((e) => parseInt(e.value));
    price.forEach(e => e.textContent = e.textContent.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' đ');
    var totalCostTemp = 0;
    for (var i = 0; i < listPrice.length; i++) {
      totalCostTemp += listPrice[i] * listAmount[i];
    }
    totalCost.textContent = totalCostTemp.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' đ';
    totalPayment.textContent = (totalCostTemp + parseInt(fee.textContent)).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' đ';
    fee.textContent = fee.textContent.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' đ'


}