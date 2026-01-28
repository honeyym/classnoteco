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
  {
    id: 'post1',
    courseId: 'econ101',
    authorId: '2',
    authorName: 'Sarah Chen',
    isAnonymous: false,
    content: 'Does anyone have notes from today\'s lecture on supply and demand curves? I missed class due to a doctor\'s appointment.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 12,
    hearts: 3,
    replyCount: 5,
  },
  {
    id: 'post2',
    courseId: 'econ101',
    authorId: '3',
    authorName: 'Mike Johnson',
    isAnonymous: true,
    content: 'Is the midterm going to be open book? I\'m a bit confused about the policy.',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 28,
    hearts: 8,
    replyCount: 12,
  },
  {
    id: 'post3',
    courseId: 'econ101',
    authorId: '4',
    authorName: 'Emma Wilson',
    isAnonymous: false,
    content: 'Just found this great video explaining elasticity concepts. Really helped me understand the material better! https://youtube.com/watch?v=example',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    likes: 45,
    hearts: 15,
    replyCount: 8,
  },
  {
    id: 'post4',
    courseId: 'cs201',
    authorId: '5',
    authorName: 'Alex Rivera',
    isAnonymous: false,
    content: 'Anyone want to form a study group for the trees and graphs unit? We could meet at the library.',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    likes: 18,
    hearts: 5,
    replyCount: 7,
  },
  {
    id: 'post5',
    courseId: 'cs201',
    authorId: '6',
    authorName: 'Jordan Lee',
    isAnonymous: true,
    content: 'Is it just me or is the binary search tree assignment way harder than expected? 😅',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likes: 56,
    hearts: 12,
    replyCount: 23,
  },
  {
    id: 'post6',
    courseId: 'bio150',
    authorId: '7',
    authorName: 'Taylor Kim',
    isAnonymous: false,
    content: 'Lab report tip: Make sure to include the control group results in Table 2. Lost points on that last time.',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    likes: 34,
    hearts: 10,
    replyCount: 4,
  },
];

export const replies: Reply[] = [
  {
    id: 'reply1',
    postId: 'post1',
    authorId: '5',
    authorName: 'Alex Rivera',
    isAnonymous: false,
    content: 'I have detailed notes! I can share them with you. DM me your email.',
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
  },
  {
    id: 'reply2',
    postId: 'post1',
    authorId: '6',
    authorName: 'Jordan Lee',
    isAnonymous: false,
    content: 'The professor also posted slides on the course portal if you need them.',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 'reply3',
    postId: 'post1',
    authorId: '7',
    authorName: 'Taylor Kim',
    isAnonymous: true,
    content: 'Hope you\'re feeling better! The main takeaway was the relationship between price and quantity.',
    createdAt: new Date(Date.now() - 0.5 * 60 * 60 * 1000),
  },
  {
    id: 'reply4',
    postId: 'post2',
    authorId: '2',
    authorName: 'Sarah Chen',
    isAnonymous: false,
    content: 'According to the syllabus, it\'s closed book but we can bring one page of notes.',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 'reply5',
    postId: 'post2',
    authorId: '4',
    authorName: 'Emma Wilson',
    isAnonymous: false,
    content: 'Prof confirmed this in class today. One page, front and back!',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
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
