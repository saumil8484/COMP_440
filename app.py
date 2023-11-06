from itertools import product
from flask import Flask
import flask as f
import flask_sqlalchemy as fsa
import re
from flask_cors import CORS
from collections import OrderedDict
import json

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
    date_created = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

class Item(db.Model):
    __tablename__ = 'items'

    item_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(200), unique=True, nullable=False)
    description = db.Column(db.String(1000), unique=False, nullable=False)
    Pcategory = db.Column(db.String(500), unique=False, nullable=False)
    Scategory=  db.Column(db.String(500), unique=False, nullable=False)
    Tcategory=  db.Column(db.String(500), unique=False, nullable=False)
    price = db.Column(db.Integer, unique=False, nullable=False)
    u_id = db.Column(db.Integer, unique=False, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

class Review(db.Model):
    __tablename__ = 'reviews'

    review_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    rating = db.Column(db.String(9), unique=False, nullable=False)
    description = db.Column(db.String(1000), unique=False, nullable=False)
    item_id = db.Column(db.Integer, unique=True, nullable=False)
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

# =================================== Initialize Database ===================================================

# ======================================== APIs =============================================================



# db.session.add(user)
# db.session.commit()
@app.route('/addItems',methods=['POST'])
def addItems():
    if f.request.method== ['POST']:
        u_id =f.request.form['u_id']
        title = f.request.form['title']
        description = f.request.form['description']
        Pcategory = f.request.form['primary_category']
        Scategory = f.request.form['sub_category1']
        Tcategory = f.request.form['sub_category2']
        price = f.request.form['price']  
        print("LOL")



        action_counter = ActionCounter.query.filter_by(u_id=u_id).first()
        post_was_today= False
        # if action_counter:
        #   # Get the current date and time
        #   current_datetime = datetime.now()
        
        #   # Extract the current date (midnight) and the end of the day (23:59:59)
        #   current_date = current_datetime.date()
        #   start_of_day = datetime.combine(current_date, time.min)
        #   end_of_day = datetime.combine(current_date, time.max)

        #   # check if post was today
        #   post_was_today = start_of_day <= action_counter.first_item_time <= end_of_day
        #   if action_counter.daily_item_count >= 3 and post_was_today:
        #       return f.jsonify(message="You have reached the limit of item that can be posted in a day", success=False)
        
        # Save Post
        item=Item( 
                    title=title,
                    description=description,
                    primary_category=Pcategory,
                    sub_category1=Scategory,
                    sub_category2=Tcategory,
                    price=price,
                    owner_id=u_id
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
    if f.request.method== ['POST']:
#   ------------------------------------User Table-----------------------------------------------------------
       
            userinsert=[[1,"John","John123","John@gmail.com","John","Smith","2023-11-03 08:40:00"],
            [2,"Mary","Mary1","Mary@gmail.com","Mary","Johnson","2023-11-02 10:40:00"],
            [3,"Alex","Alex2","Alex@gmail.com","Alex","Williams","2023-10-30 18:40:00"],
            [4,"David","David3","David@gmail.com","David","Brown","2023-10--31 11:40:00"],
            [5,"Emily","Emily112","Emily@gmail.com","Emily","Davis","2023-11-01 15:40:00"],
            ]
            for i in range(0,len(userinsert())):
                newUser = User(u_id=userinsert[i][0],
                            username=userinsert[i][1],
                            password=userinsert[i][2],
                            email=userinsert[i][3],
                            firstname=userinsert[i][4],
                            lastname=userinsert[i][5],
                            date_created=userinsert[i][6])

        #   ------------------------------------ Items Table---------------------------------------------------------
            itemsInsert=[[1,"Watch","Analog Watch","Watches","Analog","Lether",750,1,"2023-11-03 18:40:00"],
                        [2,"Watch","Digital Watch","Watches","Digital","Metal",950,1,"2023-11-03 19:40:00"],
                        [3,"Smartphone","This is new iPhone 15.","Electronics","Cellphone","Apple",1050,2,"2023-11-02 11:40:00"],
                        [4,"Shoes","All New authentic Jordan 1","Shoes","Nike","Jordan",250,3,"2023-10-30 19:40:00"],
                        [5,"Shoes","New Designs for Air force ","Shoes","Nike","Air Force",80,3,"2023-10-30 :40:00"],
                        [6,"Furniture","Stylish Modern table Designed by professional","Furniture","Tables","Wooden",200,4,"2023-10--31 13:40:00"],
                        [7,"Games","Latest games for PC, Xbox and PS5","Games","FPS","RPG",50,5,"2023-11-01 17:40:00"],
                        ]
            i=0
            for i in range(0,len(itemsInsert())):
                newItem = Item(u_id=itemsInsert[i][0],
                            username=itemsInsert[i][1],
                            password=itemsInsert[i][2],
                            email=itemsInsert[i][3],
                            firstname=itemsInsert[i][4],
                            lastname=itemsInsert[i][5],
                            date_created=itemsInsert[i][6])

        #   ------------------------------------ Review Table--------------------------------------------------------
            reviewInsert=[[1,"Excellent","Best Quality and Great Service",4,3,"2023-11-2 12:40:00"],
                        [2,"Good","Good Quality",3,5,"2023-11-3 14:40:00"],
                        [3,"Good","Not Great Quality but Good Service",7,4,"2023-11-4 19:40:00"],
                        [4,"Fair","Good Quality but Not so good Service",5,4,"2023-11-4 20:40:00"],
                        [5,"Poor","Disapointing Service",6,1,"2023-11-5 17:40:00"]
                        ]
            i=0
            for i in range(0,len(reviewInsert())):
                newReview = Review( u_id=reviewInsert[i][0],
                                username=reviewInsert[i][1],
                                password=reviewInsert[i][2],
                                email=reviewInsert[i][3],
                                firstname=reviewInsert[i][4],
                                lastname=reviewInsert[i][5]
                                )
                            
        #   ------------------------------------ ActionCounter Table-------------------------------------------------
            ActionInsert=[[1,2,"2023-11-03 19:40:00",1,"2023-11-5 17:40:00"],
                        [2,1,"2023-11-02 11:40:00",0,""],
                        [3,2,"2023-10-30 :40:00",1,"2023-11-2 12:40:00"],
                        [4,1,"2023-10--31 13:40:00",2,"2023-11-4 20:40:00"],
                        [5,1,"2023-11-01 17:40:00",1,"2023-11-3 14:40:00"]
                        ]
            i=0
            for i in range(0,len(ActionInsert())):
                newAction = ActionCounter( u_id=ActionInsert[i][0],
                                        username=ActionInsert[i][1],
                                        password=ActionInsert[i][2],
                                        email=ActionInsert[i][3],
                                        firstname=ActionInsert[i][4]
                                        )
        #   ------------------------------------ Commiting ----------------------------------------------------------    
            db.session.add(newUser)
            db.session.add(newItem)
            db.session.add(newReview)
            db.session.add(newAction)
            db.session.commit()
            
            
            return f.jsonify(message="Database Initilization completed", success=True)
        






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
                return f.jsonify(error="Invalid Input")

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

@app.route('/search', methods=['POST'])
def search_category():
    if f.request.method == 'POST':
        category = f.request.form['category']

        items = Item.query.filter_by(Pcategory=category).all()
        serialized_items = [
            OrderedDict([
                ("item_id", item.item_id),
                ("title", item.title),
                ("description", item.description),
                ("Pcategory", item.Pcategory),
                ("Scategory", item.Scategory),
                ("Tcategory", item.Tcategory),
                ("price", item.price),
            ])
            for item in items
        ]

        # return f.jsonify(items=serialized_items)
        response_data = json.dumps(serialized_items, indent=4, ensure_ascii=False, sort_keys=False)

        return response_data

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)


