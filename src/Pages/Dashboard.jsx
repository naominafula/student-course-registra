import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { BookOpen, User, Calendar, Award } from "lucide-react";
import { Link } from "react-router-dom";

const COURSE_LIST = [
  { id: "CS101", name: "Introduction to Computer Science", instructor: "Dr. Alice", credits: 3 },
  { id: "CS201", name: "Data Structures & Algorithms", instructor: "Prof. Bob", credits: 4 },
  { id: "CS301", name: "Advanced Web Frameworks", instructor: "Dr. Charlie", credits: 3 }
];

const COURSE_MAP = COURSE_LIST.reduce((map, course) => {
  map[course.id] = course;
  return map;
}, {});

export default function Dashboard() {
  const { user } = useAuth();
  const [registeredCount, setRegisteredCount] = useState(0);
  const [registeredCourses, setRegisteredCourses] = useState([]);

  useEffect(() => {
    
    let clearTimer;

    if (!user) {
      clearTimer = setTimeout(() => {
        console.debug("Dashboard: clearing registered courses (no user)");
        setRegisteredCount(0);
        setRegisteredCourses([]);
      }, 600);

      return () => clearTimeout(clearTimer);
    }

    const docRef = doc(db, "registrations", user.uid);
    
    try {
      const key = `registrations_${user.uid}`;
      const cached = localStorage.getItem(key);
      if (cached) {
        const parsed = JSON.parse(cached);
        setRegisteredCourses(parsed);
        setRegisteredCount(parsed.length || 0);
        console.debug("Dashboard: loaded cached courses from localStorage", parsed);
      }
    } catch (e) {
      console.debug("Dashboard: failed to read cached courses", e);
    }

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const rawCourses = docSnap.data().courses || [];
          const normalizedCourses = rawCourses.map((course) => {
            if (typeof course === "string") {
              return COURSE_MAP[course] || { id: course, name: course };
            }
            return course;
          });

          console.debug("Dashboard: snapshot update", normalizedCourses);
          setRegisteredCourses(normalizedCourses);
          setRegisteredCount(normalizedCourses.length);

          
          try {
            localStorage.setItem(`registrations_${user.uid}`, JSON.stringify(normalizedCourses));
          } catch (e) {
            console.debug("Dashboard: failed to write cache", e);
          }
        } else {
          console.debug("Dashboard: snapshot exists() === false");
          setRegisteredCount(0);
          setRegisteredCourses([]);
          try {
            localStorage.removeItem(`registrations_${user.uid}`);
          } catch (e) {
            
          }
        }
      },
      (error) => {
        
        console.error("registrations snapshot error:", error);
      }
    );

    return () => {
      if (clearTimer) clearTimeout(clearTimer);
      unsubscribe();
    };
  }, [user]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 w-full space-y-8">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
          <img src={user?.photoURL} alt="Profile" className="w-16 h-16 rounded-full border-2 border-indigo-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.displayName}!</h1>
            <p className="text-gray-500 text-sm">Academic Portal Session Active</p>
          </div>
        </div>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <Calendar size={16} />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Registered Classes</p>
            <h3 className="text-2xl font-bold text-gray-900">{registeredCount} Courses</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-xl text-green-600">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Academic Standing</p>
            <h3 className="text-2xl font-bold text-gray-900">Good Standing</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <User size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Student ID Link</p>
            <h3 className="text-xs font-mono text-gray-600 truncate max-w-[180px]">{user?.uid}</h3>
          </div>
        </div>
      </div>

      
      <div className="bg-indigo-900 rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-xl font-bold">Ready to adjust your schedule?</h2>
          <p className="text-indigo-200 text-sm mt-1">Add or drop course modules instantly for the current academic term.</p>
        </div>
        <Link to="/courses" className="bg-white text-indigo-900 px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-50 transition shadow-sm text-center w-full md:w-auto">
          Manage Enrollments
        </Link>
      </div>

      {registeredCourses.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Registered Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {registeredCourses.map((course) => (
              <div key={course.id || course.code || course.name} className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 hover:shadow-md transition">
                <div className="flex items-start gap-3">
                  <BookOpen className="text-indigo-600 flex-shrink-0 mt-1" size={20} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{course.code || course.id || course.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{course.name || course.title || course.id}</p>
                    {course.instructor && <p className="text-xs text-gray-500 mt-2">Instructor: {course.instructor}</p>}
                    {course.credits && <p className="text-xs text-indigo-600 font-medium mt-1">{course.credits} Credits</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}