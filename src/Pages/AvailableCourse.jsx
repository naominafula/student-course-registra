import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const COURSE_LIST = [
  { id: "CS101", name: "Introduction to Computer Science", instructor: "Dr. Alice", credits: 3 },
  { id: "CS201", name: "Data Structures & Algorithms", instructor: "Prof. Bob", credits: 4 },
  { id: "CS301", name: "Advanced Web Frameworks", instructor: "Dr. Charlie", credits: 3 }
];

const COURSE_MAP = COURSE_LIST.reduce((map, course) => {
  map[course.id] = course;
  return map;
}, {});

export default function AvailableCourses() {
  const { user } = useAuth();
  const [registeredCourses, setRegisteredCourses] = useState([]);

  
  useEffect(() => {
    if (!user?.uid) {
      setRegisteredCourses([]);
      return;
    }

    const fetchRegistrations = async () => {
      const docRef = doc(db, "registrations", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const rawCourses = docSnap.data().courses || [];
        const normalized = rawCourses.map((item) => {
          if (typeof item === "string") {
            return COURSE_MAP[item] || { id: item, name: item };
          }
          return item;
        });
        setRegisteredCourses(normalized);
      }
    };
    fetchRegistrations();
  }, [user?.uid]);

  const toggleRegister = async (courseId) => {
    if (!user?.uid) return;

    const isRegistered = registeredCourses.some((course) => course.id === courseId);
    const updated = isRegistered
      ? registeredCourses.filter((course) => course.id !== courseId)
      : [...registeredCourses, COURSE_MAP[courseId] || { id: courseId, name: courseId }];

    setRegisteredCourses(updated);
    
    await setDoc(doc(db, "registrations", user.uid), { courses: updated }, { merge: true });
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Available Registrations</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COURSE_LIST.map((course) => {
          const isRegistered = registeredCourses.some((item) => item.id === course.id);
          return (
            <div key={course.id} className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{course.id}</span>
                <h3 className="font-semibold text-lg text-gray-900 mt-2">{course.name}</h3>
                <p className="text-sm text-gray-500 mb-4">Instructor: {course.instructor}</p>
              </div>
              <button
                onClick={() => toggleRegister(course.id)}
                className={`w-full py-2 px-4 rounded-lg font-medium transition ${
                  isRegistered
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {isRegistered ? "Drop Course" : "Register"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}