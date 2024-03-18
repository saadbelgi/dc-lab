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
import { useState } from "react";
import { updateCourse } from "../app/features/CoursesSlice";

type Course = {
  code: string;
  name: string;
  duration: string;
  teacher: string;
  actions: string | undefined;
};

interface CourseUpdateModalProps {
  course: Course;
  isCourseUpdateModalOpen: boolean;
  onCourseUpdateModalClose: () => void;
  updateData: (code: string, name: string, duration: string) => void;
}

const CourseUpdateModal = ({
  isCourseUpdateModalOpen,
  onCourseUpdateModalClose,
  course,
  updateData,
}: CourseUpdateModalProps) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState(course?.name);
  const [duration, setDuration] = useState(course?.duration);

  const handleBtnClick = () => {
    updateData(course?.code, name, duration);
    setTimeout(() => {
      dispatch(
        updateCourse({ code: course?.code, name: name, duration: duration })
      );
    }, 1000);
    onCourseUpdateModalClose();
  };

  return (
    <>
      <Modal
        isOpen={isCourseUpdateModalOpen}
        onClose={onCourseUpdateModalClose}
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
                Course Code - {course?.code}
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
                  type="text"
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
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
                  onClick={onCourseUpdateModalClose}
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

export default CourseUpdateModal;
