let welcome_page = document.getElementById("welcome_page");
let post_item_section = document.getElementById("post_item");
let search_category_section = document.getElementById("search_category");
let initialise_database_section = document.getElementById("initialise_database");
var search_form = document.getElementById("search_form");
var review_item = document.getElementById("review_item");

const user_ID = localStorage.getItem('user_ID');
console.log(user_ID);

function homepage(){
    welcome_page.style.display= 'block';
    post_item_section.style.display = 'none';
    search_category_section.style.display= 'none';
    initialise_database_section.style.display= 'none';
}

function post_item(){
    welcome_page.style.display= 'none';
    post_item_section.style.display = 'block';
    search_category_section.style.display= 'none';
    initialise_database_section.style.display= 'none';
}

function search_category(){
    welcome_page.style.display= 'none';
    post_item_section.style.display = 'none';
    search_category_section.style.display= 'block';
    initialise_database_section.style.display= 'none';
}

function initialise_database(){
    welcome_page.style.display= 'none';
    post_item_section.style.display = 'none';
    search_category_section.style.display= 'none';
    initialise_database_section.style.display= 'block';
}

function logout(){ 
    location.href="index.html";
}

submitbtn.onclick = function(){
    var title = document.forms.RegForm.title.value;
    var description = document.forms.RegForm.description.value;
    var primary_category = document.forms.RegForm.primary_category.value;
    var sub_category1 = document.forms.RegForm.sub_category1.value;
    var sub_category2 = document.forms.RegForm.sub_category2.value;
    var price = document.forms.RegForm.price.value;
    var post_item_form = document.getElementById("post_item_form");

    if (title == "") {
        window.alert("Please enter title of the item !");
        return false;
    }

    else if (description == "") {
        window.alert("Please enter description of the item !");
        return false;
    }

    else if (primary_category == "") {
        window.alert("Please enter primary category of the item !");
        return false;
    }
    
    else if (price == "") {
        window.alert("Please enter price of the item !");
        return false;
    }
    
    else{
        const formParams = new URLSearchParams();
        formParams.append('user_ID', user_ID);
        formParams.append('title', title);
        formParams.append('description', description);
        formParams.append('primary_category', primary_category);
        formParams.append('sub_category1', sub_category1);
        formParams.append('sub_category2', sub_category2);
        formParams.append('price', price);
        console.log(formParams);

        
        fetch('http://127.0.0.1:5000/addItems', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formParams.toString()
        })
        .then(response => response.json()) 
        .then(data => {
            // Handle the response data here
            console.log(data);
            if(data.success == false)
            {
                window.alert ("You cannot post items more than 3 times per day !");
                return false;
            }
            else if(data.success == true)
            {
                window.alert ("Your item has been successfully posted !");
                post_item_form.reset();
                return true;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        return true;
    }
}

searchbtn.onclick = function(){
    var search = document.forms.searchForm.search.value;
    let show_searched_category = document.getElementById("show_searched_category");

    if (search == "") {
        window.alert("Please enter category to be searched !");
        return false;
    }

    else{
        const formParams = new URLSearchParams();
        formParams.append('search', search);
        console.log(formParams);

        
        fetch('http://127.0.0.1:5000/search', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formParams.toString()
        })
        .then(response => response.json()) 
        .then(data => {
            // Handle the response data here
            Products_Json = data;
            console.log(data);
            if(Object.keys(data).length === 0)
            {
                window.alert ("No items found for this category !");
                return false;
            }
            else
            {
                list_table();
                show_searched_category.style.display = 'block';
                return true;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        return true;
    }
}

//sample Json Array
var Sample_Products_Json = [
    { "pid" : 1, 
    "title" : "Smartphone",
    "description" : "This is iPhone 15",
    "primary_category" : "Electronics",
    "sub_category1" : "CellPhone",
    "sub_category2" : "Apple",
    "price" : "1200"},
                
    { "pid" : 2, 
    "title" : "Watch",
    "description" : "This is Wrist watch",
    "primary_category" : "Electronics",
    "sub_category1" : "Watch",
    "sub_category2" : "Digital",
    "price" : "100"},
    
    { "pid" : 3, 
    "title" : "headphones",
    "description" : "This are ANC headphones",
    "primary_category" : "Electronics",
    "sub_category1" : "Headphones",
    "sub_category2" : "",
    "price" : "50"},
    
    { "pid" : 4, 
    "title" : "bicycle",
    "description" : "This is bicycle",
    "primary_category" : "Sports",
    "sub_category1" : "",
    "sub_category2" : "",
    "price" : "200"},
    
    { "pid" : 5, 
    "title" : "Database Design Textbook",
    "description" : "This is textbook",
    "primary_category" : "Book",
    "sub_category1" : "Computer Science",
    "sub_category2" : "Database",
    "price" : "60"}];

var Products_Json = [];

function list_table(){
    var headers = Object.keys(Products_Json[0]);
    
    var headerRowHTML='<tr>';
        headerRowHTML+='<th>'+'Product Id'+'</th>';
        headerRowHTML+='<th>'+'Title'+'</th>';
        headerRowHTML+='<th>'+'Description'+'</th>';
        headerRowHTML+='<th>'+'Primary Category'+'</th>';
        headerRowHTML+='<th>'+'Sub category 1'+'</th>';
        headerRowHTML+='<th>'+'Sub category 2'+'</th>';
        headerRowHTML+='<th>'+'Price ($)'+'</th>';
        headerRowHTML+='<th>'+'Review'+'</th>';
    headerRowHTML+='</tr>';       

    var allRecordsHTML='';
    for(var i=0;i<Products_Json.length;i++){
     

        allRecordsHTML+='<tr>';
        for(var j=0;j<headers.length;j++){
            var header=headers[j];
            allRecordsHTML+='<td>'+Products_Json[i][header]+'</td>';
        }
       allRecordsHTML+='<td>'+'<button type="button" onclick="review_product('+ i +')">Post review</button>'+'</td>';
        allRecordsHTML+='</tr>';
         
    }
     
    var table=document.getElementById("display_searched_data");
    table.innerHTML=headerRowHTML + allRecordsHTML;
}

var pid_json;
function review_product(number){
    var headers1 = Object.keys(Products_Json[0]);
    for(var i=0;i<Products_Json.length;i++){
        if(i == number){
            for(var j=0;j<headers1.length;j++){
                if(j == 0){
                    var header1=headers1[j];
                    pid_json = Products_Json[i][header1];    
                }
            }
            
        }
    }
    
    var heading = "Give a review for product ID : "+pid_json;
    document.getElementById("review_heading").innerHTML = heading;
    review_item.style.display= 'block';
    search_form.style.display = 'none';
}

backbtn.onclick = function(){
    let search_form = document.getElementById("search_form");
    let review_item = document.getElementById("review_item");
    search_form.style.display= 'block';
    review_item.style.display = 'none';  
}

submit_review_btn.onclick = function(){
    var pid = pid_json;
    var review_dropdown = document.forms.ReviewForm.review_dropdown.value;
    var review_description = document.forms.ReviewForm.review_description.value;
    

    if (review_dropdown == "") {
        window.alert("Please select a review from dropdown !");
        return false;
    }

    else if (review_description == "") {
        window.alert("Please enter review description of the item !");
        return false;
    }

    else{
        const formParams = new URLSearchParams();
        formParams.append('user_ID', user_ID);
        formParams.append('pid', pid);
        formParams.append('review_dropdown', review_dropdown);
        formParams.append('review_description', review_description);
        console.log(formParams);

        
        fetch('http://127.0.0.1:5000/review', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formParams.toString()
        })
        .then(response => response.json()) 
        .then(data => {
            // Handle the response data here
            console.log(data);
            if(data.success == false)
            {
                window.alert ("You cannot post review to your own items !");
                return false;
            }
            else if(data.success == true)
            {
                window.alert ("Your review has been successfully registered !");
                review_item.style.display= 'none';
                search_form.style.display = 'block';
                return true;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        return true;
    }
}

initialise_databasebtn.onclick = function(){
    const formParams = new URLSearchParams();
        console.log(formParams);

        
        fetch('http://127.0.0.1:5000/initDatabase', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formParams.toString()
        })
        .then(response => response.json()) 
        .then(data => {
            // Handle the response data here
            console.log(data);
            if(data.success == false)
            {
                window.alert ("Database couldn't be initialised !");
                return false;
            }
            else if(data.success == true)
            {
                window.alert ("Database initialised");
                location.reload();
                return true;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        return true;
}