
import flask as f
import flask_sqlalchemy as fsa
import re
from flask_cors import CORS


app = f.Flask(__name__)
CORS(app) # enable cross origin resource sharing (for now only for testing purposes!)
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


class User(db.Model):
    __tablename__ = 'users' 
    
    username = db.Column(db.String(80), unique=True, nullable=False, primary_key=True)
    password = db.Column(db.String(200), nullable=False)
    email=db.Column(db.String(80),unique=True, nullable=False)
    firstname=db.Column(db.String(80), nullable=False)
    lastname= db.Column(db.String(80),nullable=False)

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
                return f.jsonify(message="Login successful!", success=True)
            else:
                return f.jsonify(error="Invalid credentials. Please try again.", success=False)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)


