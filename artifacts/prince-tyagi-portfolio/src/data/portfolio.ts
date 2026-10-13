export interface Project {
  id: string; title: string; kind: string; role: string; status: string;
  problem: string; solution: string; features: string[]; technologies: string[];
  url?: string; repo?: string; screenshot?: string; note?: string;
}

export const portfolio = {
  person: {
    name: 'Prince Tyagi',
    title: 'Computer Science Engineering Student | Aspiring Software Developer',
    university: 'GLA University',
    degree: 'B.Tech in Computer Science Engineering (AI & Data Science)',
    year: '2nd year',
    start: '2025',
    graduation: '2029',
    cgpa: '7.76/10',
    location: 'Mathura, Uttar Pradesh, India',
    email: 'princetyagi3726@gmail.com',
    phone: '+91 9058333615',
    bio: "I'm a second-year B.Tech CSE (AI & Data Science) student at GLA University, Mathura, working toward becoming a strong software developer. I primarily practise Java and data structures and algorithms, and I'm building practical experience through programming projects, browser-based interactive apps, and continuous coding practice. I enjoy learning by building, testing, debugging, and improving software.",
    languages: ['Hindi', 'English — Intermediate'],
  },
  interests: [
    'Java and data structures & algorithms',
    'Practical software development',
    'Browser-based interactive applications',
    'Web projects',
  ],
  skills: [
    { title: 'Programming Languages', note: 'Java is my primary language; C at intermediate knowledge and Python foundational', tags: ['Java', 'C', 'Python'] },
    { title: 'DSA & Core CS', note: 'Topics I practise in Java', tags: ['Data structures & algorithms', 'Object-oriented programming', 'Arrays', 'Strings', 'Sorting', 'Binary search', 'Sliding window', 'Linked lists', 'Recursion', 'Time & space complexity', 'ArrayList', 'HashMap', 'HashSet', 'LinkedList', 'Basic OS concepts', 'Basic networking concepts'] },
    { title: 'Web Development', note: 'Used in my browser-based projects', tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS'] },
    { title: 'Computer Vision & Interaction', note: 'Used in real-time browser gesture recognition', tags: ['MediaPipe Hands', 'Web Camera API', 'OpenCV (fundamentals)'] },
    { title: 'Data Science', note: 'Foundational libraries', tags: ['NumPy', 'Pandas'] },
    { title: 'Developer Tools', note: 'GitHub workflow: clone, commit, push, create and switch branches', tags: ['Git', 'GitHub', 'VS Code', 'IntelliJ IDEA', 'Vite', 'Google Colab', 'MongoDB (fundamentals)', 'MongoDB Atlas'] },
  ],
  projects: ([
    {
      id: '01', title: 'Hand Gesture Box Creator', kind: 'gesture',
      role: 'Frontend Developer · Individual project', status: 'August 2026',
      problem: 'Create and move shapes on screen without a mouse or touchscreen.',
      solution: 'A browser app that recognises hand gestures in real time with MediaPipe Hands and turns them into drawing and movement. Camera processing runs entirely in the browser, helping keep video data on the user\'s device.',
      features: ['Pinch-to-draw boxes', 'Two-finger movement', 'Open-hand idle detection', 'Fist gesture clears boxes'],
      technologies: ['JavaScript', 'MediaPipe Hands', 'HTML', 'CSS', 'Web Camera API'],
      url: 'https://handboxp.netlify.app/',
    },
    {
      id: '02', title: 'GLA Campus Navigator', kind: 'map',
      role: 'Frontend Developer (React) · Team of 2', status: 'October 2026 – Present',
      problem: 'Students need a quick way to find their way around the GLA University campus in Mathura.',
      solution: 'A responsive React web app where students pick their location with GPS (or choose a start point manually) and a destination, then see the route on an interactive map.',
      features: ['GPS or manual starting point', 'Walking routes on an interactive map', 'Estimated distance and travel time', 'Turn-by-turn directions'],
      technologies: ['React', 'JavaScript', 'Leaflet', 'OpenStreetMap', 'HTML', 'CSS', 'GPS', "Dijkstra's Algorithm"],
      url: 'https://campus-navigator--liyorajcs25.replit.app/',
    },
  ] as Project[]),
  education: {
    degree: 'B.Tech, Computer Science Engineering (AI & Data Science)',
    university: 'GLA University, Mathura',
    duration: '2025–2029 (Expected)',
    cgpa: 'Current CGPA: 7.76/10',
    schools: [],
  },
  certificates: [
    {
      title: 'Deloitte / Forage — Data Analytics Job Simulation',
      type: 'Certificate of Completion · Job simulation',
      description: 'Completed an online job simulation; this is not employment at Deloitte.',
      date: '28 December 2025',
      image: '/certificates/deloitte-forage-data-analytics.jpg',
      alt: 'Deloitte Data Analytics Job Simulation certificate of completion for Prince Tyagi',
    },
    {
      title: 'Build Your Fest Stall Edition',
      type: 'Certificate of Participation · Product trial',
      description: 'Participated in a product trial under the Google Student Ambassador Program 2026, bringing a brand idea to life using Gemini and Nano Banana.',
      date: '8 October 2026',
      image: '/certificates/google-build-your-fest-stall.jpg',
      alt: 'Google Student Ambassador Program 2026 Build Your Fest Stall Edition certificate of participation',
    },
    {
      title: 'BuildCamp: AI, Scalability & Google Antigravity',
      type: 'One-day workshop · Participation',
      description: 'Organised by GLA University Department of Computer Engineering & Applications, in association with Code Busters.',
      date: '18 September 2026',
      image: '/certificates/gla-buildcamp-ai-scalability-google-antigravity.jpg',
      alt: 'GLA University and Code Busters BuildCamp participation certificate',
    },
    {
      title: 'HackerRank — Java (Basic)',
      type: 'Certificate of Accomplishment · Skill certification',
      description: 'Passed the HackerRank Java (Basic) skill certification test.',
      date: '12 August 2026',
      image: '/certificates/hackerrank-java-basic.png',
      alt: 'HackerRank Certificate of Accomplishment for Java (Basic) awarded to Prince Tyagi on 12 August 2026',
      profile: 'https://www.hackerrank.com/profile/princetyagi3726',
    },
  ],
  profiles: [
    { name: 'GitHub', url: 'https://github.com/princetyagi1424' },
    { name: 'LeetCode', url: 'https://leetcode.com/u/princeytyagi/' },
    { name: 'HackerRank', url: 'https://www.hackerrank.com/profile/princetyagi3726' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/prince-tyagi-2147482aa/' },
  ],
  leetcode: {
    lastReported: 'Verified snapshot (13 Oct 2026, 14:05 IST)',
    solved: '264', easy: '206', medium: '52', hard: '6',
    rating: '1,480', contests: '1', streak: '46 days', badges: '2',
    badgeNote: 'Includes 100 Days Badge 2026 & 50 Days Badge 2026',
  },
  github: {
    username: 'princetyagi1424',
    publicRepos: 10,
    followers: 0,
    following: 1,
    lastChecked: '13 Oct 2026, 14:05 IST',
  },
};

export const resume = { url: '/Prince_Tyagi_Resume.pdf', filename: 'Prince_Tyagi_Resume.pdf', label: 'Download Resume' };

export const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Coding Profiles', href: '#profiles' },
  { label: 'Contact', href: '#contact' },
];
