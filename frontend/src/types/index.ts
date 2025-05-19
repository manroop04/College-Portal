export interface CourseAttendance {
  courseName: string;
  attendancePercentage: number;
  totalClasses: number;
  attendedClasses: number;
  absentClasses: number;
}

export interface Student {
  id: string;
  name: string;
  profileImage: string;
}

export interface TimeSlot {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  subject?: string;
  location?: string;
}
export interface BaseItem {
  id: string;
  category: string;
  name: string;
  date: string;
}

export interface LostItem extends BaseItem {
  description: string;
  image: string;
  contact: string;
  location: string;
  owner: string;
  enrollment: string;
  email: string;
}

export interface FoundItem extends BaseItem {
  description: string;
  image: string;
  contact: string;
  foundLocation: string;
  foundBy: string;
  enrollment: string;
  email: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  teacher: string;
  backgroundImage: string;
  assignments: Assignment[];
}

export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  instructions: string;
  attachments: string[];
  postedDate: string;
  points: number;
  submitted: boolean;
}