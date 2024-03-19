from sqlmodel import Session
from database import Enrolment, Student, engine


def main():
    """Main function"""
    session = Session(engine)
    with open('students.csv', 'r', encoding='utf8') as f:
        students = f.readlines()
        for (i, name) in enumerate(students):
            student = Student(name=name.strip())
            session.add(student)
    session.commit()
    for i in range(1, len(students) + 1):
        enrolment = Enrolment(student_id=i, course_id=1)
        session.add(enrolment)
    session.commit()
    session.close()


if __name__ == '__main__':
    main()
