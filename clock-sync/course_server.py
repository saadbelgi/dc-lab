# saved as greeting-server.py
from shutil import copymode
from urllib.request import FancyURLopener
import Pyro5.api
from Pyro5 import server
import mysql.connector
import threading
from timeit import default_timer as timer
from dateutil import parser
import threading
import datetime
import socket 
import time


# client thread function used to send time at client side
def startSendingTime(slave_client):

	while True:
		# provide server with clock time at the client
		slave_client.send(str(
					datetime.datetime.now()).encode())

		print("Recent time sent successfully",
										end = "\n\n")
		time.sleep(5)


# client thread function used to receive synchronized time
def startReceivingTime(slave_client):

	while True:
		# receive data from the server
		Synchronized_time = parser.parse(
						slave_client.recv(1024).decode())

		print("Synchronized time at the client is: " + \
									str(Synchronized_time),
									end = "\n\n")


# function used to Synchronize client process time
def initiateSlaveClient(port = 8080):

	slave_client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)		 
	
	# connect to the clock server on local computer 
	slave_client.connect(('127.0.0.1', port)) 

	# start sending time to server 
	print("Starting to send time to server\n")
	send_time_thread = threading.Thread(
					target = startSendingTime,
					args = (slave_client, ))
	send_time_thread.start()


	# start receiving synchronized from server
	print("Starting to receiving " + \
						"synchronized time from server\n")
	receive_time_thread = threading.Thread(
					target = startReceivingTime,
					args = (slave_client, ))
	receive_time_thread.start()



def main():
    # MySQL database configuration
    host = "localhost"
    user = "springstudent"
    password = "springstudent"
    database = "dc_exp2"


    @Pyro5.api.expose
    class CourseDAO(object):
        def __init__(self):
            connection = mysql.connector.connect(
                host=host,
                user=user,
                password=password,
                database=database
            )
            if connection.is_connected():
                print("Connected to the database!")
                self.connection = connection
                self.cursor = connection.cursor()

        def insert(self, name='name', code='code', faculty=1):
            self.cursor.execute(f'insert into course (course_name, course_code, faculty) values ("{name}", "{code}", "{faculty}")')
            self.connection.commit()
            return f'Course inserted with ID {self.cursor.lastrowid}'

        def show_all(self, faculty=1):
            self.cursor.execute(
                f'select course_id, course_name, course_code from course where faculty={faculty}')
            result = []
            for row in self.cursor: # type: ignore
                result.append(
                    {'course_id': row[0], 'course_name': row[1], 'course_code': row[2]})
            return result

        def __del__(self):
            if self.cursor:
                self.cursor.close()
            if self.connection:
                self.connection.close()


    daemon = server.Daemon()         # make a Pyro daemon
    ns = Pyro5.api.locate_ns()             # find the name server
    # register the greeting maker as a Pyro object
    uri = daemon.register(CourseDAO)
    # register the object with a name in the name server
    ns.register("rmi.CourseDAO", uri)

    print("Ready.")
    # start the event loop of the server to wait for calls
    daemon.requestLoop()

if __name__ == '__main__':
    # run general server logic
    threading.Thread(target=main).start()
    # initialize the Slave / Client
    initiateSlaveClient(port = 8080)
