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
];

export const posts: Post[] = [
  // CISC 200 Posts
  {
    id: 'post1',
    courseId: 'cisc200',
    authorId: '2',
    authorName: 'Sarah Chen',
    isAnonymous: false,
    content: 'Does anyone have the Excel template for the midterm project? I accidentally deleted mine 😅',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 8,
    hearts: 2,
    replyCount: 4,
  },
  {
    id: 'post2',
    courseId: 'cisc200',
    authorId: '3',
    authorName: 'Anonymous',
    isAnonymous: true,
    content: 'Is it just me or was the database lecture really confusing? I feel lost on normalization...',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    likes: 24,
    hearts: 6,
    replyCount: 11,
  },
  {
    id: 'post3',
    courseId: 'cisc200',
    authorId: '4',
    authorName: 'Mike Johnson',
    isAnonymous: false,
    content: 'Found this great YouTube playlist on SQL basics that really helped me understand joins. Highly recommend checking it out before the quiz!',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    likes: 45,
    hearts: 12,
    replyCount: 8,
  },
  {
    id: 'post4',
    courseId: 'cisc200',
    authorId: '5',
    authorName: 'Emma Wilson',
    isAnonymous: false,
    content: 'Study group meeting tomorrow at 3pm in the library! We\'ll be going over chapters 4-6. Everyone welcome 📚',
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
    likes: 18,
    hearts: 8,
    replyCount: 6,
  },
  {
    id: 'post5',
    courseId: 'cisc200',
    authorId: '6',
    authorName: 'Anonymous',
    isAnonymous: true,
    content: 'Will the final be cumulative or just the second half of the semester?',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    likes: 32,
    hearts: 4,
    replyCount: 15,
  },
  {
    id: 'post6',
    courseId: 'cisc200',
    authorId: '7',
    authorName: 'Alex Rivera',
    isAnonymous: false,
    content: 'Pro tip: The practice problems at the end of each chapter are very similar to the exam questions. Don\'t skip them!',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
    likes: 67,
    hearts: 21,
    replyCount: 3,
  },
  // BUSN 100 Posts
  {
    id: 'post7',
    courseId: 'busn100',
    authorId: '2',
    authorName: 'Jordan Lee',
    isAnonymous: false,
    content: 'The guest speaker today was amazing! Anyone else inspired to look into social entrepreneurship?',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    likes: 28,
    hearts: 15,
    replyCount: 7,
  },
  {
    id: 'post8',
    courseId: 'busn100',
    authorId: '3',
    authorName: 'Anonymous',
    isAnonymous: true,
    content: 'How long should the reflection paper be? The syllabus says 2-3 pages but that seems short for this topic.',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likes: 12,
    hearts: 1,
    replyCount: 5,
  },
  // MGMT 200 Posts
  {
    id: 'post9',
    courseId: 'mgmt200',
    authorId: '4',
    authorName: 'Taylor Kim',
    isAnonymous: false,
    content: 'Group project teams are posted! Check your email. Looking forward to working with everyone 🙌',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    likes: 15,
    hearts: 9,
    replyCount: 12,
  },
  {
    id: 'post10',
    courseId: 'mgmt200',
    authorId: '5',
    authorName: 'Anonymous',
    isAnonymous: true,
    content: 'Does anyone else struggle with the case studies? I never know if I\'m analyzing them correctly.',
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    likes: 41,
    hearts: 8,
    replyCount: 19,
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
  {
    id: 'res1',
    courseId: 'econ101',
    title: 'Elasticity Explained - Khan Academy',
    url: 'https://khanacademy.org/economics/elasticity',
    sharedBy: 'Emma Wilson',
    sharedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'res2',
    courseId: 'econ101',
    title: 'Supply and Demand Practice Problems',
    url: 'https://example.com/econ-practice',
    sharedBy: 'Sarah Chen',
    sharedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
  {
    id: 'res3',
    courseId: 'cs201',
    title: 'Visualizing Data Structures',
    url: 'https://visualgo.net',
    sharedBy: 'Alex Rivera',
    sharedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: 'res4',
    courseId: 'cs201',
    title: 'Big O Cheat Sheet',
    url: 'https://bigocheatsheet.com',
    sharedBy: 'Jordan Lee',
    sharedAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
  },
  {
    id: 'res5',
    courseId: 'bio150',
    title: 'Lab Report Template',
    url: 'https://example.com/bio-template',
    sharedBy: 'Taylor Kim',
    sharedAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
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
