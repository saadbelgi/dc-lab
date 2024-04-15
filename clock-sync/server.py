import mysql.connector
import socket
import json
import bcrypt
import grpc
import teacher_pb2
import teacher_pb2_grpc
import Pyro5.api
from functools import reduce
from dateutil import parser
import threading
import datetime
import socket
import time
# from rich import print
# from rich.layout import Layout
# from rich.panel import Panel

# layout = Layout()
# layout.split_row(
#     Layout(name="left"),
#     Layout(name="right"),
# )
# # print(layout)

# layout["left"].update(
#     Panel("The mystery of life isn't a problem to solve, but a reality to experience.")
    
# )
# print(layout)


# datastructure used to store client address and clock data
client_data = {}


''' nested thread function used to receive
	clock time from a connected client '''


def startReceivingClockTime(connector, address):

	while True:
		# receive clock time
		clock_time_string = connector.recv(1024).decode()
		clock_time = parser.parse(clock_time_string)
		clock_time_diff = datetime.datetime.now() - \
												clock_time

		client_data[address] = {
					"clock_time": clock_time,
					"time_difference": clock_time_diff,
					"connector": connector
					}

		print("Client Data updated with: " + str(address),
											end="\n\n")
		time.sleep(5)


''' master thread function used to open portal for
	accepting clients over given port '''


def startConnecting(master_server):

	# fetch clock time at slaves / clients
	while True:
		# accepting a client / slave clock client
		master_slave_connector, addr = master_server.accept()
		slave_address = str(addr[0]) + ":" + str(addr[1])

		print(slave_address + " got connected successfully")
		time.sleep(2)
		current_thread = threading.Thread(
						target=startReceivingClockTime,
						args=(master_slave_connector,
										slave_address, ))
		current_thread.start()


# subroutine function used to fetch average clock difference
def getAverageClockDiff():

	current_client_data = client_data.copy()

	time_difference_list = list(client['time_difference']
								for client_addr, client
									in client_data.items())

	sum_of_clock_difference = sum(time_difference_list,
								datetime.timedelta(0, 0))

	average_clock_difference = sum_of_clock_difference \
										/ len(client_data)

	return average_clock_difference


''' master sync thread function used to generate
	cycles of clock synchronization in the network '''


def synchronizeAllClocks():

	while True:

		print("New synchronization cycle started.")
		print("Number of clients to be synchronized: " +
									str(len(client_data)))

		if len(client_data) > 0:

			average_clock_difference = getAverageClockDiff()

			for client_addr, client in client_data.items():
				try:
					synchronized_time = \
						datetime.datetime.now() + \
									average_clock_difference

					client['connector'].send(str(
							synchronized_time).encode())

				except Exception as e:
					print("Something went wrong while " +
						"sending synchronized time " +
						"through " + str(client_addr))

		else:
			print("No client data." +
						" Synchronization not applicable.")

		print("\n\n")

		time.sleep(5)


# function used to initiate the Clock Server / Master Node
def initiateClockServer(port=8080):

	master_server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	master_server.setsockopt(socket.SOL_SOCKET,
								socket.SO_REUSEADDR, 1)

	print("Socket at master node created successfully\n")

	master_server.bind(('', port))

	# Start listening to requests
	master_server.listen(10)
	print("Clock server started...\n")

	# start making connections
	print("Starting to make connections...\n")
	master_thread = threading.Thread(
						target=startConnecting,
						args=(master_server, ))
	master_thread.start()

	# start synchronization
	print("Starting synchronization parallelly...\n")
	sync_thread = threading.Thread(
						target=synchronizeAllClocks,
						args=())
	sync_thread.start()


def main():
    # MySQL database configuration
    host = "localhost"
    user = "springstudent"
    password = "springstudent"
    database = "dc_exp2"

    # session
    admins = set()
    loggedin_teachers = set()

    course_dao = None

    # Server configuration
    host = "127.0.0.1"  # localhost
    port = 12345         # port to bind to
    # Create a socket object
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Bind the socket to a specific address and port
    server_socket.bind((host, port))

    # Listen for incoming connections
    server_socket.listen()

    print(f"Server listening on {host}:{port}")

    # Establishing the connection
    try:
        connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database
        )

        if connection.is_connected():
            print("Connected to the database!")

            # Perform database operations here
            # For example, you can create a cursor and execute SQL queries
            cursor = connection.cursor()

            while True:
                # Wait for a client to connect
                client_socket, client_address = server_socket.accept()
                print(f"Accepted connection from {client_address}")
                while True:
                    # Receive and send back data
                    rcvd_data = client_socket.recv(1024)
                    send_message = "Functioning not implemented"
                    data = json.loads(rcvd_data.decode())
                    print(f"Received data: {data}")

                    if data['id'] not in admins and data['id'] not in loggedin_teachers:
                        if 'role' not in data:
                            send_message = "Unauthorized access"
                        elif data['role'] != 1:
                            cursor.execute(
                                "select id, password, role from user where id=%s", (data['id'], ))
                            row = cursor.fetchone()
                            print('row:')
                            print(row)
                            if row is None:
                                send_message = "Invalid login"
                            elif bcrypt.checkpw(data['password'].encode(), bytes(row[1])):
                                if data['role'] == 2 and row[2] == 'faculty':
                                    loggedin_teachers.add(row[0])
                                    send_message = "Logged in successfully"
                                elif data['role'] == 3 and row[2] == 'administrator':
                                    admins.add(row[0])
                                    send_message = "Logged in successfully"
                                else:
                                    send_message = "Invalid login"
                            else:
                                send_message = "Invalid login"
                    elif data['task'] == 3:
                        if data['id'] in admins:
                            admins.remove(data['id'])
                        elif data['id'] in loggedin_teachers:
                            loggedin_teachers.remove(data['id'])
                        send_message = "Logged out successfully"
                    elif data['task'] == 1:
                        # RPC to another server
                        with grpc.insecure_channel("localhost:50051") as channel:
                            stub = teacher_pb2_grpc.TeacherStub(channel)
                            request = teacher_pb2.TeacherData(
                                name=data['name'], phone_no=data['phone_no'], password=data['password'])
                            send_message = stub.Register(request).message
                    elif data['task'] == 2:
                        # RPC to another server
                        with grpc.insecure_channel("localhost:50051") as channel:
                            stub = teacher_pb2_grpc.TeacherStub(channel)
                            request = teacher_pb2.Temp()
                            teachers = stub.ShowAll(request).data
                            result = []
                            for i in teachers:
                                result.append(
                                    {'id': i.id, 'name': i.name, 'phone_no': i.phone_no})
                            send_message = json.dumps(result)
                    elif data['task'] == 4:
                        if course_dao is None:
                            course_dao = Pyro5.api.Proxy(
                                "PYRONAME:rmi.CourseDAO")
                        send_message = course_dao.insert(
                            name=data['course_name'], code=data['course_code'], faculty=data['id'])
                    elif data['task'] == 5:
                        if course_dao is None:
                            course_dao = Pyro5.api.Proxy(
                                "PYRONAME:rmi.CourseDAO")
                        send_message = json.dumps(
                            course_dao.show_all(faculty=data['id']))

                    # Echo back the received data
                    client_socket.sendall(send_message.encode())
                # close the connection
                client_socket.close()

    except mysql.connector.Error as e:
        print(f"Error connecting to the database: {e}")

    finally:
        if connection.is_connected():
            # Closing the connection in the finally block to ensure it's always closed
            connection.close()
            print("Connection closed.")


# Driver function
if __name__ == '__main__':
    # run general server logic
    threading.Thread(target=main).start()
    # Trigger the Clock Server
    initiateClockServer(port=8080)