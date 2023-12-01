let welcome_page = document.getElementById("welcome_page");
let post_item_section = document.getElementById("post_item");
let search_category_section = document.getElementById("search_category");
let initialise_database_section = document.getElementById("initialise_database");
let lists_section = document.getElementById("lists");
let lists_buttons_section = document.getElementById("lists_buttons");
let lists_functionalities_section = document.getElementById("lists_functionalities");
let list_1_functionalities_section = document.getElementById("list_1_functionalities");
let list_2_functionalities_section = document.getElementById("list_2_functionalities");
let list_3_functionalities_section = document.getElementById("list_3_functionalities");
let list_4_functionalities_section = document.getElementById("list_4_functionalities");
let list_5_functionalities_section = document.getElementById("list_5_functionalities");
let list_6_functionalities_section = document.getElementById("list_6_functionalities");
let list_7_functionalities_section = document.getElementById("list_7_functionalities");
let list_8_functionalities_section = document.getElementById("list_8_functionalities");
let list_9_functionalities_section = document.getElementById("list_9_functionalities");
let list_10_functionalities_section = document.getElementById("list_10_functionalities");
var search_form = document.getElementById("search_form");
var review_item = document.getElementById("review_item");

const user_ID = localStorage.getItem('user_ID');
console.log(user_ID);

function homepage(){
    welcome_page.style.display= 'block';
    post_item_section.style.display = 'none';
    search_category_section.style.display= 'none';
    initialise_database_section.style.display= 'none';
    lists_section.style.display= 'none';
}

function post_item(){
    welcome_page.style.display= 'none';
    post_item_section.style.display = 'block';
    search_category_section.style.display= 'none';
    initialise_database_section.style.display= 'none';
    lists_section.style.display= 'none';
}

function search_category(){
    welcome_page.style.display= 'none';
    post_item_section.style.display = 'none';
    search_category_section.style.display= 'block';
    initialise_database_section.style.display= 'none';
    lists_section.style.display= 'none';
}

function initialise_database(){
    welcome_page.style.display= 'none';
    post_item_section.style.display = 'none';
    search_category_section.style.display= 'none';
    initialise_database_section.style.display= 'block';
    lists_section.style.display= 'none';
}

function lists(){
    welcome_page.style.display= 'none';
    post_item_section.style.display = 'none';
    search_category_section.style.display= 'none';
    initialise_database_section.style.display= 'none';
    lists_section.style.display= 'block';
    lists_buttons_section.style.display= 'block';
    lists_functionalities_section.style.display= 'none';
    list_1_functionalities_section.style.display= 'none';
    list_2_functionalities_section.style.display= 'none';
    list_3_functionalities_section.style.display= 'none';
    list_4_functionalities_section.style.display= 'none';
    list_5_functionalities_section.style.display= 'none';
    list_6_functionalities_section.style.display= 'none';
    list_7_functionalities_section.style.display= 'none';
    list_8_functionalities_section.style.display= 'none';
    list_9_functionalities_section.style.display= 'none';
    list_10_functionalities_section.style.display= 'none';
    user_list();
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
        formParams.append('category', search);
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
        formParams.append('u_id', user_ID);
        formParams.append('item_id', pid);
        formParams.append('rating', review_dropdown);
        formParams.append('description', review_description);
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
            console.log("MY Goodf");
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

function backbtn_list(){
    lists_buttons_section.style.display= 'block';
    lists_functionalities_section.style.display= 'none';
    list_1_functionalities_section.style.display= 'none';
    list_2_functionalities_section.style.display= 'none';
    list_3_functionalities_section.style.display= 'none';
    list_4_functionalities_section.style.display= 'none';
    list_5_functionalities_section.style.display= 'none';
    list_6_functionalities_section.style.display= 'none';
    list_7_functionalities_section.style.display= 'none';
    list_8_functionalities_section.style.display= 'none';
    list_9_functionalities_section.style.display= 'none';
    list_10_functionalities_section.style.display= 'none';
}


list_1.onclick = function(){

    const formParams = new URLSearchParams();
        console.log(formParams);
        
        fetch('http://127.0.0.1:5000/most_expensive_items', {   //Change the URL
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formParams.toString()
        })
        .then(response => response.json()) 
        .then(data => {
            // Handle the response data here
            list_1_data = data;
            console.log(data);
            if(Object.keys(data).length === 0)
            {
                window.alert ("No data found !");
                return false;

            }
            else
            {
                list_1_table();
                lists_buttons_section.style.display= 'none';
                lists_functionalities_section.style.display= 'block';
                list_1_functionalities_section.style.display= 'block';
                list_2_functionalities_section.style.display= 'none';
                list_3_functionalities_section.style.display= 'none';
                list_4_functionalities_section.style.display= 'none';
                list_5_functionalities_section.style.display= 'none';
                list_6_functionalities_section.style.display= 'none';
                list_7_functionalities_section.style.display= 'none';
                list_8_functionalities_section.style.display= 'none';
                list_9_functionalities_section.style.display= 'none';
                list_10_functionalities_section.style.display= 'none';
                return true;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        return true;
}

//Sample JSON array for list 1
var sample_list_1_data = [
    { "primary_category" : "Electronics",
    "pid" : 1, 
    "title" : "Smartphone",
    "description" : "This is iPhone 15",
    "price" : "1200"},
                
    { 
        "primary_category" : "Electronics",
    "pid" : 2, 
    "title" : "Watch",
    "description" : "This is Wrist watch",
    "price" : "100"},
    
    { "primary_category" : "Electronics",
    "pid" : 3, 
    "title" : "headphones",
    "description" : "This are ANC headphones",
    "price" : "50"},
    
    { "primary_category" : "Sports",
    "pid" : 4, 
    "title" : "bicycle",
    "description" : "This is bicycle",
    "price" : "200"},
    
    { "primary_category" : "Book",
    "pid" : 5, 
    "title" : "Database Design Textbook",
    "description" : "This is textbook",
    "price" : "60"}];

var list_1_data = [];

function list_1_table(){
    var headers = Object.keys(list_1_data[0]);
    
    var headerRowHTML='<tr>';
        headerRowHTML+='<th>'+'Primary Category'+'</th>';
        headerRowHTML+='<th>'+'Product Id'+'</th>';
        headerRowHTML+='<th>'+'Title'+'</th>';
        headerRowHTML+='<th>'+'Description'+'</th>';
        headerRowHTML+='<th>'+'Price ($)'+'</th>';
    headerRowHTML+='</tr>';       

    var allRecordsHTML='';
    for(var i=0;i<list_1_data.length;i++){
     

        allRecordsHTML+='<tr>';
        for(var j=0;j<headers.length;j++){
            var header=headers[j];
            allRecordsHTML+='<td>'+list_1_data[i][header]+'</td>';
        }
        allRecordsHTML+='</tr>';
         
    }
     
    var table=document.getElementById("list_1_table");
    table.innerHTML=headerRowHTML + allRecordsHTML;
}


list_2.onclick = function(){
    lists_buttons_section.style.display= 'none';
    lists_functionalities_section.style.display= 'block';
    list_1_functionalities_section.style.display= 'none';
    list_2_functionalities_section.style.display= 'block';
    list_3_functionalities_section.style.display= 'none';
    list_4_functionalities_section.style.display= 'none';
    list_5_functionalities_section.style.display= 'none';
    list_6_functionalities_section.style.display= 'none';
    list_7_functionalities_section.style.display= 'none';
    list_8_functionalities_section.style.display= 'none';
    list_9_functionalities_section.style.display= 'none';
    list_10_functionalities_section.style.display= 'none';
}

list_2_searchbtn.onclick = function(){
    var list_2_search_category1 = document.forms.list_2_searchForm.list_2_category1.value;
    var list_2_search_category2 = document.forms.list_2_searchForm.list_2_category2.value;
    let list_2_searched_category = document.getElementById("list_2_searched_category");

    if (list_2_search_category1 == "") {
        window.alert("Please first category !");
        return false;
    }
    
    else if (list_2_search_category2 == "") {
        window.alert("Please second category !");
        return false;
    }

    else{
        const formParams = new URLSearchParams();
        formParams.append('category1', list_2_search_category1);
        formParams.append('category2', list_2_search_category2);
        console.log(formParams.toString());

        
        fetch('http://127.0.0.1:5000/search', { //Change the URL
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formParams.toString()
        })
        .then(response => response.json()) 
        .then(data => {
            // Handle the response data here
            list_2_data = data;
            console.log(data);
            if(Object.keys(data).length === 0)
            {
                window.alert ("No users found for both of this category !");
                return false;
            }
            else
            {
                list_2_table();
                list_2_searched_category.style.display = 'block';
                return true;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        return true;
    }
}

//Sample JSON array for list 2
var sample_list_2_data = [
    { "u_id" : "1",
    "firstname" : "abc",
    "lastname" : "xyz"},
    
    { "u_id" : "2",
    "firstname" : "John",
    "lastname" : "asd"},
    
    { "u_id" : "3",
    "firstname" : "hyjnuabc",
    "lastname" : "vwrwxyz"},
    
    { "u_id" : "4",
    "firstname" : "weewabc",
    "lastname" : "xcwfyz"},
    
    { "u_id" : "5",
    "firstname" : "asbc",
    "lastname" : "xyfwwcwz"}];

var list_2_data = [];

function list_2_table(){
    var headers = Object.keys(list_2_data[0]);
    
    var headerRowHTML='<tr>';
        headerRowHTML+='<th>'+'User ID'+'</th>';
        headerRowHTML+='<th>'+'First Name'+'</th>';
        headerRowHTML+='<th>'+'Last Name'+'</th>';
    headerRowHTML+='</tr>';       

    var allRecordsHTML='';
    for(var i=0;i<list_2_data.length;i++){
     

        allRecordsHTML+='<tr>';
        for(var j=0;j<headers.length;j++){
            var header=headers[j];
            allRecordsHTML+='<td>'+list_2_data[i][header]+'</td>';
        }
        allRecordsHTML+='</tr>';
         
    }
     
    var table=document.getElementById("list_2_table");
    table.innerHTML=headerRowHTML + allRecordsHTML;
}


list_3.onclick = function(){
    lists_buttons_section.style.display= 'none';
    lists_functionalities_section.style.display= 'block';
    list_1_functionalities_section.style.display= 'none';
    list_2_functionalities_section.style.display= 'none';
    list_3_functionalities_section.style.display= 'block';
    list_4_functionalities_section.style.display= 'none';
    list_5_functionalities_section.style.display= 'none';
    list_6_functionalities_section.style.display= 'none';
    list_7_functionalities_section.style.display= 'none';
    list_8_functionalities_section.style.display= 'none';
    list_9_functionalities_section.style.display= 'none';
    list_10_functionalities_section.style.display= 'none';



    user_list();
    let select = document.getElementById("list_3_dropdown");
    user_list_data.forEach(function (item) {
        var option = document.createElement("option");
        option.text = item.firstname;
        option.value = item.au_id;
        select.add(option);
    });
    
}

list_3_searchbtn.onclick = function(){
    var list_3_dropdown = document.getElementById('list_3_dropdown').value;
    let list_3_searched_user = document.getElementById("list_3_searched_user");

    if (list_3_dropdown == "--Users--" || list_3_dropdown == "") {
        window.alert("Please select a user !");
        return false;
    }

    else{
        const formParams = new URLSearchParams();
        formParams.append('u_id', list_3_dropdown);
        console.log(formParams.toString());

        
        fetch('http://127.0.0.1:5000/user_items_with_specific_ratings', { //Change the URL
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formParams.toString()
        })
        .then(response => response.json()) 
        .then(data => {
            // Handle the response data here
            list_3_data = data;
            console.log(data);
            if(Object.keys(data).length === 0)
            {
                window.alert ("No data found !");
                return false;
            }
            else
            {
                list_3_table();
                list_3_searched_user.style.display = 'block';
                return true;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        return true;
    }
}

var list_3_data = [];

function list_3_table(){
    var headers = Object.keys(list_3_data[0]);
    
    var headerRowHTML='<tr>';
        headerRowHTML+='<th>'+'Product ID'+'</th>';
        headerRowHTML+='<th>'+'Title'+'</th>';
        headerRowHTML+='<th>'+'Description'+'</th>';
        headerRowHTML+='<th>'+'Rating'+'</th>';
    headerRowHTML+='</tr>';       

    var allRecordsHTML='';
    for(var i=0;i<list_3_data.length;i++){
     

        allRecordsHTML+='<tr>';
        for(var j=0;j<headers.length;j++){
            var header=headers[j];
            allRecordsHTML+='<td>'+list_3_data[i][header]+'</td>';
        }
        allRecordsHTML+='</tr>';
         
    }
     
    var table=document.getElementById("list_3_table");
    table.innerHTML=headerRowHTML + allRecordsHTML;
}

var user_list_data =[];
function user_list(){
    const formParams = new URLSearchParams();
        console.log(formParams);
        
        fetch('http://127.0.0.1:5000/all_users', {   //Change the URL
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formParams.toString()
        })
        .then(response => response.json()) 
        .then(data => {
            // Handle the response data here
            user_list_data = data;
            console.log(data);
            if(Object.keys(data).length === 0)
            {
                window.alert ("No data found !");
                return false;

            }
            else
            {
                return true;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        return true;
}

list_4.onclick = function(){
    
    const formParams = new URLSearchParams();
        console.log(formParams);
        
        fetch('http://127.0.0.1:5000/initDatabase', {   //Change the URL
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formParams.toString()
        })
        .then(response => response.json()) 
        .then(data => {
            // Handle the response data here
            list_4_data = data;
            console.log(data);
            if(Object.keys(data).length === 0)
            {
                window.alert ("No data found !");
                return false;

            }
            else
            {
                list_4_table();
                lists_buttons_section.style.display= 'none';
                lists_functionalities_section.style.display= 'block';
                list_1_functionalities_section.style.display= 'none';
                list_2_functionalities_section.style.display= 'none';
                list_3_functionalities_section.style.display= 'none';
                list_4_functionalities_section.style.display= 'block';
                list_5_functionalities_section.style.display= 'none';
                list_6_functionalities_section.style.display= 'none';
                list_7_functionalities_section.style.display= 'none';
                list_8_functionalities_section.style.display= 'none';
                list_9_functionalities_section.style.display= 'none';
                list_10_functionalities_section.style.display= 'none';
                return true;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        return true;
}

//Sample JSON array for list 4
var sample_list_4_data = [
    { "item_count" : "1",
    "firstname" : "abc"},
    
    { "item_count" : "2",
    "firstname" : "John"},
    
    { "item_count" : "3",
    "firstname" : "hyjnuabc"},
    
    { "item_count" : "4",
    "firstname" : "weewabc"},
    
    { "item_count" : "5",
    "firstname" : "asbc"}];

var list_4_data = [];

function list_4_table(){
    var headers = Object.keys(list_4_data[0]);
    
    var headerRowHTML='<tr>';
        headerRowHTML+='<th>'+'Total number of items posted'+'</th>';
        headerRowHTML+='<th>'+'User Firstname'+'</th>';
    headerRowHTML+='</tr>';       

    var allRecordsHTML='';
    for(var i=0;i<list_4_data.length;i++){
     

        allRecordsHTML+='<tr>';
        for(var j=0;j<headers.length;j++){
            var header=headers[j];
            allRecordsHTML+='<td>'+list_4_data[i][header]+'</td>';
        }
        allRecordsHTML+='</tr>';
         
    }
     
    var table=document.getElementById("list_4_table");
    table.innerHTML=headerRowHTML + allRecordsHTML;
}

list_5.onclick = function(){
    lists_buttons_section.style.display= 'none';
    lists_functionalities_section.style.display= 'block';
    list_1_functionalities_section.style.display= 'none';
    list_2_functionalities_section.style.display= 'none';
    list_3_functionalities_section.style.display= 'none';
    list_4_functionalities_section.style.display= 'none';
    list_5_functionalities_section.style.display= 'block';
    list_6_functionalities_section.style.display= 'none';
    list_7_functionalities_section.style.display= 'none';
    list_8_functionalities_section.style.display= 'none';
    list_9_functionalities_section.style.display= 'none';
    list_10_functionalities_section.style.display= 'none';

    user_list();
    let select1 = document.getElementById("list_5_dropdown1");
    let select2 = document.getElementById("list_5_dropdown2");
    

    user_list_data.forEach(function (item) {
        var option = document.createElement("option");
        option.text = item.firstname;
        select1.add(option);
    });

    user_list_data.forEach(function (item) {
        var option = document.createElement("option");
        option.text = item.firstname;
        select2.add(option);
    });
}

list_5_searchbtn.onclick = function(){
    var list_5_dropdown1 = document.getElementById('list_5_dropdown1').value;
    var list_5_dropdown2 = document.getElementById('list_5_dropdown2').value;
    let list_5_searched_user = document.getElementById("list_5_searched_user");

    if (list_5_dropdown1 == "--User 1--" || list_5_dropdown1 == "") {
        window.alert("Please select a user 1 !");
        return false;
    }

    else if (list_5_dropdown2 == "--User 2--" || list_5_dropdown2 == "") {
        window.alert("Please select a user 2 !");
        return false;
    }

    else{
        const formParams = new URLSearchParams();
        formParams.append('userX', list_5_dropdown1);
        formParams.append('userY', list_5_dropdown2);
        console.log(formParams.toString());

        
        fetch('http://127.0.0.1:5000/search', { //Change the URL
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formParams.toString()
        })
        .then(response => response.json()) 
        .then(data => {
            // Handle the response data here
            list_5_data = data;
            console.log(data);
            if(Object.keys(data).length === 0)
            {
                window.alert ("No data found !");
                return false;
            }
            else
            {
                list_5_table();
                list_5_searched_user.style.display = 'block';
                return true;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        return true;
    }
}

var list_5_data = [];

function list_5_table(){
    var headers = Object.keys(list_5_data[0]);
    
    var headerRowHTML='<tr>';
    headerRowHTML+='<th>'+'User ID'+'</th>';
    headerRowHTML+='<th>'+'First Name'+'</th>';
    headerRowHTML+='<th>'+'Last Name'+'</th>';
    headerRowHTML+='</tr>';       

    var allRecordsHTML='';
    for(var i=0;i<list_5_data.length;i++){
     

        allRecordsHTML+='<tr>';
        for(var j=0;j<headers.length;j++){
            var header=headers[j];
            allRecordsHTML+='<td>'+list_5_data[i][header]+'</td>';
        }
        allRecordsHTML+='</tr>';
         
    }
     
    var table=document.getElementById("list_5_table");
    table.innerHTML=headerRowHTML + allRecordsHTML;
}

list_6.onclick = function(){
    
    const formParams = new URLSearchParams();
    console.log(formParams);
    
    fetch('http://127.0.0.1:5000/never_post_excellent', {   //Change the URL
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formParams.toString()
    })
    .then(response => response.json()) 
    .then(data => {
        // Handle the response data here
        list_6_data = data;
        console.log(data);
        if(Object.keys(data).length === 0)
        {
            window.alert ("No data found !");
            return false;

        }
        else
        {
            list_6_table();
            lists_buttons_section.style.display= 'none';
            lists_functionalities_section.style.display= 'block';
            list_1_functionalities_section.style.display= 'none';
            list_2_functionalities_section.style.display= 'none';
            list_3_functionalities_section.style.display= 'none';
            list_4_functionalities_section.style.display= 'none';
            list_5_functionalities_section.style.display= 'none';
            list_6_functionalities_section.style.display= 'block';
            list_7_functionalities_section.style.display= 'none';
            list_8_functionalities_section.style.display= 'none';
            list_9_functionalities_section.style.display= 'none';
            list_10_functionalities_section.style.display= 'none';
            return true;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
    return true;
}

//Sample JSON array for list 6
var sample_list_6_data = [
    { "u_id" : "1",
    "firstname" : "abc",
    "lastname" : "xyz"},
    
    { "u_id" : "2",
    "firstname" : "John",
    "lastname" : "asd"},
    
    { "u_id" : "3",
    "firstname" : "hyjnuabc",
    "lastname" : "vwrwxyz"},
    
    { "u_id" : "4",
    "firstname" : "weewabc",
    "lastname" : "xcwfyz"},
    
    { "u_id" : "5",
    "firstname" : "asbc",
    "lastname" : "xyfwwcwz"}];

var list_6_data = [];

function list_6_table(){
    var headers = Object.keys(list_6_data[0]);
    
    var headerRowHTML='<tr>';

    headerRowHTML+='<th>'+'First Name'+'</th>';
    headerRowHTML+='<th>'+'Last Name'+'</th>';
    headerRowHTML+='</tr>';       

    var allRecordsHTML='';
    for(var i=0;i<list_6_data.length;i++){
     

        allRecordsHTML+='<tr>';
        for(var j=0;j<headers.length;j++){
            var header=headers[j];
            allRecordsHTML+='<td>'+list_6_data[i][header]+'</td>';
        }
        allRecordsHTML+='</tr>';
         
    }
     
    var table=document.getElementById("list_6_table");
    table.innerHTML=headerRowHTML + allRecordsHTML;
}

list_7.onclick = function(){
    
    const formParams = new URLSearchParams();
    console.log(formParams);
    
    fetch('http://127.0.0.1:5000/users_without_poor_reviews', {   //Change the URL
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formParams.toString()
    })
    .then(response => response.json()) 
    .then(data => {
        // Handle the response data here
        list_7_data = data;
        console.log(data);
        if(Object.keys(data).length === 0)
        {
            window.alert ("No data found !");
            return false;

        }
        else
        {
            list_7_table();
            lists_buttons_section.style.display= 'none';
            lists_functionalities_section.style.display= 'block';
            list_1_functionalities_section.style.display= 'none';
            list_2_functionalities_section.style.display= 'none';
            list_3_functionalities_section.style.display= 'none';
            list_4_functionalities_section.style.display= 'none';
            list_5_functionalities_section.style.display= 'none';
            list_6_functionalities_section.style.display= 'none';
            list_7_functionalities_section.style.display= 'block';
            list_8_functionalities_section.style.display= 'none';
            list_9_functionalities_section.style.display= 'none';
            list_10_functionalities_section.style.display= 'none';
            return true;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
    return true;
}

//Sample JSON array for list 7
var sample_list_7_data = [
    { "u_id" : "1",
    "firstname" : "abc",
    "lastname" : "xyz"},
    
    { "u_id" : "2",
    "firstname" : "John",
    "lastname" : "asd"},
    
    { "u_id" : "3",
    "firstname" : "hyjnuabc",
    "lastname" : "vwrwxyz"},
    
    { "u_id" : "4",
    "firstname" : "weewabc",
    "lastname" : "xcwfyz"},
    
    { "u_id" : "5",
    "firstname" : "asbc",
    "lastname" : "xyfwwcwz"}];

var list_7_data = [];

function list_7_table(){
    var headers = Object.keys(list_7_data[0]);
    
    var headerRowHTML='<tr>';
    headerRowHTML+='<th>'+'User ID'+'</th>';
    headerRowHTML+='<th>'+'First Name'+'</th>';
    headerRowHTML+='<th>'+'Last Name'+'</th>';
    headerRowHTML+='</tr>';       

    var allRecordsHTML='';
    for(var i=0;i<list_7_data.length;i++){
     

        allRecordsHTML+='<tr>';
        for(var j=0;j<headers.length;j++){
            var header=headers[j];
            allRecordsHTML+='<td>'+list_7_data[i][header]+'</td>';
        }
        allRecordsHTML+='</tr>';
         
    }
     
    var table=document.getElementById("list_7_table");
    table.innerHTML=headerRowHTML + allRecordsHTML;
}

list_8.onclick = function(){
        
    const formParams = new URLSearchParams();
    console.log(formParams);
    
    fetch('http://127.0.0.1:5000/users_with_poor_reviews', {   //Change the URL
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formParams.toString()
    })
    .then(response => response.json()) 
    .then(data => {
        // Handle the response data here
        list_8_data = data;
        console.log(data);
        if(Object.keys(data).length === 0)
        {
            window.alert ("No data found !");
            return false;

        }
        else
        {
            list_8_table();
            lists_buttons_section.style.display= 'none';
            lists_functionalities_section.style.display= 'block';
            list_1_functionalities_section.style.display= 'none';
            list_2_functionalities_section.style.display= 'none';
            list_3_functionalities_section.style.display= 'none';
            list_4_functionalities_section.style.display= 'none';
            list_5_functionalities_section.style.display= 'none';
            list_6_functionalities_section.style.display= 'none';
            list_7_functionalities_section.style.display= 'none';
            list_8_functionalities_section.style.display= 'block';
            list_9_functionalities_section.style.display= 'none';
            list_10_functionalities_section.style.display= 'none';
            return true;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
    return true;
}

//Sample JSON array for list 8
var sample_list_8_data = [
    { "u_id" : "1",
    "firstname" : "abc",
    "lastname" : "xyz"},
    
    { "u_id" : "2",
    "firstname" : "John",
    "lastname" : "asd"},
    
    { "u_id" : "3",
    "firstname" : "hyjnuabc",
    "lastname" : "vwrwxyz"},
    
    { "u_id" : "4",
    "firstname" : "weewabc",
    "lastname" : "xcwfyz"},
    
    { "u_id" : "5",
    "firstname" : "asbc",
    "lastname" : "xyfwwcwz"}];

var list_8_data = [];

function list_8_table(){
    var headers = Object.keys(list_8_data[0]);
    
    var headerRowHTML='<tr>';
    headerRowHTML+='<th>'+'User ID'+'</th>';
    headerRowHTML+='<th>'+'First Name'+'</th>';
    headerRowHTML+='<th>'+'Last Name'+'</th>';
    headerRowHTML+='</tr>';       

    var allRecordsHTML='';
    for(var i=0;i<list_8_data.length;i++){
     

        allRecordsHTML+='<tr>';
        for(var j=0;j<headers.length;j++){
            var header=headers[j];
            allRecordsHTML+='<td>'+list_8_data[i][header]+'</td>';
        }
        allRecordsHTML+='</tr>';
         
    }
     
    var table=document.getElementById("list_8_table");
    table.innerHTML=headerRowHTML + allRecordsHTML;
}


list_9.onclick = function(){
    
    const formParams = new URLSearchParams();
    console.log(formParams);
    
    fetch('http://127.0.0.1:5000/never_posted_poor_review', {   //Change the URL
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formParams.toString()
    })
    .then(response => response.json()) 
    .then(data => {
        // Handle the response data here
        list_9_data = data;
        console.log(data);
        if(Object.keys(data).length === 0)
        {
            window.alert ("No data found !");
            return false;

        }
        else
        {
            list_9_table();
            lists_buttons_section.style.display= 'none';
            lists_functionalities_section.style.display= 'block';
            list_1_functionalities_section.style.display= 'none';
            list_2_functionalities_section.style.display= 'none';
            list_3_functionalities_section.style.display= 'none';
            list_4_functionalities_section.style.display= 'none';
            list_5_functionalities_section.style.display= 'none';
            list_6_functionalities_section.style.display= 'none';
            list_7_functionalities_section.style.display= 'none';
            list_8_functionalities_section.style.display= 'none';
            list_9_functionalities_section.style.display= 'block';
            list_10_functionalities_section.style.display= 'none';
            return true;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
    return true;
}

//Sample JSON array for list 9
var sample_list_9_data = [
    { "u_id" : "1",
    "firstname" : "abc",
    "lastname" : "xyz"},
    
    { "u_id" : "2",
    "firstname" : "John",
    "lastname" : "asd"},
    
    { "u_id" : "3",
    "firstname" : "hyjnuabc",
    "lastname" : "vwrwxyz"},
    
    { "u_id" : "4",
    "firstname" : "weewabc",
    "lastname" : "xcwfyz"},
    
    { "u_id" : "5",
    "firstname" : "asbc",
    "lastname" : "xyfwwcwz"}];

var list_9_data = [];

function list_9_table(){
    var headers = Object.keys(list_9_data[0]);
    
    var headerRowHTML='<tr>';
    headerRowHTML+='<th>'+'User ID'+'</th>';
    headerRowHTML+='<th>'+'First Name'+'</th>';
    headerRowHTML+='<th>'+'Last Name'+'</th>';
    headerRowHTML+='</tr>';       

    var allRecordsHTML='';
    for(var i=0;i<list_9_data.length;i++){
     

        allRecordsHTML+='<tr>';
        for(var j=0;j<headers.length;j++){
            var header=headers[j];
            allRecordsHTML+='<td>'+list_9_data[i][header]+'</td>';
        }
        allRecordsHTML+='</tr>';
         
    }
     
    var table=document.getElementById("list_9_table");
    table.innerHTML=headerRowHTML + allRecordsHTML;
}


list_10.onclick = function(){
    
    const formParams = new URLSearchParams();
    console.log(formParams);
    
    fetch('http://127.0.0.1:5000/excellent_review_user_pairs', {   //Change the URL
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formParams.toString()
    })
    .then(response => response.json()) 
    .then(data => {
        // Handle the response data here
        list_10_data = data;
        console.log(data);
        if(Object.keys(data).length === 0)
        {
            window.alert ("No data found !");
            return false;

        }
        else
        {
            list_10_table();
            lists_buttons_section.style.display= 'none';
            lists_functionalities_section.style.display= 'block';
            list_1_functionalities_section.style.display= 'none';
            list_2_functionalities_section.style.display= 'none';
            list_3_functionalities_section.style.display= 'none';
            list_4_functionalities_section.style.display= 'none';
            list_5_functionalities_section.style.display= 'none';
            list_6_functionalities_section.style.display= 'none';
            list_7_functionalities_section.style.display= 'none';
            list_8_functionalities_section.style.display= 'none';
            list_9_functionalities_section.style.display= 'none';
            list_10_functionalities_section.style.display= 'block';
            return true;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
    return true;
}

//Sample JSON array for list 10
var sample_list_10_data = [
    {"firstname1" : "abc",
    "firstname2" : "xyz"},
    
    {"firstname1" : "John",
    "firstname2" : "asd"},
    
    {"firstname1" : "hyjnuabc",
    "firstname2" : "vwrwxyz"},
    
    {"firstname1" : "weewabc",
    "firstname2" : "xcwfyz"},
    
    {"firstname1" : "asbc",
    "firstname2" : "xyfwwcwz"}];

var list_10_data = [];

function list_10_table(){
    var headers = Object.keys(list_10_data[0]);
    
    var headerRowHTML='<tr>';
    headerRowHTML+='<th>'+'User 1 from Pair'+'</th>';
    headerRowHTML+='<th>'+'User 2 from pair'+'</th>';
    headerRowHTML+='</tr>';       

    var allRecordsHTML='';
    for(var i=0;i<list_10_data.length;i++){
     

        allRecordsHTML+='<tr>';
        for(var j=0;j<headers.length;j++){
            var header=headers[j];
            allRecordsHTML+='<td>'+list_10_data[i][header]+'</td>';
        }
        allRecordsHTML+='</tr>';
         
    }
     
    var table=document.getElementById("list_10_table");
    table.innerHTML=headerRowHTML + allRecordsHTML;
}