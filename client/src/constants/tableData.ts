import { Course } from "../app/features/CoursesSlice";
import { User } from "../app/features/UsersSlice";

export const userData: User[] = [
  {
    id: "1111",
    name: "AAAA",
    role: "admin",
    password: "password",
  },
  {
    id: "2222",
    name: "BBBB",
    role: "teacher",
    password: "password",
  },
  {
    id: "3333",
    name: "CCCC",
    role: "teacher",
    password: "password",
  },
  {
    id: "4444",
    name: "DDDD",
    role: "teacher",
    password: "password",
  },
  {
    id: "5555",
    name: "EEEE",
    role: "student",
    password: "password",
  },
];

export const courseData: Course[] = [
  {
    name: "Computer Networks",
    code: "CO301",
    teacher: "BBBB",
    duration: "40 hours",
  },
  {
    name: "Data Structures",
    code: "CO302",
    teacher: "CCCC",
    duration: "60 hours",
  },
  {
    name: "Operating Systems",
    code: "CO303",
    teacher: "DDDD",
    duration: "56 hours",
  },
  {
    name: "Algorithms",
    code: "CO304",
    teacher: "BBBB",
    duration: "45 hours",
  },
  {
    name: "Database Management Systems",
    code: "CO305",
    teacher: "CCCC",
    duration: "50 hours",
  },
  {
    name: "Software Engineering",
    code: "CO306",
    teacher: "DDDD",
    duration: "55 hours",
  },
  {
    name: "Computer Graphics",
    code: "CO307",
    teacher: "BBBB",
    duration: "30 hours",
  },
  {
    name: "Artificial Intelligence",
    code: "CO308",
    teacher: "CCCC",
    duration: "70 hours",
  },
  {
    name: "Machine Learning",
    code: "CO309",
    teacher: "DDDD",
    duration: "65 hours",
  },
  {
    name: "Web Development",
    code: "CO310",
    teacher: "BBBB",
    duration: "40 hours",
  },
  {
    name: "Mobile Application Development",
    code: "CO311",
    teacher: "CCCC",
    duration: "50 hours",
  },
  {
    name: "Internet of Things",
    code: "CO312",
    teacher: "DDDD",
    duration: "45 hours",
  },
  {
    name: "Blockchain",
    code: "CO313",
    teacher: "BBBB",
    duration: "60 hours",
  },
  {
    name: "Cyber Security",
    code: "CO314",
    teacher: "CCCC",
    duration: "55 hours",
  },
  {
    name: "Cloud Computing",
    code: "CO315",
    teacher: "DDDD",
    duration: "70 hours",
  },
];
