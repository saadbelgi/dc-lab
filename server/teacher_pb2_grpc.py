# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc

import teacher_pb2 as teacher__pb2


class TeacherStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.Register = channel.unary_unary(
                '/Teacher/Register',
                request_serializer=teacher__pb2.TeacherData.SerializeToString,
                response_deserializer=teacher__pb2.RegisterResponse.FromString,
                )
        self.ShowAll = channel.unary_unary(
                '/Teacher/ShowAll',
                request_serializer=teacher__pb2.Temp.SerializeToString,
                response_deserializer=teacher__pb2.Teachers.FromString,
                )


class TeacherServicer(object):
    """Missing associated documentation comment in .proto file."""

    def Register(self, request, context):
        """Registers a teacher
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def ShowAll(self, request, context):
        """Sends details of all teachers
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_TeacherServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'Register': grpc.unary_unary_rpc_method_handler(
                    servicer.Register,
                    request_deserializer=teacher__pb2.TeacherData.FromString,
                    response_serializer=teacher__pb2.RegisterResponse.SerializeToString,
            ),
            'ShowAll': grpc.unary_unary_rpc_method_handler(
                    servicer.ShowAll,
                    request_deserializer=teacher__pb2.Temp.FromString,
                    response_serializer=teacher__pb2.Teachers.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'Teacher', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class Teacher(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def Register(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/Teacher/Register',
            teacher__pb2.TeacherData.SerializeToString,
            teacher__pb2.RegisterResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def ShowAll(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/Teacher/ShowAll',
            teacher__pb2.Temp.SerializeToString,
            teacher__pb2.Teachers.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)