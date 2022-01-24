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
    alert("đã vào");
    

}