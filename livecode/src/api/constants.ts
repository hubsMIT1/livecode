import { Schedule } from "@/lib/interfaces";

export const API_URL = 'http://localhost:3001'

export const options = [
    'Array',
    'String',
    'Hash Table',
    'Dynamic Programming',
    'Math',
    'Sorting',
    'Greedy',
    'Depth-First Search',
    'Database',
    'Binary Search',
    'Tree',
    'Breadth-First Search',
    'Matrix'
  ];

  export const programmingLanguages = [
    {
      value: "javascript",
      label: "JavaScript",
    },
    {
      value: "python",
      label: "Python",
    },
    {
      value: "java",
      label: "Java",
    },
    {
      value: "csharp",
      label: "C#",
    },
    {
      value: "cpp",
      label: "C++",
    },
    {
      value: "typescript",
      label: "TypeScript",
    },
    {
      value: "ruby",
      label: "Ruby",
    },
    {
      value: "go",
      label: "Go",
    },
    {
      value: "swift",
      label: "Swift",
    },
    {
      value: "php",
      label: "PHP",
    },
  ];
  
  export const user1 = {
    imageSrc: '/docs/images/people/profile-picture-5.jpg',
    status: 'offline',
    name: 'Shray',
    email: 'name@flowbite.com',
    options: [
      { label: 'Dashboard', href: '#' },
      { label: 'Mike', href: '#' },
      { label: 'Camera', href: '#' },
    ],
  };
  
  export const user2 = {
    imageSrc: 'data:image/jpeg;base64,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',
    status: 'online',
    name: 'Shivay',
    email: 'name@flowbite.com',
    options: [
      { label: 'Dashboard', href: '#' },
      { label: 'Mice', href: '#' },
      { label: 'Camera', href: '#' },
    ],
  };

  export const unavailableTimes = [
    "2024-06-16T10:00:00+00:00",
  "2024-06-16T14:30:00+00:00",
  "2024-06-17T09:15:00+00:00",
  "2024-06-18T16:45:00+00:00",
  "2024-06-19T11:20:00+00:00",
  "2024-06-20T13:00:00+00:00",
  "2024-06-21T15:10:00+00:00",
  "2024-06-22T08:30:00+00:00",
  "2024-06-23T12:00:00+00:00",
  "2024-06-24T17:45:00+00:00",
  ];

  export const dataStructuresTopics = [
    { id: 'array', label: 'Array' },
    { id: 'linkedList', label: 'Linked List' },
    { id: 'stack', label: 'Stack' },
    { id: 'queue', label: 'Queue' },
    { id: 'hashtable', label: 'Hash Table' },
    { id: 'tree', label: 'Tree' },
    { id: 'heap', label: 'Heap' },
    { id: 'graph', label: 'Graph' },
    { id: 'trie', label: 'Trie' },
    { id: 'segmentTree', label: 'Segment Tree' },
    { id: 'fenwickTree', label: 'Fenwick Tree' },
    { id: 'disjointSet', label: 'Disjoint Set' },
  ];

  export const difficultyOptions = [
    { id: 'easy', label: 'Easy', color: 'green' },
    { id: 'medium', label: 'Medium', color: 'yellow' },
    { id: 'hard', label: 'Hard', color: 'red' },
  ];

  export const problemsData = [
    {
      id: '1',
      status: 'Solved',
      title: 'Two Sum',
      difficulty: 'Easy',
      acceptance: 47.7,
      solved_by: 4532221,
    },
    {
      id: '2',
      status: 'Solved',
      title: 'Add Two Numbers',
      difficulty: 'Medium',
      acceptance: 39.1,
      solved_by: 2034340,
    },
    {
      id: '3',
      status: 'Attempted',
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      acceptance: 32.4,
      solved_by: 2769654,
    },
    {
      id: '4',
      status: 'Todo',
      title: 'Median of Two Sorted Arrays',
      difficulty: 'Hard',
      acceptance: 33.9,
      solved_by: 1030254,
    },
    {
      id: '5',
      status: 'Solved',
      title: 'Longest Palindromic Substring',
      difficulty: 'Medium',
      acceptance: 31.7,
      solved_by: 1673498,
    },
    {
      id: '6',
      status: 'Attempted',
      title: 'ZigZag Conversion',
      difficulty: 'Medium',
      acceptance: 41.8,
      solved_by: 778234,
    },
    {
      id: '7',
      status: 'Solved',
      title: 'Reverse Integer',
      difficulty: 'Easy',
      acceptance: 26.6,
      solved_by: 2089744,
    },
    {
      id: '8',
      status: 'Todo',
      title: 'String to Integer (atoi)',
      difficulty: 'Medium',
      acceptance: 16.5,
      solved_by: 1067825,
    },
    {
      id: '9',
      status: 'Solved',
      title: 'Palindrome Number',
      difficulty: 'Easy',
      acceptance: 52.5,
      solved_by: 1933676,
    },
    {
      id: '10',
      status: 'Todo',
      title: 'Regular Expression Matching',
      difficulty: 'Hard',
      acceptance: 28.1,
      solved_by: 662876,
    },
    {
      id: '11',
      status: 'Solved',
      title: 'Container With Most Water',
      difficulty: 'Medium',
      acceptance: 54.1,
      solved_by: 1401531,
    },
    {
      id: '12',
      status: 'Attempted',
      title: 'Integer to Roman',
      difficulty: 'Medium',
      acceptance: 60.1,
      solved_by: 724815,
    },
    {
      id: '13',
      status: 'Solved',
      title: 'Roman to Integer',
      difficulty: 'Easy',
      acceptance: 57.9,
      solved_by: 2001401,
    },
    {
      id: '14',
      status: 'Solved',
      title: 'Longest Common Prefix',
      difficulty: 'Easy',
      acceptance: 39.7,
      solved_by: 1587440,
    },
    {
      id: '15',
      status: 'Todo',
      title: '3Sum',
      difficulty: 'Medium',
      acceptance: 32.2,
      solved_by: 2210345,
    },
    {
      id: '16',
      status: 'Attempted',
      title: '3Sum Closest',
      difficulty: 'Medium',
      acceptance: 45.9,
      solved_by: 934957,
    },
    {
      id: '17',
      status: 'Todo',
      title: 'Letter Combinations of a Phone Number',
      difficulty: 'Medium',
      acceptance: 54.3,
      solved_by: 1238183,
    },
    {
      id: '18',
      status: 'Todo',
      title: '4Sum',
      difficulty: 'Medium',
      acceptance: 35.9,
      solved_by: 724034,
    },
    {
      id: '19',
      status: 'Attempted',
      title: 'Remove Nth Node From End of List',
      difficulty: 'Medium',
      acceptance: 38.0,
      solved_by: 1303827,
    },
    {
      id: '20',
      status: 'Solved',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      acceptance: 40.4,
      solved_by: 2417523,
    },
  ];

  export const dummyScheduleData: Schedule[] = [
    {
      allowed_users: [],
      created_at: "2024-07-03T22:35:22.171Z",
      end_time: null,
      join_link: null,
      level: "medium",
      owner_id: "da79d156-eb09-472f-b104-b978f0992f8a",
      question_id: null,
      schedule_id: "73d2eb89-8fd0-4ef1-ad5c-57d8792566a6",
      start_time: "2024-07-04T08:30:00.000Z",
      status: "Incomplete"
    },
    // {
    //   id: '2',
    //   status: 'incoming',
    //   time: '2024-06-16T18:15:21+05:30',
    //   participants: ['user3', 'user4'],
    //   joinLink: 'https://meet.google.com/klm-nopq-rst',
    //   selectedTopics: ['Dynamic Programming'],
    //   level: 'Medium',
    //   questions: 'Longest Palindromic Substring',
    //   feedback: 'https://forms.gle/feedbackForm1',
    //   details: 'Mock interview',
    // },
    // {
    //   id: '3',
    //   status: 'pause',
    //   time: '2023-06-25T18:00:00Z',
    //   participants: ['user1', 'user5'],
    //   joinLink: 'https://meet.google.com/uvw-xyza-bcd',
    //   selectedTopics: ['Graphs', 'BFS', 'DFS'],
    //   level: 'Hard',
    //   questions: 'Course Schedule, Network Delay Time',
    //   feedback: '',
    //   details: 'Algorithm deep dive',
    // },
    // {
    //   id: '4',
    //   status: 'absent',
    //   time: '2023-06-25T18:00:00Z',
    //   participants: ['user1', 'user5'],
    //   joinLink: 'https://meet.google.com/uvw-xyza-bcd',
    //   selectedTopics: ['Graphs', 'BFS', 'DFS'],
    //   level: 'Hard',
    //   questions: 'Course Schedule, Network Delay Time',
    //   feedback: '',
    //   details: 'Algorithm deep dive',
    // },
    // Add more dummy data as needed
  ];

  export const navItems = [
    { label: "Problems", link: "/problems" },
    { label: "Your Session", link: "/schedules/123" },
    { label: "Connect via Link", link: "/contest/link" },//enter link input add
    { label: "Blog", link: "/blog" },
    {label:'Pre Contest',link:'/contest/pre/room1'},
    {label:'Contest',link:'/contest/live/room1'}, //check live or not
    {label:'Feedback',link:'/contest/feedback/123'}
 
  ];

