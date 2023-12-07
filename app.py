
from flask import Flask
import flask as f
import flask_sqlalchemy as fsa
from sqlalchemy.sql import func
import re
from flask_cors import CORS
from collections import OrderedDict
import json
from sqlalchemy import and_
from sqlalchemy.sql import select
from flask import jsonify
from sqlalchemy.orm import aliased
from flask import request

from datetime import datetime, time, timedelta



app = Flask(__name__)
CORS(app)
app.secret_key = 'applebeepie' 
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = fsa.SQLAlchemy(app)

def is_sql_injection(input_string):
    # Define a list of common SQL injection keywords, patterns, and attack strings
    sql_patterns = [
        r"\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|UNION|EXEC)\b",
        r"\b(--|\#|\/\|\\/|;|xp_|sp_|0x|1=1|1=0|1=2)\b",
        r"\b(OR|AND|NOT)\b\s+\d+\s*[=<>]+\s*\d+",
        r"('\s*[\)\(]|\s+OR\s+\d+=\d+|'\s*\|\s*'\d+'\s*=\s*'\d+)",
        r"(%20AND%20|\/\|\\/|%20OR%20|%20UNION%20|%20SELECT%20)",
    ]

    # Combine all patterns into a single regex pattern
    sql_pattern = "|".join(sql_patterns)

    # Check for matches in the input string
    if re.search(sql_pattern, input_string, re.IGNORECASE):
        return True
    else:
        return False


# =================================== SQLite Database Models ===================================================
class User(db.Model):
    __tablename__ = 'users' 
    
    u_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    email=db.Column(db.String(80),unique=True, nullable=False)
    firstname=db.Column(db.String(80), nullable=False)
    lastname= db.Column(db.String(80),nullable=False)
    favorite_user = db.Column(db.Integer)
    date_created = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

class Item(db.Model):
    __tablename__ = 'items'

    item_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(200), unique=True, nullable=False)
    description = db.Column(db.String(1000), unique=False, nullable=False)
    primary_category = db.Column(db.String(500), unique=False, nullable=False)
    sub_category1=  db.Column(db.String(500), unique=False, nullable=False)
    sub_category2=  db.Column(db.String(500), unique=False, nullable=False)
    price = db.Column(db.Integer, unique=False, nullable=False)
    u_id = db.Column(db.Integer, unique=False, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

class Review(db.Model):
    __tablename__ = 'reviews'

    review_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    rating = db.Column(db.String(9), unique=False, nullable=False)
    description = db.Column(db.String(1000), unique=False, nullable=False)
    item_id = db.Column(db.Integer, unique=False, nullable=False)
    u_id = db.Column(db.Integer, unique=False, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

class ActionCounter(db.Model):
    __tablename__ = 'action_counter'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    u_id = db.Column(db.Integer, unique=True, nullable=False)
    daily_item_count = db.Column(db.Integer, unique=False, nullable=False)
    first_item_time = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    review_count = db.Column(db.Integer, unique=False, nullable=False)
    first_review_time = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

# db.session.add(user)
# db.session.commit()

@app.route('/')
def index():
    return f.jsonify(message="Welcome to the Login and Registration System", success=True)

@app.route('/register', methods=['POST'])
def register():
    if f.request.method == 'POST':
        try:
            username = f.request.form['username']
            password = f.request.form['password']
            email = f.request.form['email']
            Fname = f.request.form['firstname']
            Lname = f.request.form['lastname']

            if is_sql_injection(username) or is_sql_injection(password) or is_sql_injection(email) or is_sql_injection(Fname) or is_sql_injection(Lname):
                return f.jsonify(message="Invalid Input", success=False)

            new_user = User(username=username, password=password, email=email, firstname=Fname, lastname=Lname)
            db.session.add(new_user)
            db.session.commit()
            return f.jsonify(message="Registration successful. You can now login.", success=True)
        except Exception as e:
            return f.jsonify(message="Registration unsuccessful. Reason: " + str(e), success=False)

@app.route('/login', methods=['POST'])
def login():
    if f.request.method == 'POST':
        username = f.request.form['username']
        password = f.request.form['password']
        print("username: " + username + " password: " + password)
        print("is_sql_injection(username): " + str(is_sql_injection(username)) + " is_sql_injection(password): " + str(is_sql_injection(password)))
        if is_sql_injection(username) and is_sql_injection(password):
            return f.jsonify(error="Invalid Input", success=False)
        else:
            user = User.query.filter_by(username=username, password=password).first()
            if user:
                return f.jsonify(user_id=user.u_id, success=True)
            else:
                return f.jsonify(error="Invalid credentials. Please try again.", success=False)

@app.route('/review', methods=['POST'])
def post_review():
    if f.request.method == 'POST':
        u_id = f.request.form['u_id']
        item_id = f.request.form['item_id']
        rating = f.request.form['rating']
        description = f.request.form['description']
        print("Saving review: item_id: " + item_id + " rating: " + rating + " description: " + description)

        # Check if user posted this item
        item = Item.query.filter_by(item_id=item_id, u_id=u_id).first()
        if item:
            return f.jsonify(message="Cannot post review to your own item.", success=False)

        # Check if limit is exceeded or already reviewed this product
        review = Review.query.filter_by(item_id=item_id, u_id=u_id).first()
        if review:
            return f.jsonify(message="This User's review already exists for this product.", success=False)
        
        action_counter = ActionCounter.query.filter_by(u_id=u_id).first()
        review_was_today = False
        if action_counter:
            # Get the current date and time
            current_datetime = datetime.now()

            # Extract the current date (midnight) and the end of the day (23:59:59)
            current_date = current_datetime.date()
            start_of_day = datetime.combine(current_date, time.min)
            end_of_day = datetime.combine(current_date, time.max)

            # check if review was today
            review_was_today = start_of_day <= action_counter.first_review_time <= end_of_day
            if action_counter.review_count >= 3 and review_was_today:
                return f.jsonify(message="You can only post 3 reviews in 24 hrs.", success=False)

        # Save review
        new_review = Review(rating=rating, description=description, item_id=item_id, u_id=u_id)
        db.session.add(new_review)

        if action_counter:
            if review_was_today:
                action_counter.review_count = action_counter.review_count + 1
            else:
                # review older than day, so reset counter to 1 and current timestamp to today
                action_counter.review_count = 1
                action_counter.first_review_time = datetime.now()
        else:
            # this is first time so create new action counter
            new_action_counter = ActionCounter(u_id=u_id,
                                           daily_item_count=0,
                                           first_item_time=datetime.now() - timedelta(hours=24),
                                           review_count=1,
                                           first_review_time=datetime.now()
                                           )
            db.session.add(new_action_counter)
        db.session.commit()

        # send confirmation
        return f.jsonify(message="Review posted.", success=True)

@app.route('/addItems',methods=['POST'])
def addItems():
    if f.request.method== 'POST':
        
        u_id =f.request.form['user_ID']
        title = f.request.form['title']
        description = f.request.form['description']
        Pcategory = f.request.form['primary_category']
        Scategory = f.request.form['sub_category1']
        Tcategory = f.request.form['sub_category2']
        price = f.request.form['price']  
        



        action_counter = ActionCounter.query.filter_by(u_id=u_id).first()
        post_was_today= False
        if action_counter:
          # Get the current date and time
          current_datetime = datetime.now()
          print("current_datetime",current_datetime)
          # Extract the current date (midnight) and the end of the day (23:59:59)
          current_date = current_datetime.date()
          start_of_day = datetime.combine(current_date, time.min)
          end_of_day = datetime.combine(current_date, time.max)

          # check if post was today
          post_was_today = start_of_day <= action_counter.first_item_time <= end_of_day
          print("post_was_today",post_was_today)
          if action_counter.daily_item_count >= 2 and post_was_today:
              print("daily_item_count",action_counter.daily_item_count)
              
              return f.jsonify(message="You have reached the limit of item that can be posted in a day", success=False)
        
        # Save Post
        item=Item( 
                    title=title,
                    description=description,
                    primary_category=Pcategory,
                    sub_category1=Scategory,
                    sub_category2=Tcategory,
                    price=price,
                    u_id=u_id
                )
        db.session.add(item) 
        
        if action_counter:
            if post_was_today:
                action_counter.daily_item_count = action_counter.daily_item_count + 1
            else:
                # review older than day, so reset counter to 1 and current timestamp to today
                action_counter.daily_item_count = 1
                action_counter.first_item_time = datetime.now()
        else:
        # this is first time so create new action counter
            new_action_counter = ActionCounter(u_id=u_id,
                                           daily_item_count=1,
                                           first_item_time=datetime.now() - timedelta(hours=24),
                                           review_count=0,
                                           first_review_time=datetime.now()
                                           )
            db.session.add(new_action_counter)
        db.session.commit()
         # send confirmation
        return f.jsonify(message="Item posted.", success=True)

# =================================== Initialize Database ===================================================

@app.route('/initDatabase',methods=['POST'])
def initilize_Database():

    if f.request.method== 'POST':
#   ------------------------------------User Table-----------------------------------------------------------
       
            userinsert=[[11,"John","John123","John@gmail.com","John","Smith", 13,"2023-12-03 08:40:00"],
                        [12,"Mary","Mary1","Mary@gmail.com","Mary","Johnson",  13,"2023-11-02 10:40:00"],
                        [13,"Alex","Alex2","Alex@gmail.com","Alex","Williams", 14,"2023-10-30 18:40:00"],
                        [14,"David","David3","David@gmail.com","David","Brown", 11,"2023-10-31 11:40:00"],
                        [15,"Emily","Emily112","Emily@gmail.com","Emily","Davis", 14,"2023-12-01 15:40:00"],
            ]

            for i in range(0,len(userinsert)):
                date_created =datetime.strptime(userinsert[i][7], '%Y-%m-%d %H:%M:%S')
                
                newUser = User(u_id=userinsert[i][0],
                               username=userinsert[i][1],
                               password=userinsert[i][2],
                               email=userinsert[i][3],
                               firstname=userinsert[i][4],
                               lastname=userinsert[i][5],
                               favorite_user=userinsert[i][6],
                               date_created=date_created)
                db.session.add(newUser)
                db.session.commit()
            

        #   ------------------------------------ Items Table---------------------------------------------------------
            itemsInsert=[[1,"Watch","Analog Watch","Watches","Analog","Lether",750,11,"2023-11-03 18:40:00"],
                        [3,"Smartphone","This is new iPhone 15.","Electronics","Cellphone","Apple",1050,12,"2023-11-02 11:40:00"],
                        [4,"Shoes","All New authentic Jordan 1","Shoes","Nike","Jordan",250,13,"2023-10-30 19:40:00"],
                        [5,"Shoe","New Designs for Air force ","Shoes","Nike","Air Force",80,13,"2023-10-30 18:40:00"],
                        [6,"Furniture","Stylish Modern table Designed by professional","Furniture","Tables","Wooden",200,14,"2023-10-31 13:40:00"],
                        [7,"Games","Latest games for PC, Xbox and PS5","Games","FPS","RPG",50,15,"2023-11-01 17:40:00"],
                        [2,"Shirts","top Shirts","Cloths","Shirt","Cotton",5,11,"2023-11-12 17:40:00"],
                        [8,"AF 07","triple white","Shoes","Nike","Air Force",5,11,"2023-11-12 17:40:00"],
                        [9,"RL Shirts","top Shirts","Cloths","Shirt","Cotton",5,12,"2023-11-12 17:40:00"],
                        [10,"AF 08","triple black","Shoes","Nike","Air Force",5,12,"2023-11-12 17:40:00"],
                        [11,"Running Shoes ","White Strips","Shoes","Adidas","Runfalcon",500,13,"2023-11-12 18:40:00"]
                        ]
            i=0

            for i in range(0,len(itemsInsert)):
                date_created = datetime.strptime(itemsInsert[i][8], '%Y-%m-%d %H:%M:%S')
                newItem = Item(item_id=itemsInsert[i][0],
                            title=itemsInsert[i][1],
                            description=itemsInsert[i][2],
                            primary_category=itemsInsert[i][3],
                            sub_category1=itemsInsert[i][4],
                            sub_category2=itemsInsert[i][5],
                            price=itemsInsert[i][6],
                            u_id=itemsInsert[i][7],
                            date_created=date_created)
                db.session.add(newItem)
                db.session.commit()



        #   ------------------------------------ Review Table--------------------------------------------------------
            reviewInsert=[[1,"Excellent","Best Quality and Great Service",4,13,"2023-11-2 12:40:00"],
                        [2,"Good","Good Quality",3,15,"2023-11-3 14:40:00"],
                        [3,"Good","Not Great Quality but Good Service",7,14,"2023-11-4 19:40:00"],
                        [4,"Fair","Good Quality but Not so good Service",5,14,"2023-11-4 20:40:00"],
                        [5,"Poor","Disapointing Service",6,11,"2023-11-5 17:40:00"],
                        [6,"Excellent","wow ",2,13,"2023-11-03 10:40:00"],
                        [7,"Excellent","What",3,15,"2023-11-03 14:40:00"],
                        [8,"Excellent","Come on",3,13,"2023-11-03 12:40:00"],
                        [9,"Excellent","LOL ",7,14,"2023-11-04 12:40:00"],
                        [10,"Excellent","Fine ",6,15,"2023-11-05 12:40:00"],
                        [11,"Excellent","Amazing ",3,11,"2023-11-07 12:40:00"],
                        [12,"Poor","Disapointing Shoes",11,12,"2023-11-03 18:23:00"],
                        [13,"Poor","Disapointing Service",6,12,"2023-11-04 13:16:00"]
                        ]
            i=0

            for i in range(0,len(reviewInsert)):
                date_created =datetime.strptime(reviewInsert[i][5], '%Y-%m-%d %H:%M:%S')
                newReview = Review( review_id=reviewInsert[i][0],
                                rating=reviewInsert[i][1],
                                description=reviewInsert[i][2],
                                item_id=reviewInsert[i][3],
                                u_id=reviewInsert[i][4],
                                date_created=date_created
                                )
                db.session.add(newReview)
                db.session.commit()
 

        #   ------------------------------------ ActionCounter Table-------------------------------------------------
            ActionInsert=[[1,11,2,"2023-11-03 19:40:00",1,"2023-11-5 17:40:00"],
                        [2,12,1,"2023-11-02 11:40:00",2,"2023-11-8 15:09:08"],
                        [3,13,2,"2023-10-30 19:40:00",1,"2023-11-2 12:40:00"],
                        [4,14,1,"2023-10-31 13:40:00",2,"2023-11-4 20:40:00"],
                        [5,15,1,"2023-11-01 17:40:00",1,"2023-11-3 14:40:00"]
                        ]
            i=0

            for i in range(0,len(ActionInsert)):
                date_created =datetime.strptime(ActionInsert[i][3], '%Y-%m-%d %H:%M:%S')
                DC4 = datetime.strptime(ActionInsert[i][5], '%Y-%m-%d %H:%M:%S')
                newAction = ActionCounter( id=ActionInsert[i][0],
                                        u_id=ActionInsert[i][1],
                                        daily_item_count=ActionInsert[i][2],
                                        first_item_time=date_created,
                                        review_count=ActionInsert[i][4],
                                        first_review_time=DC4
                                        )
                db.session.add(newAction)
                db.session.commit()
        #   ------------------------------------ Commiting ----------------------------------------------------------    
            
            
            
            
           
            
            print("Complete")
            return f.jsonify(message="Database Initilization completed", success=True)

@app.route('/search', methods=['POST'])
def search_category():
    if f.request.method == 'POST':
        category = f.request.form['category']

        items = Item.query.filter_by(primary_category=category).all()
        serialized_items = [
            OrderedDict([
                ("item_id", item.item_id),
                ("title", item.title),
                ("description", item.description),
                ("Pcategory", item.primary_category),
                ("Scategory", item.sub_category1),
                ("Tcategory", item.sub_category2),
                ("price", item.price),
            ])
            for item in items
        ]

        # return f.jsonify(items=serialized_items)
        response_data = json.dumps(serialized_items, indent=4, ensure_ascii=False, sort_keys=False)

        return response_data

# Custom encoder function for datetime objects
def datetime_serializer(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    return None

# User List

@app.route('/all_users', methods=['POST'])
def all_users():
    # Fetch all users from the User table
    all_users = User.query.all()

    # Create a list of user details
    users_details = [
        {
            "au_id": user.u_id,
            "firstname": user.firstname,
        }
        for user in all_users
    ]

    return f.jsonify(users_details)

# Phase 3 - 1

@app.route('/most_expensive_items', methods=['POST'])
def most_expensive_items():
    if f.request.method == 'POST':
        # Fetch distinct categories from the database
        distinct_categories = db.session.query(Item.primary_category).distinct().all()

        most_expensive_items_by_category = []

        # Iterate through each distinct category
        for category in distinct_categories:
            category_name = category.primary_category

            # Query to get the most expensive item in the current category
            most_expensive_item = db.session.query(Item).filter(
                Item.primary_category == category_name
            ).order_by(Item.price.desc()).first()

            if most_expensive_item:
                # Serialize the most expensive item
                serialized_item = {
                    "aprimary_category": category_name,
                    "bpid": most_expensive_item.item_id,
                    "ctitle": most_expensive_item.title,
                    "description": most_expensive_item.description,
                    "eprice": most_expensive_item.price
                }

                most_expensive_items_by_category.append(serialized_item)

        # Return the list of most expensive items by category
        return jsonify(most_expensive_items_by_category)

# Phase 3 - 2
@app.route('/twoCategories', methods=['POST'])
def two_categories():
    if f.request.method == 'POST':
        category1 = f.request.form['category1']
        category2 = f.request.form['category2']
        items = (
            Item.query
            .filter((Item.primary_category == category1) | (Item.primary_category == category2))
            .order_by(func.strftime('%Y-%m-%d', Item.date_created))
            .all()
        )

        user_set = set()
        for item in items:
            user_set.add(item.u_id)

        # Check if both categories exist for an user
        for user in user_set.copy():
            cat1_present = False
            cat2_present = False
            for item in items:
                if item.u_id == user:
                    if item.primary_category == category1:
                        cat1_present = True
                    if item.primary_category == category2:
                        cat2_present = True
            if not (cat1_present and cat2_present):
                user_set.remove(user)


        filtered_users = User.query.filter(User.u_id.in_(user_set)).all()
        filtered_users = [
            OrderedDict([
                ("u_id", user.u_id),
                ("firstname", user.firstname),
                ("lastname", user.lastname),
            ])
            for user in filtered_users
        ]
        response_data = json.dumps(filtered_users, indent=4, ensure_ascii=False, default=datetime_serializer)


        return response_data


# Phase 3 - 3

@app.route('/user_items_with_specific_ratings', methods=['POST'])
def user_items_with_specific_ratings():
    if request.method == 'POST':
        try:
            u_id = request.form['u_id']

            # Query to get items with ratings "Excellent" or "Good" for a specific user
            items_with_specific_ratings = db.session.query(
                Item.item_id,
                Item.title,
                Item.description,
                Item.primary_category,
                Item.sub_category1,
                Item.sub_category2,
                Item.price,
                Review.rating
            ).join(Review, Item.item_id == Review.item_id).filter(
                Item.u_id == u_id,
                (Review.rating == "Excellent") | (Review.rating == "Good"),
            ).all()

            # Serialize the items
            serialized_items = [
                OrderedDict([
                    ("aitem_id", item.item_id),
                    ("btitle", item.title),
                    ("cdescription", item.description),
                    ("drating", item.rating),
                ])
                for item in items_with_specific_ratings
            ]

            # Return the list of items with specific ratings
            return jsonify(serialized_items)

        except Exception as e:
            return jsonify(error=str(e), success=False)



# Phase 3 - 4
# API route to list users who posted the most number of items on a specific date
@app.route('/users_most_items_on_date', methods=['POST'])
def users_most_items_on_date():
    # Get the specific date from the request parameters (you can also hardcode it)
    date_str = "2023-11-12 17:40:00"
    specific_date = datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S')

    # Query to get users who posted the most number of items on the specific date
    result = db.session.query(
        User.firstname,
        func.count(Item.item_id).label('item_count')
    ).join(Item, User.u_id == Item.u_id).filter(
        Item.date_created >= specific_date,
        Item.date_created < specific_date + timedelta(days=1)
    ).group_by(User).order_by(func.count(Item.item_id).desc()).all()

    # Check if there is a tie


    max_item_count = result[0].item_count
    top_users = [(user.firstname) for user in result if user.item_count == max_item_count]
    result = []
    i = 1
    for u in top_users:
        result.append({"aitem_count": i , "bfirstname": u})
        i +=1
    return f.jsonify(result)


# Phase 3 - 5
@app.route('/favorite', methods=['POST'])
def get_favorite_by_two_users():
    if f.request.method == 'POST':
        userX = f.request.form['userX']
        userY = f.request.form['userY']

        user_set = set()
        user_set.add(userX)
        user_set.add(userY)

        filtered_users = User.query.filter(User.username.in_(user_set)).all()
        a=[]
        if filtered_users[0].favorite_user == filtered_users[1].favorite_user:
            print("Ux: " + userX + " Uy: " + userY + " fav: " + str(filtered_users[0].favorite_user))
            user = User.query.filter_by(u_id=filtered_users[0].favorite_user).first()
            a.append({"au_id":user.u_id, "bfirstname": user.firstname, "clastname": user.lastname})
            return f.jsonify(a)
        
        return f.jsonify({})
# Phase 3 - 6
@ app.route('/never_post_excellent', methods=['POST'])
def never_post_excellent():
    # Fetch all reviews
    all_reviews = Review.query.all()
    # Get item IDs with "Excellent" reviews
    users = User.query.all()

    items = Item.query.all()
    id_no_excellent_reviews = {review.item_id for review in all_reviews if review.rating.lower() =='excellent'}
    # get count of Excellent
    no_excellent= dict()

    count=0
    for item in id_no_excellent_reviews:
        count=0
        for review in all_reviews:
            if review.item_id == item and  review.rating.lower() =='excellent':
                count=count+1
        no_excellent[item]=count    


    itemList=[]
    key_list=list(no_excellent.keys())        

    i=0                    
    for i in key_list:
        if(no_excellent[i]>=3):
            continue
        else:
            itemList.append(i)            

    user_list=[]
    j=0
    A=[]
    for item in items:
        for j in range(0,len(itemList)):
            if item.item_id==itemList[j]:
                A.append(item.u_id)
    A=list(set(A))

    excellent=[]
    for user in users:
        for i in range(0,len(A)):
            if user.u_id==A[i]:
                
                excellent.append({"firstname": user.firstname, "lastname": user.lastname})
    A=[]

    return f.jsonify(excellent)





# Phase 3 - 7
@app.route('/users_without_poor_reviews', methods=['POST'])
def users_items_without_poor_reviews():
    # Fetch all reviews
    all_reviews = Review.query.all()

    # Get item IDs with "poor" reviews
    id_poor_reviews = {review.u_id for review in all_reviews if review.rating.lower() == 'poor'}

    # Filter items without "poor" reviews
    users = User.query.all()

    # Get users corresponding to items without "poor" reviews
    users_without_poor_reviews = []

    for user in users:
        if user.u_id not in id_poor_reviews:
            users_without_poor_reviews.append({"au_id": user.u_id, "bfirstname": user.firstname, "clastname": user.lastname})

    return f.jsonify(users_without_poor_reviews)

# Phase 3 - 8

@app.route('/users_with_poor_reviews', methods=['POST'])
def users_with_only_poor_reviews():
    # Fetch all reviews
    all_reviews = Review.query.all()

    # Create sets to keep track of users with "poor" reviews and users with other types of reviews
    users_with_poor_reviews = set()
    users_with_other_reviews = set()

    # Iterate through reviews and populate the sets
    for review in all_reviews:
        if review.rating.lower() == 'poor':
            users_with_poor_reviews.add(review.u_id)
        else:
            users_with_other_reviews.add(review.u_id)

    # Find users who have only "poor" reviews
    users_only_poor_reviews = users_with_poor_reviews - users_with_other_reviews

    # Filter users based on users_with_only_poor_reviews
    users = User.query.filter(User.u_id.in_(users_only_poor_reviews)).all()
    users_only_poor_reviews_info = [
        {"au_id": user.u_id, "bfirstname": user.firstname, "clastname": user.lastname}
        for user in users
    ]

    return jsonify(users_only_poor_reviews_info)
    

# Phase 3-9
@app.route('/never_posted_poor_review', methods=['POST'])
def never_posted_poor_review():
    # if f.request.method == 'POST':
            
        # Fetch all reviews
        all_reviews = Review.query.all()
        all_items = Item.query.all()
        users = User.query.all()
        No_allow=[]
        id_no_poor_reviews=[]
        uid_no_poor_reviews=[]
        No_allow2=[]

        # Get item IDs with "poor" reviews
        for review in all_reviews:
            if review.rating.lower() != 'poor':
                id_no_poor_reviews.append(review.item_id)
            else:
                No_allow.append(review.item_id)

        # print("",)
        print("id_no_poor_reviews",set(id_no_poor_reviews))
        print("No_allow",set(No_allow))
        
        for item in all_items:
            for i in id_no_poor_reviews:
                if (item.item_id == i  ):
                    uid_no_poor_reviews.append(item.u_id)
            for j in No_allow:
                if (j==item.item_id):
                    No_allow2.append(item.u_id)
        print("uid_no_poor_reviews",set(uid_no_poor_reviews))
        print("No_allow2",set(No_allow2))       
                
        # result = list(filter(lambda x: x not in uid_no_poor_reviews, No_allow2))
        result = [item for item in uid_no_poor_reviews if item not in No_allow2]       


        print("no_poor_review",set(result))            
        
               
        # # Filter items without "poor" reviews
        # 
        
        # # Fetch all items
        # all_items = Item.query.all()
        # u_no=[]
        # F=[]
        # Item_and_User = dict()
        # # Adding item id as key and U_id as value
        # for i in all_items:
        #     Item_and_User[i.item_id]= i.u_id
        # # creating a list that contains U_ID that has posted items and has no poor review    
        # for key in Item_and_User:
        #     for item_id in result:
        #         if key == item_id:
                    
        #             u_no.append(Item_and_User[item_id])
        #         else:
        #             F.append(Item_and_User[item_id])

        
        never_posted_poor_review=[]
        result=list(set(result))
        # u_no=list(set(u_no))
        # Creating a list that contains firstname of user from U_No
        for user in users:
            for i in result:
                if(user.u_id==i):
                     if i in never_posted_poor_review:
                        continue
                     else:
                        never_posted_poor_review.append({"au_id": user.u_id, "bfirstname": user.firstname, "clastname": user.lastname})

        return f.jsonify(never_posted_poor_review)

# Phase 3- 10

from collections import Counter
@app.route('/excellent_review_user_pairs', methods=['POST'])
def excellent_review_user_pairs():
    # Fetch all queries
    all_users = User.query.all()
    all_items = Item.query.all()
    all_reviews = Review.query.all()
    # Create a list to store user pairs with excellent reviews

    #all dictionaries
    exc_item_user=dict()
    lol=dict()
    for reviews in all_reviews:
        if reviews.rating.lower() =='excellent':
            lol[reviews.u_id] = reviews.item_id
            
            for item in all_items:
                if item.item_id == reviews.item_id:
                    exc_item_user[reviews.u_id] = item.u_id

    user_list=[]

    list_of_pairs = list(exc_item_user.items())
    i=0
    for i in range(0,len(list_of_pairs)):
        if i<(len(list_of_pairs)-1):
            are_lists_equal = Counter(list_of_pairs[i]) == Counter(list_of_pairs[i+1])
            if are_lists_equal:
                user_list.append(list_of_pairs[i])
            
        else:
            are_lists_equal = Counter(list_of_pairs[0]) == Counter(list_of_pairs[i])
            if are_lists_equal:
                user_list.append(list_of_pairs[0])

    flat_user_list = [item for sublist in user_list for item in sublist]
    excellent_review_user_pairs=[]
    for user in all_users:
        for i in range(0,len(flat_user_list)):
            if user.u_id==flat_user_list[i]:
                excellent_review_user_pairs.append(user.firstname)
    i=0
    Final=[]
    for i in range(0,len(excellent_review_user_pairs)):
        if i<(len(excellent_review_user_pairs)-1):
            Final.append({"firstname1 ":excellent_review_user_pairs[i],"firstname2 ":excellent_review_user_pairs[i+1]})
    return f.jsonify(Final)





if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)


