let welcome_page = document.getElementById("welcome_page");
let post_item_section = document.getElementById("post_item");
let search_category_section = document.getElementById("search_category");
let initialise_database_section = document.getElementById("initialise_database");

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
        formParams.append('title', title);
        formParams.append('description', description);
        formParams.append('primary_category', primary_category);
        formParams.append('sub_category1', sub_category1);
        formParams.append('sub_category2', sub_category2);
        formParams.append('price', price);
        console.log(formParams);

        //Change the URL
        fetch('http://127.0.0.1:5000/register', {
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


function list_table(){
    fetch("products.json")
    .then(function(response){
        return response.json();
    })
    .then(function(products){
        let placeholder = document.querySelector("#data_output");
        let out = "";
        for(let product of products){
            out += `
                <tr>
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>${product.primary_category}</td>
                <td>${product.sub_category1}</td>
                <td>${product.sub_category2}</td>
                <td>${product.price}</td>
                </tr>
            `;
        }

        placeholder.innerHTML = out;
    })
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
        list_table();
        show_searched_category.style.display = 'block';

        //Change the URL for search 
        /*fetch('http://127.0.0.1:5000/register', {
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
                window.alert ("No items found for this category !");
                return false;
            }
            else if(data.success == true)
            {
                //Enter code to display table
                show_searched_category.style.display = 'block';
                return true;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });*/
        return true;
    }
}



backbtn.onclick = function(){
    let search_form = document.getElementById("search_form");
    let review_item = document.getElementById("review_item");
    search_form.style.display= 'block';
    review_item.style.display = 'none';  
}

submit_review_btn.onclick = function(){
    var pid = document.forms.RegForm.title.value;// Change it to Product ID
    var review_dropdown = document.forms.ReviewForm.description.value;
    var review_description = document.forms.ReviewForm.review_description.value;
    var search_form = document.getElementById("search_form");
    var review_item = document.getElementById("review_item");

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
        
        formParams.append('pid', pid);
        formParams.append('review_dropdown', review_dropdown);
        formParams.append('review_description', review_description);
        console.log(formParams);

        //Change the URL
        fetch('http://127.0.0.1:5000/register', {
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

        //Change the URL
        fetch('http://127.0.0.1:5000/register', {
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