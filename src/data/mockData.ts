export interface Course {
  id: string;
  code: string;
  name: string;
  semester: string;
  newMessages: number;
  color: string;
}

export interface Post {
  id: string;
  courseId: string;
  authorId: string;
  authorName: string;
  isAnonymous: boolean;
  content: string;
  createdAt: Date;
  likes: number;
  dislikes: number;
  hearts: number;
  replyCount: number;
}

export interface Reply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  isAnonymous: boolean;
  content: string;
  createdAt: Date;
}

export interface Resource {
  id: string;
  courseId: string;
  title: string;
  url: string;
  sharedBy: string;
  sharedAt: Date;
}

export const courses: Course[] = [
  {
    id: 'cisc200',
    code: 'CISC 200',
    name: 'Intro-Computer Tech & Bus Appl',
    semester: 'Spring 2026',
    newMessages: 24,
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'busn100',
    code: 'BUSN 100',
    name: 'BUSN for the Common Good',
    semester: 'Spring 2026',
    newMessages: 12,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'mgmt200',
    code: 'MGMT 200',
    name: 'Working Skillfully in Orgs',
    semester: 'Spring 2026',
    newMessages: 8,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'psych101',
    code: 'PSYCH 101',
    name: 'Psychology',
    semester: 'Spring 2026',
    newMessages: 15,
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'econ251',
    code: 'ECON 251',
    name: 'Intro to Economics',
    semester: 'Spring 2026',
    newMessages: 10,
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'phil100',
    code: 'PHIL 100',
    name: 'Intro to Philosophy',
    semester: 'Spring 2026',
    newMessages: 6,
    color: 'from-indigo-500 to-blue-600',
  },
];

export const posts: Post[] = [
  // CISC 200 Posts
  {
    id: 'post1',
    courseId: 'cisc200',
    authorId: '2',
    authorName: 'Sarah M.',
    isAnonymous: false,
    content: 'Does anyone have notes from Monday\'s lecture? I had to miss class 😅',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 12,
    dislikes: 1,
    hearts: 3,
    replyCount: 5,
  },
  {
    id: 'post2',
    courseId: 'cisc200',
    authorId: '3',
    authorName: 'Anonymous',
    isAnonymous: true,
    content: 'Can someone explain recursion? Still confused after the examples in class',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 18,
    dislikes: 0,
    hearts: 5,
    replyCount: 8,
  },
  {
    id: 'post3',
    courseId: 'cisc200',
    authorId: '4',
    authorName: 'Mike J.',
    isAnonymous: false,
    content: 'Study group Thursday 6pm at library room 204. DM if you want to join!',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    likes: 15,
    dislikes: 0,
    hearts: 2,
    replyCount: 3,
  },
  {
    id: 'post4',
    courseId: 'cisc200',
    authorId: '5',
    authorName: 'Alex K.',
    isAnonymous: false,
    content: 'Here\'s the Python cheat sheet I made for the exam',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    likes: 24,
    dislikes: 0,
    hearts: 8,
    replyCount: 2,
  },
  {
    id: 'post5',
    courseId: 'cisc200',
    authorId: '6',
    authorName: 'Anonymous',
    isAnonymous: true,
    content: 'Anyone else struggling with arrays? 😭',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    likes: 20,
    dislikes: 2,
    hearts: 6,
    replyCount: 12,
  },
  // BUSN 100 Posts
  {
    id: 'post6',
    courseId: 'busn100',
    authorId: '7',
    authorName: 'Anonymous',
    isAnonymous: true,
    content: 'Missed Friday\'s class - what chapters are we covering for the quiz?',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    likes: 9,
    dislikes: 0,
    hearts: 2,
    replyCount: 3,
  },
  {
    id: 'post7',
    courseId: 'busn100',
    authorId: '8',
    authorName: 'Riley P.',
    isAnonymous: false,
    content: 'Can anyone explain supply chain management from chapter 4?',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 15,
    dislikes: 1,
    hearts: 5,
    replyCount: 7,
  },
  {
    id: 'post8',
    courseId: 'busn100',
    authorId: '9',
    authorName: 'Casey M.',
    isAnonymous: false,
    content: 'Here\'s a helpful video on market segmentation',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    likes: 19,
    dislikes: 0,
    hearts: 7,
    replyCount: 4,
  },
  {
    id: 'post9',
    courseId: 'busn100',
    authorId: '10',
    authorName: 'Anonymous',
    isAnonymous: true,
    content: 'Looking for someone to quiz me before the exam - anyone down?',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    likes: 13,
    dislikes: 0,
    hearts: 4,
    replyCount: 6,
  },
  {
    id: 'post10',
    courseId: 'busn100',
    authorId: '11',
    authorName: 'Sam K.',
    isAnonymous: false,
    content: 'Office hours notes - prof clarified the final project requirements',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    likes: 28,
    dislikes: 1,
    hearts: 10,
    replyCount: 9,
  },
  // MGMT 200 Posts
  {
    id: 'post11',
    courseId: 'mgmt200',
    authorId: '12',
    authorName: 'Jordan T.',
    isAnonymous: false,
    content: 'Group project partners needed for the case study assignment!',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    likes: 8,
    dislikes: 0,
    hearts: 2,
    replyCount: 4,
  },
  {
    id: 'post12',
    courseId: 'mgmt200',
    authorId: '13',
    authorName: 'Anonymous',
    isAnonymous: true,
    content: 'Can someone explain the difference between leadership styles we covered?',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likes: 14,
    dislikes: 0,
    hearts: 4,
    replyCount: 6,
  },
  {
    id: 'post13',
    courseId: 'mgmt200',
    authorId: '14',
    authorName: 'Emma R.',
    isAnonymous: false,
    content: 'Notes from today\'s lecture on organizational behavior',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    likes: 32,
    dislikes: 0,
    hearts: 12,
    replyCount: 8,
  },
  {
    id: 'post14',
    courseId: 'mgmt200',
    authorId: '15',
    authorName: 'Chris L.',
    isAnonymous: false,
    content: 'Is the midterm open book? Anyone know?',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    likes: 18,
    dislikes: 1,
    hearts: 3,
    replyCount: 5,
  },
  {
    id: 'post15',
    courseId: 'mgmt200',
    authorId: '16',
    authorName: 'Taylor W.',
    isAnonymous: false,
    content: 'Study session Sunday 2pm at Starbucks on campus - all welcome!',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    likes: 22,
    dislikes: 0,
    hearts: 6,
    replyCount: 7,
  },
  // PSYCH 101 Posts
  {
    id: 'post16',
    courseId: 'psych101',
    authorId: '17',
    authorName: 'Maya S.',
    isAnonymous: false,
    content: 'The lecture on cognitive biases was mind-blowing! Anyone want to discuss?',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 25,
    dislikes: 0,
    hearts: 9,
    replyCount: 11,
  },
  {
    id: 'post17',
    courseId: 'psych101',
    authorId: '18',
    authorName: 'Anonymous',
    isAnonymous: true,
    content: 'Can someone explain the difference between classical and operant conditioning?',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 19,
    dislikes: 0,
    hearts: 6,
    replyCount: 8,
  },
  {
    id: 'post18',
    courseId: 'psych101',
    authorId: '19',
    authorName: 'Zoe L.',
    isAnonymous: false,
    content: 'Here\'s a great TED talk about memory I found',
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    likes: 31,
    dislikes: 0,
    hearts: 14,
    replyCount: 5,
  },
  {
    id: 'post19',
    courseId: 'psych101',
    authorId: '20',
    authorName: 'Anonymous',
    isAnonymous: true,
    content: 'Anyone else find the Freud chapter confusing? Need help understanding defense mechanisms',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    likes: 16,
    dislikes: 1,
    hearts: 4,
    replyCount: 9,
  },
  {
    id: 'post20',
    courseId: 'psych101',
    authorId: '21',
    authorName: 'Ethan K.',
    isAnonymous: false,
    content: 'Study guide for the developmental psychology unit - hope it helps!',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    likes: 42,
    dislikes: 0,
    hearts: 18,
    replyCount: 12,
  },
  // ECON 251 Posts
  {
    id: 'post21',
    courseId: 'econ251',
    authorId: '22',
    authorName: 'Noah P.',
    isAnonymous: false,
    content: 'The supply and demand graphs make so much more sense now after the TA session!',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    likes: 14,
    dislikes: 0,
    hearts: 5,
    replyCount: 4,
  },
  {
    id: 'post22',
    courseId: 'econ251',
    authorId: '23',
    authorName: 'Anonymous',
    isAnonymous: true,
    content: 'How do you calculate elasticity? The formula is confusing me',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    likes: 22,
    dislikes: 0,
    hearts: 7,
    replyCount: 10,
  },
  {
    id: 'post23',
    courseId: 'econ251',
    authorId: '24',
    authorName: 'Lily T.',
    isAnonymous: false,
    content: 'Found an amazing Khan Academy playlist for macroeconomics basics',
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
    likes: 28,
    dislikes: 0,
    hearts: 11,
    replyCount: 6,
  },
  {
    id: 'post24',
    courseId: 'econ251',
    authorId: '25',
    authorName: 'James W.',
    isAnonymous: false,
    content: 'Anyone want to form a study group for the midterm? I\'m struggling with GDP calculations',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    likes: 17,
    dislikes: 0,
    hearts: 4,
    replyCount: 8,
  },
  {
    id: 'post25',
    courseId: 'econ251',
    authorId: '26',
    authorName: 'Anonymous',
    isAnonymous: true,
    content: 'Professor just posted extra credit opportunity - check announcements!',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    likes: 35,
    dislikes: 0,
    hearts: 8,
    replyCount: 3,
  },
  // PHIL 100 Posts
  {
    id: 'post26',
    courseId: 'phil100',
    authorId: '27',
    authorName: 'Sophia R.',
    isAnonymous: false,
    content: 'The trolley problem debate in class was so interesting! What side are you on?',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likes: 29,
    dislikes: 2,
    hearts: 8,
    replyCount: 15,
  },
  {
    id: 'post27',
    courseId: 'phil100',
    authorId: '28',
    authorName: 'Anonymous',
    isAnonymous: true,
    content: 'Can someone explain Kant\'s categorical imperative in simpler terms?',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likes: 21,
    dislikes: 0,
    hearts: 6,
    replyCount: 9,
  },
  {
    id: 'post28',
    courseId: 'phil100',
    authorId: '29',
    authorName: 'Marcus J.',
    isAnonymous: false,
    content: 'Here\'s a summary of all the philosophers we\'ve covered so far',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    likes: 38,
    dislikes: 0,
    hearts: 16,
    replyCount: 7,
  },
  {
    id: 'post29',
    courseId: 'phil100',
    authorId: '30',
    authorName: 'Anonymous',
    isAnonymous: true,
    content: 'Is the essay on utilitarianism due Friday or next Monday?',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    likes: 12,
    dislikes: 0,
    hearts: 2,
    replyCount: 4,
  },
  {
    id: 'post30',
    courseId: 'phil100',
    authorId: '31',
    authorName: 'Ava M.',
    isAnonymous: false,
    content: 'Study session for the Plato unit - Room 302 tomorrow at 5pm!',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    likes: 19,
    dislikes: 0,
    hearts: 5,
    replyCount: 6,
  },
];

export const replies: Reply[] = [
  // Replies for CISC 200 posts
  {
    id: 'reply1',
    postId: 'post1',
    authorId: '5',
    authorName: 'Alex Rivera',
    isAnonymous: false,
    content: 'I have it! Check your email, I just sent it over.',
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
  },
  {
    id: 'reply2',
    postId: 'post1',
    authorId: '6',
    authorName: 'Jordan Lee',
    isAnonymous: false,
    content: 'The professor also posted it on the course portal under "Resources" if you need it again.',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 'reply3',
    postId: 'post1',
    authorId: '7',
    authorName: 'Taylor Kim',
    isAnonymous: true,
    content: 'Thanks for sharing! I was looking for this too.',
    createdAt: new Date(Date.now() - 0.5 * 60 * 60 * 1000),
  },
  {
    id: 'reply4',
    postId: 'post1',
    authorId: '8',
    authorName: 'Sam Davis',
    isAnonymous: false,
    content: 'Pro tip: always keep a backup in Google Drive 😅',
    createdAt: new Date(Date.now() - 0.25 * 60 * 60 * 1000),
  },
  {
    id: 'reply5',
    postId: 'post2',
    authorId: '2',
    authorName: 'Sarah Chen',
    isAnonymous: false,
    content: 'I felt the same way at first! Try watching the Khan Academy video on database normalization - it made everything click for me.',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 'reply6',
    postId: 'post2',
    authorId: '4',
    authorName: 'Anonymous',
    isAnonymous: true,
    content: 'The TA office hours tomorrow will cover this topic. Highly recommend going!',
    createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
  },
  {
    id: 'reply7',
    postId: 'post3',
    authorId: '3',
    authorName: 'Mike Johnson',
    isAnonymous: false,
    content: 'This is amazing, thank you so much for sharing!',
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
  },
  {
    id: 'reply8',
    postId: 'post3',
    authorId: '5',
    authorName: 'Anonymous',
    isAnonymous: true,
    content: 'Bookmarked! This will definitely help for the exam.',
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
  },
];

export const resources: Resource[] = [
  // CISC 200 Resources
  {
    id: 'res1',
    courseId: 'cisc200',
    title: 'Python Cheat Sheet for Exam',
    url: 'https://docs.google.com/document/sample-link',
    sharedBy: 'Alex K.',
    sharedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'res2',
    courseId: 'cisc200',
    title: 'Recursion Tutorial - YouTube',
    url: 'https://youtube.com/watch?v=recursion-explained',
    sharedBy: 'Mike J.',
    sharedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'res3',
    courseId: 'cisc200',
    title: 'Arrays in Python - W3Schools',
    url: 'https://w3schools.com/python/python_arrays.asp',
    sharedBy: 'Sarah M.',
    sharedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'res4',
    courseId: 'cisc200',
    title: 'Practice Problems for Midterm',
    url: 'https://example.com/cisc200-practice',
    sharedBy: 'Alex Rivera',
    sharedAt: new Date(Date.now() - 96 * 60 * 60 * 1000),
  },
  // BUSN 100 Resources
  {
    id: 'res5',
    courseId: 'busn100',
    title: 'Market Segmentation Video',
    url: 'https://youtube.com/sample-video',
    sharedBy: 'Casey M.',
    sharedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'res6',
    courseId: 'busn100',
    title: 'Supply Chain Management Guide',
    url: 'https://example.com/supply-chain-guide',
    sharedBy: 'Riley P.',
    sharedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  // MGMT 200 Resources
  {
    id: 'res7',
    courseId: 'mgmt200',
    title: 'Organizational Behavior Lecture Notes',
    url: 'https://docs.google.com/document/sample-link2',
    sharedBy: 'Emma R.',
    sharedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 'res8',
    courseId: 'mgmt200',
    title: 'Leadership Styles Comparison Chart',
    url: 'https://example.com/leadership-styles',
    sharedBy: 'Jordan T.',
    sharedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  // PSYCH 101 Resources
  {
    id: 'res9',
    courseId: 'psych101',
    title: 'TED Talk on Memory',
    url: 'https://ted.com/talks/memory-explained',
    sharedBy: 'Zoe L.',
    sharedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
  },
  {
    id: 'res10',
    courseId: 'psych101',
    title: 'Developmental Psychology Study Guide',
    url: 'https://docs.google.com/document/psych-guide',
    sharedBy: 'Ethan K.',
    sharedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'res11',
    courseId: 'psych101',
    title: 'Conditioning Explained - Khan Academy',
    url: 'https://khanacademy.org/conditioning',
    sharedBy: 'Maya S.',
    sharedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  // ECON 251 Resources
  {
    id: 'res12',
    courseId: 'econ251',
    title: 'Khan Academy Macroeconomics Playlist',
    url: 'https://khanacademy.org/economics/macroeconomics',
    sharedBy: 'Lily T.',
    sharedAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
  },
  {
    id: 'res13',
    courseId: 'econ251',
    title: 'Elasticity Calculator & Examples',
    url: 'https://example.com/elasticity-calculator',
    sharedBy: 'Noah P.',
    sharedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'res14',
    courseId: 'econ251',
    title: 'GDP Calculation Cheat Sheet',
    url: 'https://docs.google.com/document/gdp-guide',
    sharedBy: 'James W.',
    sharedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  // PHIL 100 Resources
  {
    id: 'res15',
    courseId: 'phil100',
    title: 'Summary of Philosophers Covered',
    url: 'https://docs.google.com/document/phil-summary',
    sharedBy: 'Marcus J.',
    sharedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'res16',
    courseId: 'phil100',
    title: 'Trolley Problem Explained - YouTube',
    url: 'https://youtube.com/trolley-problem',
    sharedBy: 'Sophia R.',
    sharedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'res17',
    courseId: 'phil100',
    title: 'Kant\'s Ethics Made Simple',
    url: 'https://example.com/kant-ethics',
    sharedBy: 'Ava M.',
    sharedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
];

export function getCourse(courseId: string): Course | undefined {
  return courses.find(c => c.id === courseId);
}

export function getCoursePosts(courseId: string): Post[] {
  return posts.filter(p => p.courseId === courseId);
}

export function getPost(postId: string): Post | undefined {
  return posts.find(p => p.id === postId);
}

export function getPostReplies(postId: string): Reply[] {
  return replies.filter(r => r.postId === postId);
}

export function getCourseResources(courseId: string): Resource[] {
  return resources.filter(r => r.courseId === courseId);
}

export function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
}
