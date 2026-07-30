// Seed data for Civic Bridge Africa.
// In production (per the SRS) this lives in PostgreSQL behind the API layer;
// for this demo prototype it is seeded once into localStorage on first load.

export const SEED_USERS = [
  {
    id: "u-admin",
    name: "Amina Okafor",
    email: "admin@civicbridge.africa",
    password: "admin123",
    role: "Admin",
  },
  {
    id: "u-mod",
    name: "Kwame Mensah",
    email: "moderator@civicbridge.africa",
    password: "mod123",
    role: "Moderator",
  },
  {
    id: "u-youth",
    name: "Nia Uwimana",
    email: "youth@civicbridge.africa",
    password: "youth123",
    role: "Youth User",
  },
];

export const CIVIC_CONTENT = [
  {
    id: "c1",
    title: "How a Bill Becomes Law in the East African Community",
    category: "Parliamentary Process",
    summary:
      "A plain-language walkthrough of how the EAC Legislative Assembly drafts, debates, and passes regional legislation.",
    body:
      "Every EAC law begins as a motion tabled by a member. It moves through committee review, two full readings before the assembly, and a final assent stage from partner-state heads of state. Understanding this chain helps citizens know exactly where to direct pressure or support during a debate.",
    readMinutes: 4,
  },
  {
    id: "c2",
    title: "Your Rights When Engaging With Local Government",
    category: "Civic Rights",
    summary:
      "What every citizen aged 16+ is entitled to when petitioning, attending public hearings, or requesting public records.",
    body:
      "Most national constitutions across the region guarantee the right to petition, the right to peaceful assembly, and increasingly a right of access to public information. Knowing the specific office responsible for each right turns a vague entitlement into something you can actually use.",
    readMinutes: 5,
  },
  {
    id: "c3",
    title: "What the African Union Actually Does Day-to-Day",
    category: "Regional Integration",
    summary:
      "Beyond the summits: the AU's standing organs, how they're funded, and how decisions trickle down to member states.",
    body:
      "The AU Assembly meets twice a year, but the real day-to-day work happens in the Peace and Security Council, the Pan-African Parliament, and specialised technical committees. Decisions become binding on a member state only after domestication into national law — a step many campaigns forget to track.",
    readMinutes: 6,
  },
  {
    id: "c4",
    title: "Reading a National Budget Without an Economics Degree",
    category: "Governance Literacy",
    summary:
      "A five-step method for finding out where your taxes actually go, using only a published budget PDF.",
    body:
      "Start with the recurrent vs. development split, then find your sector of interest, then compare this year's allocation to last year's actual spend, not last year's plan. The gap between plan and actual spend is usually where the real story is.",
    readMinutes: 5,
  },
];

export const QUIZZES = [
  {
    id: "q1",
    title: "Governance Literacy Basics",
    relatedContentId: "c1",
    questions: [
      {
        id: "q1-1",
        prompt: "How many readings does a bill typically need before the EAC Legislative Assembly?",
        options: ["One", "Two", "Three", "Four"],
        answerIndex: 1,
      },
      {
        id: "q1-2",
        prompt: "Who gives final assent to EAC regional legislation?",
        options: [
          "The Secretary General alone",
          "Partner-state heads of state",
          "A single member of parliament",
          "The public via referendum",
        ],
        answerIndex: 1,
      },
      {
        id: "q1-3",
        prompt: "What is the first stage of a bill's life in the assembly?",
        options: ["Final assent", "Committee review", "Public referendum", "Media briefing"],
        answerIndex: 1,
      },
    ],
  },
  {
    id: "q2",
    title: "Know Your Civic Rights",
    relatedContentId: "c2",
    questions: [
      {
        id: "q2-1",
        prompt: "What right lets you formally raise an issue with a government office?",
        options: ["Right to petition", "Right to silence", "Right to assembly", "Right to appeal"],
        answerIndex: 0,
      },
      {
        id: "q2-2",
        prompt: "Which of these is increasingly guaranteed across the region's constitutions?",
        options: [
          "Free transport",
          "Access to public information",
          "Guaranteed employment",
          "Free legal representation for all matters",
        ],
        answerIndex: 1,
      },
    ],
  },
];

export const REGIONAL_TRACKER = [
  {
    id: "r1",
    initiative: "EAC Common Market Protocol — Free Movement of Persons",
    status: "In Force",
    progress: 80,
    note: "Adopted by most partner states; implementation gaps remain in labour permit reciprocity.",
  },
  {
    id: "r2",
    initiative: "African Continental Free Trade Area (AfCFTA)",
    status: "Active Implementation",
    progress: 55,
    note: "Trading has begun under the Guided Trade Initiative; tariff schedules still being finalised by several states.",
  },
  {
    id: "r3",
    initiative: "AU Digital Transformation Strategy",
    status: "Early Stage",
    progress: 30,
    note: "Continental framework adopted; national digital ID interoperability still in pilot phase.",
  },
  {
    id: "r4",
    initiative: "EAC Single Tourist Visa",
    status: "In Force",
    progress: 90,
    note: "Live across member states with strong adoption among regional travellers.",
  },
];

export const SEED_FORUM_POSTS = [
  {
    id: "f1",
    authorName: "Kwame Mensah",
    authorRole: "Moderator",
    title: "Welcome — introduce your civic interest",
    body: "Tell us one governance topic you want to understand better this month. Keep it respectful and specific.",
    createdAt: "2026-07-20T09:00:00.000Z",
  },
  {
    id: "f2",
    authorName: "Nia Uwimana",
    authorRole: "Youth User",
    title: "Does anyone track county-level budget hearings?",
    body: "I want to attend one in person but can't find a public schedule anywhere. Any tips?",
    createdAt: "2026-07-22T14:30:00.000Z",
  },
];
