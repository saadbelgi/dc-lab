import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/modal";
import Card from "./Card";
import { BiCategoryAlt } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { useAppDispatch } from "../app/store";
import { createUser } from "../app/features/UserSlice";
import { useState } from "react";

interface UserModalProps {
  isUserModalOpen: boolean;
  onUserModalClose: () => void;
  role: string;
}

const UserModal = ({
  isUserModalOpen,
  onUserModalClose,
  role,
}: UserModalProps) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const generateRandomID = () => {
    return Math.floor(Math.random() * 9000) + 1000;
  };

  const handleCreate = () => {
    dispatch(
      createUser({
        id: generateRandomID().toString(),
        name: name,
        role: role,
        password: password,
      })
    );
    onUserModalClose();
  };

  return (
    <>
      <Modal
        isOpen={isUserModalOpen}
        onClose={onUserModalClose}
        size="md"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay
          className="bg-[#000000A0] !z-[1001]]"
          backdropFilter="blur(10px)"
        />
        <ModalContent className="!z-[1002] !m-auto !w-max min-w-[240px] !max-w-[85%] top-[3vh] md:top-[5vh]">
          <ModalCloseButton className="right-5 top-5 absolute z-[5000] text-gray-700 hover:text-gray-900" />
          <ModalBody className="overflow-x-hidden">
            <Card
              extra={`px-[30px] pt-[35px] pb-[40px] w-[45vw] md:w-[75vw] lg:w-[35vw] md-max:h-[90vh] max-w-[950px] flex flex-col !z-[1004] overflow-y-auto overflow-x-hidden`}
              style={{ backgroundColor: "white" }}
            >
              <h1
                className={`text-2xl text-gray-800 font-bold text-center mb-6`}
              >
                Create User
              </h1>
              <div className={`my-2`}>
                <div className="relative flex-col mb-4">
                  <div className="flex items-center">
                    <label
                      htmlFor="name"
                      className={`text-gray-700 font-semibold ml-2`}
                    >
                      Name:
                    </label>
                  </div>
                  <input
                    id="name"
                    value={name}
                    className="relative mt-2 flex h-12 w-full items-center justify-center rounded-lg border bg-gray-100 p-3 text-sm outline-none placeholder-gray-400 shadow-sm text-slate-800"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="relative flex-col">
                  <div className="flex items-center ml-2">
                    <label
                      htmlFor="category"
                      className={`text-gray-700 font-semibold ml-1`}
                    >
                      Password:
                    </label>
                  </div>
                  <input
                    id="category"
                    value={password}
                    className="relative mt-2 flex h-12 w-full items-center justify-center rounded-lg border bg-gray-100 p-3 text-sm outline-none placeholder-gray-400 shadow-sm text-slate-800"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={() => handleCreate()}
                  className={`flex items-center justify-center w-1/2 h-12 rounded-lg bg-slate-800 text-white font-bold transition duration-200 hover:bg-slate-800 me-2`}
                >
                  Create
                </button>
              </div>
            </Card>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserModal;
