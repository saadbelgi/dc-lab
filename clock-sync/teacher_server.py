from concurrent import futures
from sqlite3 import connect
import mysql.connector
import json
import bcrypt

import grpc
import teacher_pb2
import teacher_pb2_grpc
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

    class TeacherServicer(teacher_pb2_grpc.TeacherServicer):
        """Provides methods that implement functionality of Teacher server."""
        def __init__(self):
            try:
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
            except mysql.connector.Error as e:
                print(f"Error connecting to the database: {e}")

        def Register(self, request, context):
            hash = bcrypt.hashpw(request.password.encode(), bcrypt.gensalt()).hex()
            statement = f'insert into user (name, phone_no, role, password) values ("{request.name}", "{request.phone_no}", "faculty", X\'{hash}\')'
            self.cursor.execute(statement)
            self.connection.commit()
            teacher_id = self.cursor.lastrowid
            return teacher_pb2.RegisterResponse(message=f'Registered successfully with id {teacher_id}')

        def ShowAll(self, request, context):
            self.cursor.execute('select id, name, phone_no from user where role="faculty"')
            result = []
            for row in self.cursor: # type: ignore
                result.append(teacher_pb2.Teachers.TeacherData(id=row[0], name=row[1], phone_no=row[2]))
            return teacher_pb2.Teachers(data=result)
        
        def __del__(self):
            if self.cursor:
                self.cursor.close()
            if self.connection:
                self.connection.close()

    def serve():
        server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
        teacher_pb2_grpc.add_TeacherServicer_to_server(TeacherServicer(), server)
        server.add_insecure_port("[::]:50051")
        server.start()
        server.wait_for_termination()

    serve()


if __name__ == "__main__":
    # run general server logic
    threading.Thread(target=main).start()
    # initialize the Slave / Client
    initiateSlaveClient(port = 8080)
    