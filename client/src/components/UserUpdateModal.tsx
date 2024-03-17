import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/modal";
import Card from "./Card";
import { MdCheckCircle } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { useAppDispatch } from "../app/store";
import { updateUser } from "../app/features/UserSlice";
import { useState } from "react";

type User = {
  id: string;
  name: string;
  role: string;
  password: string;
  actions: string | undefined;
};

interface userUpdateModalProps {
  user: User;
  isUserUpdateModalOpen: boolean;
  onUserUpdateModalClose: () => void;
  updateData: (id: string, name: string, password: string) => void;
}

const UserUpdateModal = ({
  isUserUpdateModalOpen,
  onUserUpdateModalClose,
  user,
  updateData,
}: userUpdateModalProps) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(user?.name);
  const [password, setPassword] = useState(user?.password);

  const handleBtnClick = () => {
    updateData(user?.id, name, password);
    setTimeout(() => {
      dispatch(updateUser({ id: user?.id, name: name, password: password }));
    }, 10000);
    onUserUpdateModalClose();
  };

  return (
    <>
      <Modal
        isOpen={isUserUpdateModalOpen}
        onClose={onUserUpdateModalClose}
        size="md"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay
          className="bg-[#000000A0] !z-[1001]]"
          backdropFilter="blur(10px)"
        />
        <ModalContent className="!z-[1002] !m-auto !w-max min-w-[340px] !max-w-[85%] top-[3vh] md:top-[5vh]">
          <ModalCloseButton className="right-5 top-5 absolute z-[5000] text-navy-700  hover:text-navy-900" />
          <ModalBody className=" overflow-x-hidden">
            <Card
              extra="px-[30px] w-[340px] pt-[35px] pb-[40px] md-max:h-[90vh] flex flex-col !z-[1004] overflow-y-auto overflow-x-hidden"
              style={{ backgroundColor: "white" }}
            >
              <h1
                className={`text-2xl text-slate-700 font-bold text-center mb-6`}
              >
                Teacher ID - {user?.id}
              </h1>

              <div className="mb-4">
                <label htmlFor="name" className="text-sm text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b-[1px] text-slate-800 border-gray-200 focus:outline-none focus:border-slate-800"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="text-sm text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b-[1px] border-gray-200 focus:outline-none focus:border-slate-800 text-slate-800"
                />
              </div>
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => handleBtnClick()}
                  className="flex items-center justify-center w-1/2 h-12 rounded-lg bg-slate-800 text-white font-bold transition duration-200 hover:bg-slate-800 me-2"
                >
                  <MdCheckCircle className="text-xl me-2" />
                  Update
                </button>
                <button
                  onClick={onUserUpdateModalClose}
                  className="flex items-center justify-center w-1/2 h-12 rounded-lg bg-red-500 text-white font-bold transition duration-200 hover:bg-red-600"
                >
                  <IoMdClose className="text-xl me-2" />
                  Cancel
                </button>
              </div>
            </Card>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserUpdateModal;
