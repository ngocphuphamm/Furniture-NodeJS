



var city  = document.getElementById("city");
var district = document.getElementById("district");
var ward = document.getElementById("ward");

console.log(city)
// lấy dữ liệu về 
const paramater = {
    url: "/data.json",
    method : "GET",
    responseType : "application/json",
}
// gọi jax = axios => nó trả về cho chúng ta là một promise
var promise =  axios(paramater);
// sau đó nó trả về một dạng object 
  promise.then((result)=>{
    // data  lấy được  sau khi get json
      console.log(result.data);
      renderCity(result.data);
  })
  // render ra option
    function renderCity(data){
        for( var item of data){
          // khởi tạo ra đối tượng các tỉnh thành phố
          city.options[city.options.length] = new Option(item.Name,item.Id);
        }
   
      // xứ lý khi thay đổi tỉnh thành thì sẽ hiển thị ra quận huyện thuộc tỉnh thành đó
          city.onchange = () =>{
            district.length = 1 ; 

            console.log(city.value);
            // kiểm tra giá trị value xem có rỗng ko là none thì ko thực hiện render các quận ra 
            if(this.value != "")
            {
              // lọc ra dữ liệu khi người dùng trỏ vào tỉnh thành phố
              const result = data.filter(n => n.Id === city.value);
              // nguyên nhân result[0].District
              // giải thích :
              // thì lúc ta lọc dữ liệu result xong thì kết quả nó sẽ trả cho ra một mảng 
              // trong mảng đó chứa đối tượng [{}]
              // thì có phải đối tượng mình gọi trong đó đang ở index = 0 thì mình phải gọi nó ra
              // là 
              //   result[0] thì lúc này nó ra  object{} thì trong object mình gọi đến attribute là DISTRICTS
              //     => result[0].Districts
              for (var  item of result[0].Districts)
              {
                district.options[district.options.length] = new Option(item.Name,item.Id); 
              }
             }
             else
             {
               // do nothing
             }
         }

         district.onchange = ()=>{
            ward.length = 1 ;
            const result = data.filter(el => el.Id === city.value);
            if(district.value != " ")
            {
              // lấy dữ liệu quận và trong dữ liệu quận chứ tên đường
              const resultDistrict = result[0].Districts.filter(el=>el.Id ===  district.value);
              
              for(var item of resultDistrict[0].Wards){
                ward.options[ward.options.length] = new Option(item.Name,item.id);
              }
            }
         }
         

   
      }

   