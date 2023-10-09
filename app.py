from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import re

app = Flask(__name__)
app.secret_key = 'applebeepie' 
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = SQLAlchemy(app)

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

#if(is_sql_injection(username)==True):
class User(db.Model):
    __tablename__ = 'users' 
    
    username = db.Column(db.String(80), unique=True, nullable=False, primary_key=True)
    password = db.Column(db.String(200), nullable=False)
    email=db.Column(db.String(80),unique=True, nullable=False)
    firstname=db.Column(db.String(80), nullable=False)
    lastname= db.Column(db.String(80),nullable=False)

@app.route('/')
def index():
    return jsonify(message="Welcome to the Login and Registration System", success=True)

@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        Fname = request.form['firstname']
        Lname = request.form['lastname']

        # Check if the username already exists in the database
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify(error="Username already exists. Please choose another username.")
        
        # Check if the email already exists in the database
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify(error="Email already exists. Please choose another email.")

        if is_sql_injection(username) or is_sql_injection(password) or is_sql_injection(email) or is_sql_injection(Fname) or is_sql_injection(Lname):
            return jsonify(error="Invalid Input")

        new_user = User(username=username, password=password, email=email, firstname=Fname, lastname=Lname)
        db.session.add(new_user)
        db.session.commit()
        return jsonify(message="Registration successful. You can now login.", success=True)

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        print("username: " + username + " password: " + password)
        print("is_sql_injection(username): " + str(is_sql_injection(username)) + " is_sql_injection(password): " + str(is_sql_injection(password)))
        if is_sql_injection(username) and is_sql_injection(password):
            return jsonify(error="Invalid Input", success=False)
        else:
            user = User.query.filter_by(username=username, password=password).first()
            if user:
                return jsonify(message="Login successful!", success=True)
            else:
                return jsonify(error="Invalid credentials. Please try again.", success=False)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)


