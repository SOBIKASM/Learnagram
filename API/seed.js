// seed.js — run with: node seed.js
// Populates all collections with properly linked data
// Default password for all accounts: password123

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// ── Schemas ──────────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  user_id:        { type: String, required: true, unique: true },
  username:       { type: String, required: true, unique: true },
  password:       { type: String, required: true },
  name:           { type: String },
  email:          { type: String },
  department:     { type: String },
  year:           { type: Number },
  semester:       { type: Number, default: 1 },
  bio:            { type: String },
  isPrivate:      { type: Boolean, default: false },
  followers:      [{ type: String }],
  following:      [{ type: String }],
  followRequests: [{ type: String }],
  posts:          [{ type: String }]
}, { timestamps: true });

const courseSchema = new mongoose.Schema({
  regulation:  { type: String, required: true },
  department:  { type: String, required: true },
  semester:    { type: Number, required: true },
  course_id:   { type: String, required: true, unique: true },
  course_name: { type: String, required: true },
  L: { type: Number, default: 0 },
  T: { type: Number, default: 0 },
  P: { type: Number, default: 0 },
  C: { type: Number, required: true }
});

const classroomSchema = new mongoose.Schema({
  classroom_id: { type: String, required: true, unique: true },
  name:         { type: String, required: true },
  mentor_id:    { type: String, required: true },
  student_ids:  [{ type: String }],
  course_id:    { type: String }
}, { timestamps: true });

const assignmentSchema = new mongoose.Schema({
  assignment_id:     { type: String, required: true, unique: true },
  classroom_id:      { type: String, required: true },
  mentor_id:         { type: String, required: true },
  title:             { type: String, required: true },
  description:       { type: String },
  due_date:          { type: Date },
  enrolled_students: [{ type: String }],
  submissions: [{
    student_id:   String,
    file_url:     String,
    file_name:    String,
    submitted_at: { type: Date, default: Date.now },
    status:       { type: String, enum: ['Pending', 'Graded'], default: 'Pending' },
    score:        Number,
    remarks:      String
  }],
  points: { type: Number, default: 100 }
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
  classroom_id: { type: String, required: true },
  sender_id:    { type: String, required: true },
  content:      { type: String, required: true },
  type:         { type: String, enum: ['text', 'assignment', 'notification', 'file'], default: 'text' },
  file_url:     String,
  file_name:    String,
  file_type:    String
}, { timestamps: true });

const directMessageSchema = new mongoose.Schema({
  sender_id:   { type: String, required: true },
  receiver_id: { type: String, required: true },
  content:     { type: String, required: true },
  type:        { type: String, enum: ['text', 'file'], default: 'text' },
  file_url:    String,
  file_name:   String,
  file_type:   String
}, { timestamps: true });

const notificationSchema = new mongoose.Schema({
  user_id:      { type: String, required: true },
  type:         { type: String, enum: ['message', 'assignment', 'like', 'comment', 'follow', 'assignment_graded'], required: true },
  content:      { type: String, required: true },
  read:         { type: Boolean, default: false },
  reference_id: { type: String }
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  post_id:    { type: String, required: true, unique: true },
  user_id:    { type: String, required: true },
  caption:    { type: String },
  image_url:  { type: String },
  visibility: { type: String, enum: ['Public', 'Private'], default: 'Public' },
  created_at: { type: Date, default: Date.now },
  likes:      [{ type: String }],
  comments: [{
    comment_id: { type: String, required: true },
    user_id:    { type: String, required: true },
    username:   { type: String },
    text:       { type: String, required: true },
    created_at: { type: Date, default: Date.now }
  }]
});

const commentSchema = new mongoose.Schema({
  comment_id: { type: String, required: true, unique: true },
  post_id:    { type: String, required: true },
  user_id:    { type: String, required: true },
  text:       { type: String },
  created_at: { type: Date, default: Date.now }
});

// ── Models ───────────────────────────────────────────────────────────────────

const User         = mongoose.model('User',          userSchema);
const Course       = mongoose.model('Course',        courseSchema);
const Classroom    = mongoose.model('Classroom',     classroomSchema);
const Assignment   = mongoose.model('Assignment',    assignmentSchema);
const Message      = mongoose.model('Message',       messageSchema);
const DirectMsg    = mongoose.model('DirectMessage', directMessageSchema);
const Notification = mongoose.model('Notification',  notificationSchema);
const Post         = mongoose.model('Post',          postSchema);
const Comment      = mongoose.model('Comment',       commentSchema);

// ── Raw data ─────────────────────────────────────────────────────────────────

const STUDENT_IDS = [
  '22CSE001','22CSE002','22CSE003','22CSE004','22CSE005',
  '22CSE006','22CSE007','22CSE008','22CSE009','22CSE010'
];

const mentorRaw = [
  { user_id: 'MTR001', username: 'dr_anand',     name: 'Dr. Anand Kumar',     email: 'anand@college.edu',   bio: 'Professor of Mathematics',           course_id: '22MA101' },
  { user_id: 'MTR002', username: 'dr_priya',     name: 'Dr. Priya Nair',      email: 'priya@college.edu',   bio: 'Professor of Applied Physics',       course_id: '22PH102' },
  { user_id: 'MTR003', username: 'dr_senthil',   name: 'Dr. Senthil Murugan', email: 'senthil@college.edu', bio: 'Professor of Engineering Chemistry', course_id: '22CH103' },
  { user_id: 'MTR004', username: 'prof_kavitha', name: 'Prof. Kavitha Rajan', email: 'kavitha@college.edu', bio: 'Faculty — Computing and IT',         course_id: '22GE001' },
  { user_id: 'MTR005', username: 'prof_rajesh',  name: 'Prof. Rajesh Babu',   email: 'rajesh@college.edu',  bio: 'Faculty — Electrical Engineering',   course_id: '22GE003' },
  { user_id: 'MTR006', username: 'dr_meena',     name: 'Dr. Meena Sundaram',  email: 'meena@college.edu',   bio: 'Faculty — English and Communication',course_id: '22HS001' },
  { user_id: 'MTR007', username: 'prof_vijay',   name: 'Prof. Vijay Krishnan',email: 'vijay@college.edu',   bio: 'Faculty — Management Studies',       course_id: '22HS002' },
  { user_id: 'MTR008', username: 'dr_lakshmi',   name: 'Dr. Lakshmi Devi',    email: 'lakshmi@college.edu', bio: 'Faculty — Tamil Studies',            course_id: '22HS003' },
];

const studentRaw = [
  { user_id: '22CSE001', username: 'aarav_sharma',    name: 'Aarav Sharma',    email: 'aarav@student.edu',   bio: 'Loves competitive programming' },
  { user_id: '22CSE002', username: 'divya_menon',     name: 'Divya Menon',     email: 'divya@student.edu',   bio: 'Interested in AI and ML' },
  { user_id: '22CSE003', username: 'karthik_suresh',  name: 'Karthik Suresh',  email: 'karthik@student.edu', bio: 'Web dev enthusiast' },
  { user_id: '22CSE004', username: 'nithya_balaji',   name: 'Nithya Balaji',   email: 'nithya@student.edu',  bio: 'Into UI/UX design' },
  { user_id: '22CSE005', username: 'pranav_venkat',   name: 'Pranav Venkat',   email: 'pranav@student.edu',  bio: 'Game developer in the making' },
  { user_id: '22CSE006', username: 'sneha_pillai',    name: 'Sneha Pillai',    email: 'sneha@student.edu',   bio: 'Cybersecurity enthusiast' },
  { user_id: '22CSE007', username: 'arjun_natarajan', name: 'Arjun Natarajan', email: 'arjun@student.edu',   bio: 'Open source contributor' },
  { user_id: '22CSE008', username: 'pooja_iyer',      name: 'Pooja Iyer',      email: 'pooja@student.edu',   bio: 'Data science learner' },
  { user_id: '22CSE009', username: 'rohan_das',       name: 'Rohan Das',       email: 'rohan@student.edu',   bio: 'Backend dev with Node.js' },
  { user_id: '22CSE010', username: 'Harish',          name: 'Harish',          email: 'harish@student.edu',  bio: 'Learning NodeJS and APIs' },
];

const coursesRaw = [
  { regulation: '2022', department: 'CSE', semester: 1, course_id: '22MA101', course_name: 'Engineering Mathematics I',       L: 3, T: 1, P: 0, C: 4 },
  { regulation: '2022', department: 'CSE', semester: 1, course_id: '22PH102', course_name: 'Engineering Physics',              L: 3, T: 0, P: 0, C: 3 },
  { regulation: '2022', department: 'CSE', semester: 1, course_id: '22CH103', course_name: 'Engineering Chemistry',            L: 3, T: 0, P: 0, C: 3 },
  { regulation: '2022', department: 'CSE', semester: 1, course_id: '22GE001', course_name: 'Fundamentals of Computing',        L: 3, T: 0, P: 0, C: 3 },
  { regulation: '2022', department: 'CSE', semester: 1, course_id: '22GE003', course_name: 'Basics of Electrical Engineering', L: 3, T: 0, P: 0, C: 3 },
  { regulation: '2022', department: 'CSE', semester: 1, course_id: '22HS001', course_name: 'Foundational English',             L: 2, T: 0, P: 0, C: 2 },
  { regulation: '2022', department: 'CSE', semester: 1, course_id: '22HS002', course_name: 'Startup Management',               L: 2, T: 0, P: 0, C: 2 },
  { regulation: '2022', department: 'CSE', semester: 1, course_id: '22HS003', course_name: 'Heritage of Tamils',               L: 1, T: 0, P: 0, C: 1 },
];

const classroomsRaw = mentorRaw.map(m => ({
  classroom_id: `${m.course_id}_CSE_A`,
  name:         `${coursesRaw.find(c => c.course_id === m.course_id).course_name} (CSE Sem 1 - A)`,
  mentor_id:    m.user_id,
  student_ids:  STUDENT_IDS,
  course_id:    m.course_id
}));

const assignmentsRaw = [
  {
    assignment_id: 'ASGN_22MA101_01', classroom_id: '22MA101_CSE_A', mentor_id: 'MTR001',
    title: 'Matrices and Determinants',
    description: 'Solve problems on matrix operations and determinant properties.',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), points: 100,
    enrolled_students: STUDENT_IDS,
    submissions: [
      { student_id: '22CSE001', file_url: 'https://files.learnagram.com/asgn1_cse001.pdf', file_name: 'matrices_aarav.pdf',   submitted_at: new Date(), status: 'Graded',  score: 88, remarks: 'Good work' },
      { student_id: '22CSE002', file_url: 'https://files.learnagram.com/asgn1_cse002.pdf', file_name: 'matrices_divya.pdf',   submitted_at: new Date(), status: 'Graded',  score: 92, remarks: 'Excellent' },
      { student_id: '22CSE003', file_url: 'https://files.learnagram.com/asgn1_cse003.pdf', file_name: 'matrices_karthik.pdf', submitted_at: new Date(), status: 'Pending' },
    ]
  },
  {
    assignment_id: 'ASGN_22PH102_01', classroom_id: '22PH102_CSE_A', mentor_id: 'MTR002',
    title: 'Wave Optics Lab Report',
    description: 'Write a detailed report on interference and diffraction experiments.',
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), points: 50,
    enrolled_students: STUDENT_IDS,
    submissions: [
      { student_id: '22CSE004', file_url: 'https://files.learnagram.com/asgn2_cse004.pdf', file_name: 'optics_nithya.pdf', submitted_at: new Date(), status: 'Graded', score: 45, remarks: 'Well documented' },
    ]
  },
  {
    assignment_id: 'ASGN_22GE001_01', classroom_id: '22GE001_CSE_A', mentor_id: 'MTR004',
    title: 'Introduction to Algorithms',
    description: 'Implement bubble sort and binary search in any language.',
    due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), points: 100,
    enrolled_students: STUDENT_IDS,
    submissions: [
      { student_id: '22CSE009', file_url: 'https://files.learnagram.com/asgn3_cse009.zip', file_name: 'algo_rohan.zip',  submitted_at: new Date(), status: 'Pending' },
      { student_id: '22CSE010', file_url: 'https://files.learnagram.com/asgn3_cse010.zip', file_name: 'algo_harish.zip', submitted_at: new Date(), status: 'Graded', score: 95, remarks: 'Excellent implementation' },
    ]
  },
  {
    assignment_id: 'ASGN_22HS001_01', classroom_id: '22HS001_CSE_A', mentor_id: 'MTR006',
    title: 'Technical Report Writing',
    description: 'Write a 2-page technical report on a topic of your choice.',
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), points: 50,
    enrolled_students: STUDENT_IDS,
    submissions: []
  },
];

const messagesRaw = [
  { classroom_id: '22MA101_CSE_A', sender_id: 'MTR001',   content: 'Welcome to Engineering Mathematics I! Please check the syllabus.', type: 'text' },
  { classroom_id: '22MA101_CSE_A', sender_id: '22CSE001', content: 'Thank you sir! When is the first assessment?', type: 'text' },
  { classroom_id: '22MA101_CSE_A', sender_id: 'MTR001',   content: 'I have added a new assignment: Matrices and Determinants. Due in 7 days.', type: 'assignment' },
  { classroom_id: '22MA101_CSE_A', sender_id: '22CSE002', content: 'Got it, thank you!', type: 'text' },

  { classroom_id: '22PH102_CSE_A', sender_id: 'MTR002',   content: 'Welcome everyone! We start with Wave Optics this week.', type: 'text' },
  { classroom_id: '22PH102_CSE_A', sender_id: '22CSE004', content: 'Ma am, will there be a lab session this week?', type: 'text' },
  { classroom_id: '22PH102_CSE_A', sender_id: 'MTR002',   content: 'Yes, lab is on Thursday 2pm.', type: 'text' },

  { classroom_id: '22GE001_CSE_A', sender_id: 'MTR004',   content: 'Hello class! Today we cover binary number systems.', type: 'text' },
  { classroom_id: '22GE001_CSE_A', sender_id: '22CSE010', content: 'Ma am I have a doubt on 2s complement.', type: 'text' },
  { classroom_id: '22GE001_CSE_A', sender_id: 'MTR004',   content: 'Sure Harish, ask during office hours or post here.', type: 'text' },
  { classroom_id: '22GE001_CSE_A', sender_id: '22CSE009', content: 'I have the same doubt, can we discuss tomorrow?', type: 'text' },

  { classroom_id: '22HS001_CSE_A', sender_id: 'MTR006',   content: 'First session: Introduction to technical writing. Read chapter 1.', type: 'text' },
  { classroom_id: '22HS001_CSE_A', sender_id: '22CSE003', content: 'Ma am, is the report handwritten or typed?', type: 'text' },
  { classroom_id: '22HS001_CSE_A', sender_id: 'MTR006',   content: 'Typed please. Submit as PDF.', type: 'text' },

  { classroom_id: '22HS002_CSE_A', sender_id: 'MTR007',   content: 'Welcome! This course will teach you the basics of building a startup.', type: 'text' },
  { classroom_id: '22HS002_CSE_A', sender_id: '22CSE005', content: 'This is my favourite subject!', type: 'text' },
];

const dmsRaw = [
  { sender_id: 'MTR001',   receiver_id: '22CSE001', content: 'Aarav, great work on the assignment!', type: 'text' },
  { sender_id: '22CSE001', receiver_id: 'MTR001',   content: 'Thank you sir!', type: 'text' },
  { sender_id: 'MTR002',   receiver_id: '22CSE004', content: 'Nithya, your lab report was well written.', type: 'text' },
  { sender_id: '22CSE004', receiver_id: 'MTR002',   content: 'Thank you ma am, I worked hard on it.', type: 'text' },
  { sender_id: '22CSE010', receiver_id: '22CSE009', content: 'Hey Rohan, did you finish the algorithm assignment?', type: 'text' },
  { sender_id: '22CSE009', receiver_id: '22CSE010', content: 'Almost done, just testing binary search.', type: 'text' },
  { sender_id: '22CSE001', receiver_id: '22CSE002', content: 'Divya, want to study together for maths?', type: 'text' },
  { sender_id: '22CSE002', receiver_id: '22CSE001', content: 'Sure! Library at 4pm?', type: 'text' },
];

const postsRaw = [
  {
    post_id: 'POST_MTR001_001', user_id: 'MTR001',
    caption: 'Just finished preparing the Matrices module. Exciting problems ahead for CSE batch!',
    visibility: 'Public', likes: ['22CSE001','22CSE002','22CSE003'],
    comments: [
      { comment_id: 'CMT001', user_id: '22CSE001', username: 'aarav_sharma', text: 'Looking forward to it sir!', created_at: new Date() },
      { comment_id: 'CMT002', user_id: '22CSE002', username: 'divya_menon',  text: 'Thanks for the heads up!',   created_at: new Date() },
    ]
  },
  {
    post_id: 'POST_MTR004_001', user_id: 'MTR004',
    caption: 'Algorithms are the backbone of computing. Master them early and everything else becomes easier.',
    visibility: 'Public', likes: ['22CSE009','22CSE010','22CSE005','22CSE007'],
    comments: [
      { comment_id: 'CMT003', user_id: '22CSE010', username: 'Harish', text: 'So true ma am!', created_at: new Date() },
    ]
  },
  {
    post_id: 'POST_22CSE010_001', user_id: '22CSE010',
    caption: 'Finally got my Node.js API working end to end. Feels great!',
    visibility: 'Public', likes: ['22CSE001','22CSE009','MTR004'],
    comments: [
      { comment_id: 'CMT004', user_id: '22CSE009', username: 'rohan_das',    text: 'Nice work Harish!',      created_at: new Date() },
      { comment_id: 'CMT005', user_id: 'MTR004',   username: 'prof_kavitha', text: 'Keep it up! Well done.', created_at: new Date() },
    ]
  },
  {
    post_id: 'POST_22CSE001_001', user_id: '22CSE001',
    caption: 'Solved 5 Leetcode problems today. Consistency is key!',
    visibility: 'Public', likes: ['22CSE002','22CSE003','22CSE007'],
    comments: [
      { comment_id: 'CMT006', user_id: '22CSE007', username: 'arjun_natarajan', text: 'Motivating! Which ones?', created_at: new Date() },
    ]
  },
  {
    post_id: 'POST_22CSE002_001', user_id: '22CSE002',
    caption: 'Just completed an ML crash course online. Neural networks are mind-blowing.',
    visibility: 'Public', likes: ['22CSE001','22CSE008','MTR002'],
    comments: []
  },
  {
    post_id: 'POST_MTR007_001', user_id: 'MTR007',
    caption: 'Startup tip: Validate your idea before you build. Talk to 10 potential users first.',
    visibility: 'Public', likes: ['22CSE005','22CSE003','22CSE004','22CSE006'],
    comments: [
      { comment_id: 'CMT007', user_id: '22CSE005', username: 'pranav_venkat', text: 'This is gold sir!', created_at: new Date() },
    ]
  },
];

const commentsRaw = [
  { comment_id: 'CMT001', post_id: 'POST_MTR001_001',   user_id: '22CSE001', text: 'Looking forward to it sir!' },
  { comment_id: 'CMT002', post_id: 'POST_MTR001_001',   user_id: '22CSE002', text: 'Thanks for the heads up!' },
  { comment_id: 'CMT003', post_id: 'POST_MTR004_001',   user_id: '22CSE010', text: 'So true ma am!' },
  { comment_id: 'CMT004', post_id: 'POST_22CSE010_001', user_id: '22CSE009', text: 'Nice work Harish!' },
  { comment_id: 'CMT005', post_id: 'POST_22CSE010_001', user_id: 'MTR004',   text: 'Keep it up! Well done.' },
  { comment_id: 'CMT006', post_id: 'POST_22CSE001_001', user_id: '22CSE007', text: 'Motivating! Which ones?' },
  { comment_id: 'CMT007', post_id: 'POST_MTR007_001',   user_id: '22CSE005', text: 'This is gold sir!' },
];

// ── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/learnagram';
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB\n');

  const hash = await bcrypt.hash('password123', 10);

  // 1. Users
  console.log('Seeding users...');
  const mentorIds = mentorRaw.map(m => m.user_id);
  for (const m of mentorRaw) {
    await User.findOneAndUpdate(
      { user_id: m.user_id },
      { $setOnInsert: { password: hash }, $set: { username: m.username, name: m.name, email: m.email, department: 'CSE', semester: 1, bio: m.bio, following: STUDENT_IDS, followers: STUDENT_IDS } },
      { upsert: true, returnDocument: 'after' }
    );
    console.log(`  Mentor : ${m.user_id} — ${m.name}`);
  }
  for (const s of studentRaw) {
    await User.findOneAndUpdate(
      { user_id: s.user_id },
      { $setOnInsert: { password: hash }, $set: { username: s.username, name: s.name, email: s.email, department: 'CSE', year: 1, semester: 1, bio: s.bio, following: mentorIds, followers: mentorIds } },
      { upsert: true, returnDocument: 'after' }
    );
    console.log(`  Student: ${s.user_id} — ${s.name}`);
  }

  // 2. Courses
  console.log('\nSeeding courses...');
  await Course.deleteMany({});
  await Course.insertMany(coursesRaw);
  console.log(`  Inserted ${coursesRaw.length} courses`);

  // 3. Classrooms
  console.log('\nSeeding classrooms...');
  await Classroom.deleteMany({});
  await Classroom.insertMany(classroomsRaw);
  console.log(`  Inserted ${classroomsRaw.length} classrooms`);

  // 4. Assignments
  console.log('\nSeeding assignments...');
  await Assignment.deleteMany({});
  await Assignment.insertMany(assignmentsRaw);
  console.log(`  Inserted ${assignmentsRaw.length} assignments`);

  // 5. Messages
  console.log('\nSeeding classroom messages...');
  await Message.deleteMany({});
  await Message.insertMany(messagesRaw);
  console.log(`  Inserted ${messagesRaw.length} messages`);

  // 6. Direct Messages
  console.log('\nSeeding direct messages...');
  await DirectMsg.deleteMany({});
  await DirectMsg.insertMany(dmsRaw);
  console.log(`  Inserted ${dmsRaw.length} direct messages`);

  // 7. Posts
  console.log('\nSeeding posts...');
  await Post.deleteMany({});
  await Post.insertMany(postsRaw);
  for (const p of postsRaw) {
    await User.findOneAndUpdate({ user_id: p.user_id }, { $addToSet: { posts: p.post_id } });
  }
  console.log(`  Inserted ${postsRaw.length} posts`);

  // 8. Comments
  console.log('\nSeeding comments...');
  await Comment.deleteMany({});
  await Comment.insertMany(commentsRaw);
  console.log(`  Inserted ${commentsRaw.length} comments`);

  // 9. Notifications
  console.log('\nSeeding notifications...');
  await Notification.deleteMany({});
  const notifsRaw = [
    ...STUDENT_IDS.map(id => ({ user_id: id, type: 'assignment', content: 'New assignment: Matrices and Determinants in Engineering Mathematics I', reference_id: 'ASGN_22MA101_01', read: false })),
    ...STUDENT_IDS.map(id => ({ user_id: id, type: 'assignment', content: 'New assignment: Wave Optics Lab Report in Engineering Physics', reference_id: 'ASGN_22PH102_01', read: false })),
    ...STUDENT_IDS.map(id => ({ user_id: id, type: 'assignment', content: 'New assignment: Introduction to Algorithms in Fundamentals of Computing', reference_id: 'ASGN_22GE001_01', read: false })),
    { user_id: '22CSE001', type: 'assignment_graded', content: 'Your assignment "Matrices and Determinants" has been graded. Score: 88', reference_id: 'ASGN_22MA101_01', read: false },
    { user_id: '22CSE002', type: 'assignment_graded', content: 'Your assignment "Matrices and Determinants" has been graded. Score: 92', reference_id: 'ASGN_22MA101_01', read: true },
    { user_id: '22CSE004', type: 'assignment_graded', content: 'Your assignment "Wave Optics Lab Report" has been graded. Score: 45',    reference_id: 'ASGN_22PH102_01', read: false },
    { user_id: '22CSE010', type: 'assignment_graded', content: 'Your assignment "Introduction to Algorithms" has been graded. Score: 95', reference_id: 'ASGN_22GE001_01', read: false },
    { user_id: '22CSE001', type: 'follow',   content: 'MTR001 started following you',            reference_id: 'MTR001',            read: true  },
    { user_id: 'MTR001',   type: 'follow',   content: '22CSE001 started following you',          reference_id: '22CSE001',          read: false },
    { user_id: '22CSE010', type: 'like',     content: 'aarav_sharma liked your post',            reference_id: 'POST_22CSE010_001', read: false },
    { user_id: '22CSE010', type: 'comment',  content: 'rohan_das commented on your post',        reference_id: 'POST_22CSE010_001', read: false },
    { user_id: 'MTR001',   type: 'comment',  content: 'aarav_sharma commented on your post',     reference_id: 'POST_MTR001_001',   read: false },
    { user_id: 'MTR007',   type: 'like',     content: 'pranav_venkat liked your post',           reference_id: 'POST_MTR007_001',   read: false },
  ];
  await Notification.insertMany(notifsRaw);
  console.log(`  Inserted ${notifsRaw.length} notifications`);

  console.log('\n✅ All collections seeded successfully!');
  console.log('   Password for all accounts : password123');
  console.log('   Mentor IDs                : MTR001 — MTR008');
  console.log('   Student IDs               : 22CSE001 — 22CSE010');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});