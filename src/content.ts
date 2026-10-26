export type Activity = {
  id: string;
  category: "Campus life" | "Workshops" | "Our creations";
  title: string;
  subtitle: string;
  image: string;
  label: string;
  description: string;
  takeaways: string[];
  meta: string;
  color: "blue" | "teal" | "coral";
};

export type Member = {
  id: string;
  name: string;
  role: string;
  team: "Leadership" | "Members";
  initials: string;
  color: "blue" | "teal" | "coral" | "navy";
  bio: string;
  skills: string[];
};

export type Phase = {
  id: string;
  title: string;
  period: string;
  description: string;
  tasks: string[];
  output: string;
};

// Sample content for the website concept. Replace with confirmed department
// activities and member information before publishing an official directory.
export const activities: Activity[] = [
  {
    id: "campus-stories",
    category: "Campus life",
    title: "One campus. Many stories.",
    subtitle: "Small moments. Different perspectives. A shared home.",
    image: "identity/scene-stories.webp",
    label: "CAMPUS STORIES",
    description:
      "A proposed portrait series about the people who make campus feel like home. A photograph, a conversation, and a little space for every voice.",
    takeaways: [
      "Meet students across cultures and disciplines.",
      "Create a portrait and a short personal story.",
      "Share each story with its contributor’s approval.",
    ],
    meta: "Proposed activity · Storytelling",
    color: "blue",
  },
  {
    id: "creative-lab",
    category: "Workshops",
    title: "Make something together.",
    subtitle: "A little curiosity. A camera. Endless possibilities.",
    image: "identity/scene-workshop.webp",
    label: "CREATIVE LAB",
    description:
      "A proposed hands-on session for curious photographers, designers, writers, and filmmakers. Bring an idea or simply bring yourself; learn by making something together.",
    takeaways: [
      "Explore composition, storytelling, and visual identity.",
      "Team up on a small creative challenge.",
      "Leave with a first draft and useful feedback.",
    ],
    meta: "Proposed workshop · Open to all skill levels",
    color: "teal",
  },
  {
    id: "made-of-us",
    category: "Our creations",
    title: "An identity made of us.",
    subtitle: "Our colors, our character, our way of connecting.",
    image: "identity/scene-creations.webp",
    label: "DESIGN EXPLORATIONS",
    description:
      "A proposed showcase of the team’s visual experiments: playful shapes, new compositions, and creative ways to express the HSIYC identity.",
    takeaways: [
      "Explore our colors, character, and visual language.",
      "See how one identity works across different formats.",
      "Collect ideas for future member welcome materials.",
    ],
    meta: "Sample showcase · Identity concepts",
    color: "coral",
  },
];

export const members: Member[] = [
  {
    id: "leader",
    name: "Name to be added",
    role: "Leader",
    team: "Leadership",
    initials: "LD",
    color: "blue",
    bio: "Proposed responsibilities: guide the department’s direction, bring the team together, and help turn shared ideas into a clear plan.",
    skills: ["Team direction", "Planning", "Coordination"],
  },
  {
    id: "assistant-leader",
    name: "Name to be added",
    role: "Assistant leader",
    team: "Leadership",
    initials: "AL",
    color: "teal",
    bio: "Proposed responsibilities: support the leader, coordinate day-to-day work, and help members keep their creative projects moving.",
    skills: ["Project follow-up", "Team support", "Organization"],
  },
  {
    id: "consular",
    name: "Name to be added",
    role: "Consular",
    team: "Leadership",
    initials: "CO",
    color: "coral",
    bio: "Proposed responsibilities: offer guidance, listen to the team, and help the department reflect on its ideas and shared goals.",
    skills: ["Guidance", "Listening", "Feedback"],
  },
  {
    id: "member",
    name: "Name to be added",
    role: "Member",
    team: "Members",
    initials: "ME",
    color: "navy",
    bio: "Proposed responsibilities: contribute ideas, collaborate on activities, and help create the stories, visuals, and moments the department shares.",
    skills: ["Creative contribution", "Collaboration", "Activity support"],
  },
];

export const phases: Phase[] = [
  {
    id: "connect",
    title: "Find our people.",
    period: "Phase 01 · Connect",
    description:
      "A proposed opening chapter: get to know each other, share our interests, and discover the stories around us.",
    tasks: [
      "Welcome the team and introduce creative interests.",
      "Gather story ideas from the campus community.",
      "Agree on roles, shared tools, and ways of working.",
    ],
    output: "A shared direction and a first collection of ideas.",
  },
  {
    id: "explore",
    title: "Make room for ideas.",
    period: "Phase 02 · Explore",
    description:
      "Try different formats, learn from one another, and give promising ideas a little room to grow.",
    tasks: [
      "Run a practical photography or design session.",
      "Develop a small set of creative briefs.",
      "Explore the HSIYC identity through draft concepts.",
    ],
    output: "Creative briefs, early experiments, and a clear next step.",
  },
  {
    id: "create",
    title: "Bring stories to life.",
    period: "Phase 03 · Create",
    description:
      "Turn selected ideas into thoughtful stories, photographs, films, and designs with everyone contributing their strengths.",
    tasks: [
      "Produce the selected campus stories as a team.",
      "Review work for clarity, accessibility, and brand consistency.",
      "Confirm contributor consent and credits before sharing.",
    ],
    output: "A reviewed collection of work ready to share.",
  },
  {
    id: "share",
    title: "Share. Reflect. Grow.",
    period: "Phase 04 · Contribute",
    description:
      "Celebrate what we have made, listen to feedback, and carry our learning into the next creative chapter.",
    tasks: [
      "Share approved work through confirmed department channels.",
      "Collect feedback from members and contributors.",
      "Document lessons and suggest ideas for the next term.",
    ],
    output: "A shared showcase and a thoughtful plan for what comes next.",
  },
];

export const values = [
  {
    title: "Every voice belongs.",
    description:
      "Our proposed vision starts with people: different cultures, perspectives, and experiences finding space in one shared story.",
  },
  {
    title: "Curiosity makes us creative.",
    description:
      "Ask a good question. Try something new. Make room for learning, collaboration, and the happy surprises along the way.",
  },
  {
    title: "Create with care.",
    description:
      "Tell stories thoughtfully, credit the people behind them, and make work that is welcoming, accessible, and meaningful.",
  },
];
