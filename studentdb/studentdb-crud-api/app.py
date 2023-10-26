import psycopg2
from flask_cors import CORS
from flask import Flask, request, jsonify

app = Flask(__name__)
CORS(app, resources={"/api/*":{"origins":"*"}})

def db_connect():
    conn = psycopg2.connect(
        database='studentdb',
        host='postgresDB',
        user='karthikeyan',
        password='karthikeyan',
        port=5432
    )
    return conn


def create_table():
    conn = db_connect()
    cur = conn.cursor()
    cur.execute('''CREATE TABLE IF NOT EXISTS students(
        student_id serial PRIMARY KEY,
        student_name VARCHAR(50) NOT NULL,
        student_department VARCHAR(10) NOT NULL,
        student_cgpa FLOAT
    );''')
    conn.commit()
    cur.close()
    conn.close()


def name_formatter(name):
    delimiters = [".", " "]
    for delimiter in delimiters:
        name = " ".join(word.capitalize() for word in name.split(delimiter))
    return name


def cgpa_formatter(n):
    return round(float(n),2)


@app.route('/api/add_student', methods=['POST'])
def add_student():
    conn = db_connect()
    cur = conn.cursor()
    name = name_formatter(request.form.get('name'))
    dept = request.form.get('dept').upper()
    cgpa = cgpa_formatter(request.form.get('cgpa'))
    cur.execute('''INSERT INTO students(student_name,student_department,student_cgpa) VALUES (%s,%s,%s);''', (name, dept, cgpa))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify("Registered")


@app.route('/api/student_list', methods=['GET'])
def get_students():
    conn = db_connect()
    cur = conn.cursor()
    cur.execute('''SELECT * FROM students;''')
    rows = cur.fetchall()   
    header = list(desc[0] for desc in cur.description)
    cur.close()
    conn.close()
    students = list()
    for row in rows:
        student = dict()
        student[header[0]] = row[0]
        student[header[1]] = row[1]
        student[header[2]] = row[2]
        student[header[3]] = row[3]
        students.append(student)
    return jsonify(students)


@app.route('/api/delete_student/<string:sid>', methods=['POST'])
def delete_student(sid):
    conn = db_connect()
    cur = conn.cursor()
    cur.execute('DELETE FROM students WHERE student_id = %s', (sid))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify("Deleted")


@app.route('/api/update_student', methods=['POST'])
def updates():
    conn = db_connect()
    cur = conn.cursor()
    sid = request.form.get('sid')
    name = name_formatter(request.form.get('name'))
    dept = request.form.get('dept').upper()
    cgpa = cgpa_formatter(request.form.get('cgpa'))
    cur.execute('''UPDATE students SET student_name=%s, student_department=%s, student_cgpa=%s WHERE student_id=%s;''', (name, dept, cgpa, sid))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify("Updated")


@app.route('/api/drop_students')
def drop_table():
    conn = db_connect()
    cur = conn.cursor()
    cur.execute('''DROP TABLE students;''')
    conn.commit()
    cur.close()
    conn.close()
    create_table()
    return jsonify("Dropped")


if __name__ == '__main__':
    create_table()
    app.run(debug=True, port=int(8000), host="0.0.0.0")
