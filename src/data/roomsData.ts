export const rooms = [
  {
    "roomName": "Design Hub",
    "peopleInRoom": true,
    "isActive": false,
    "createdByYou": true,
    "kpi": { // Added room KPI
      "kpiName": "Overall Design Quality",
      "kpiMetric": "85%"
    },
    "members": [
      {
        "name": "Michael Mcintyre",
        "image": "https://source.unsplash.com/random/100x100?sig=0",
        "points": 2694,
        "tasksDone": 61,
        "level": "Beginner",
        "kpiAlignment": "48%",
        "roomKpis": [
          "Boost deployment frequency",
          "Streamline design process"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Design Task Completion",
          "kpiMetric": "75%"
        }
      },
      {
        "name": "Dawn Gonzalez",
        "image": "https://source.unsplash.com/random/100x100?sig=1",
        "points": 2684,
        "tasksDone": 73,
        "level": "Expert",
        "kpiAlignment": "94%",
        "roomKpis": [
          "Enhance customer satisfaction",
          "Improve test coverage"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Design Task Completion",
          "kpiMetric": "92%"
        }
      }
    ],
    "tasks": [
      {
        id: "task-1",
        created_at: "2024-07-24T10:00:00Z",
        updated_at: "2024-07-24T12:30:00Z",
        title: "Read exactly note",
        duration: "2.5 hours",
        is_recurring: false,
        status: "in progress",
        category: "Documentation",
        task_tools: ["Notion", "Google Docs"],
        deadline: "2025-06-03",
        due_by: "2025-06-03",
        task_point: 10,
        completed_at: null,
        created_by_id: "user-1",
        workroom_id: "room-1",
        assignedTo: [
          "Michael Mcintyre",
          "Dawn Gonzalez"
        ]
      },
      {
        id: "task-2",
        created_at: "2024-07-24T14:00:00Z",
        updated_at: "2024-07-24T16:00:00Z",
        title: "Focus know two cut",
        duration: "2 hours",
        is_recurring: false,
        status: "completed",
        category: "Design",
        task_tools: ["Figma"],
        deadline: "2025-05-25",
        due_by: "2025-05-25",
        task_point: 15,
        completed_at: "2024-07-24T16:00:00Z",
        created_by_id: "user-2",
        workroom_id: "room-1",
        assignedTo: [
          "Michael Mcintyre",
          "Dawn Gonzalez"
        ]
      },
      {
        id: "task-3",
        created_at: "2024-07-25T09:00:00Z",
        updated_at: "2024-07-25T11:00:00Z",
        title: "Environment him available fall character",
        duration: "2 hours",
        is_recurring: true,
        status: "in progress",
        category: "Research",
        task_tools: ["Miro", "Google Docs"],
        deadline: "2025-05-30",
        due_by: "2025-05-30",
        task_point: 8,
        completed_at: null,
        created_by_id: "user-1",
        workroom_id: "room-1",
        assignedTo: [
          "Michael Mcintyre"
        ]
      }
    ]
  },
  {
    "roomName": "Dev Team",
    "peopleInRoom": true,
    "isActive": false,
    "createdByYou": false,
    "kpi": {  // Added room KPI
      "kpiName": "Code Quality",
      "kpiMetric": "90%"
    },
    "members": [
      {
        "name": "Sarah Moore",
        "image": "https://source.unsplash.com/random/100x100?sig=5",
        "points": 3233,
        "tasksDone": 36,
        "level": "Intermediate",
        "kpiAlignment": "98%",
        "roomKpis": [
          "Reduce bug count",
          "Increase feature delivery"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": {  // Added member KPI
          "kpiName": "Code Review Turnaround",
          "kpiMetric": "80%"
        }
      },
      {
        "name": "Richard Hernandez",
        "image": "https://source.unsplash.com/random/100x100?sig=6",
        "points": 1198,
        "tasksDone": 79,
        "level": "Beginner",
        "kpiAlignment": "68%",
        "roomKpis": [
          "Boost deployment frequency",
          "Improve test coverage"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": {  // Added member KPI
          "kpiName": "Bug Fix Rate",
          "kpiMetric": "65%"
        }
      },
      {
        "name": "Alan Aguilar",
        "image": "https://source.unsplash.com/random/100x100?sig=7",
        "points": 1015,
        "tasksDone": 40,
        "level": "Expert",
        "kpiAlignment": "53%",
        "roomKpis": [
          "Reduce bug count",
          "Streamline design process"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Feature Implementation",
          "kpiMetric": "70%"
        }
      },
      {
        "name": "Elizabeth Smith",
        "image": "https://source.unsplash.com/random/100x100?sig=8",
        "points": 4920,
        "tasksDone": 98,
        "level": "Beginner",
        "kpiAlignment": "97%",
        "roomKpis": [
          "Improve UI consistency",
          "Streamline design process"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": {  // Added member KPI
          "kpiName": "Code Contribution",
          "kpiMetric": "95%"
        }
      }
    ],
    "tasks": [
      {
        id: "task-4",
        created_at: "2024-07-25T10:00:00Z",
        updated_at: "2024-07-25T14:30:00Z",
        title: "Within energy involve kind another",
        duration: "4.5 hours",
        is_recurring: false,
        status: "in progress",
        category: "Development",
        task_tools: ["Jira", "Git"],
        deadline: "2025-06-09",
        due_by: "2025-06-09",
        task_point: 20,
        completed_at: null,
        created_by_id: "user-3",
        workroom_id: "room-2",
        assignedTo: [
          "Sarah Moore",
          "Elizabeth Smith",
          "Richard Hernandez"
        ]
      },
      {
        id: "task-5",
        created_at: "2024-07-26T08:00:00Z",
        updated_at: "2024-07-26T10:00:00Z",
        title: "Tough protect agent character detail",
        duration: "2 hours",
        is_recurring: false,
        status: "completed",
        category: "Testing",
        task_tools: ["Selenium", "Jira"],
        deadline: "2025-05-26",
        due_by: "2025-05-26",
        task_point: 12,
        completed_at: "2024-07-26T10:00:00Z",
        created_by_id: "user-4",
        workroom_id: "room-2",
        assignedTo: [
          "Elizabeth Smith"
        ]
      }
    ]
  },
  {
    "roomName": "Marketing Chat",
    "peopleInRoom": true,
    "isActive": false,
    "createdByYou": false,
    "kpi": { // Added room KPI
      "kpiName": "Campaign Effectiveness",
      "kpiMetric": "78%"
    },
    "members": [
      {
        "name": "Laura Miller",
        "image": "https://source.unsplash.com/random/100x100?sig=10",
        "points": 4732,
        "tasksDone": 96,
        "level": "Intermediate",
        "kpiAlignment": "43%",
        "roomKpis": [
          "Improve UI consistency",
          "Improve test coverage"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Content Creation",
          "kpiMetric": "88%"
        }
      },
      {
        "name": "Beth Lyons",
        "image": "https://source.unsplash.com/random/100x100?sig=11",
        "points": 1339,
        "tasksDone": 49,
        "level": "Intermediate",
        "kpiAlignment": "49%",
        "roomKpis": [
          "Enhance customer satisfaction",
          "Reduce time to resolve issues"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Social Media Engagement",
          "kpiMetric": "60%"
        }
      }
    ],
    "tasks": [
      {
        id: "task-6",
        created_at: "2024-07-26T09:00:00Z",
        updated_at: "2024-07-26T11:45:00Z",
        title: "People fill result outside moment",
        duration: "2.75 hours",
        is_recurring: false,
        status: "in progress",
        category: "Content Creation",
        task_tools: ["Contentful", "Google Docs"],
        deadline: "2025-06-09",
        due_by: "2025-06-09",
        task_point: 18,
        completed_at: null,
        created_by_id: "user-5",
        workroom_id: "room-3",
        assignedTo: [
          "Laura Miller"
        ]
      },
      {
        id: "task-7",
        created_at: "2024-07-27T10:00:00Z",
        updated_at: "2024-07-27T12:00:00Z",
        title: "Oil size significant",
        duration: "2 hours",
        is_recurring: true,
        status: "completed",
        category: "Social Media",
        task_tools: ["Buffer", "Hootsuite"],
        deadline: "2025-05-28",
        due_by: "2025-05-28",
        task_point: 14,
        completed_at: "2024-07-27T12:00:00Z",
        created_by_id: "user-6",
        workroom_id: "room-3",
        assignedTo: [
          "Laura Miller",
          "Beth Lyons"
        ]
      }
    ]
  },
  {
    "roomName": "Product Ideas",
    "peopleInRoom": true,
    "isActive": false,
    "createdByYou": true,
    "kpi": { // Added room KPI
      "kpiName": "Idea Implementation Rate",
      "kpiMetric": "62%"
    },
    "members": [
      {
        "name": "James Allen",
        "image": "https://source.unsplash.com/random/100x100?sig=15",
        "points": 1722,
        "tasksDone": 39,
        "level": "Expert",
        "kpiAlignment": "55%",
        "roomKpis": [
          "Reduce bug count",
          "Reduce time to resolve issues"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Idea Generation",
          "kpiMetric": "70%"
        }
      },
      {
        "name": "Miguel Gomez",
        "image": "https://source.unsplash.com/random/100x100?sig=16",
        "points": 2801,
        "tasksDone": 47,
        "level": "Beginner",
        "kpiAlignment": "81%",
        "roomKpis": [
          "Improve UI consistency",
          "Increase feature delivery"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Idea Contribution",
          "kpiMetric": "85%"
        }
      },
      {
        "name": "Lindsey Reed",
        "image": "https://source.unsplash.com/random/100x100?sig=17",
        "points": 4902,
        "tasksDone": 29,
        "level": "Beginner",
        "kpiAlignment": "59%",
        "roomKpis": [
          "Improve UI consistency",
          "Reduce time to resolve issues"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": {  // Added member KPI
          "kpiName": "Feedback Quality",
          "kpiMetric": "65%"
        }
      },
      {
        "name": "Terry Palmer",
        "image": "https://source.unsplash.com/random/100x100?sig=18",
        "points": 4064,
        "tasksDone": 79,
        "level": "Intermediate",
        "kpiAlignment": "66%",
        "roomKpis": [
          "Improve UI consistency",
          "Streamline design process"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Idea Evaluation",
          "kpiMetric": "75%"
        }
      },
      {
        "name": "Brandon Tucker",
        "image": "https://source.unsplash.com/random/100x100?sig=19",
        "points": 3840,
        "tasksDone": 37,
        "level": "Intermediate",
        "kpiAlignment": "83%",
        "roomKpis": [
          "Reduce bug count",
          "Streamline design process"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Idea Implementation",
          "kpiMetric": "90%"
        }
      }
    ],
    "tasks": [
      {
        id: "task-8",
        created_at: "2024-07-27T11:00:00Z",
        updated_at: "2024-07-27T13:15:00Z",
        title: "Third later feel way east",
        duration: "2.25 hours",
        is_recurring: false,
        status: "in progress",
        category: "Brainstorming",
        task_tools: ["Miro", "Zoom"],
        deadline: "2025-06-09",
        due_by: "2025-06-09",
        task_point: 16,
        completed_at: null,
        created_by_id: "user-7",
        workroom_id: "room-4",
        assignedTo: [
          "Terry Palmer",
          "James Allen"
        ]
      },
      {
        id: "task-9",
        created_at: "2024-07-28T09:30:00Z",
        updated_at: "2024-07-28T11:30:00Z",
        title: "Compare boy sure kind",
        duration: "2 hours",
        is_recurring: false,
        status: "completed",
        category: "Documentation",
        task_tools: ["Google Docs"],
        deadline: "2025-05-26",
        due_by: "2025-05-26",
        task_point: 12,
        completed_at: "2024-07-28T11:30:00Z",
        created_by_id: "user-8",
        workroom_id: "room-4",
        assignedTo: [
          "James Allen",
          "Miguel Gomez",
          "Lindsey Reed"
        ]
      },
      {
        id: "task-10",
        created_at: "2024-07-28T14:00:00Z",
        updated_at: "2024-07-28T16:00:00Z",
        title: "Interest he north",
        duration: "2 hours",
        is_recurring: false,
        status: "in progress",
        category: "Research",
        task_tools: ["Jira", "Confluence"],
        deadline: "2025-05-27",
        due_by: "2025-05-27",
        task_point: 10,
        completed_at: null,
        created_by_id: "user-7",
        workroom_id: "room-4",
        assignedTo: [
          "Lindsey Reed"
        ]
      },
      {
        id: "task-11",
        created_at: "2024-07-29T10:00:00Z",
        updated_at: "2024-07-29T12:45:00Z",
        title: "Fish along watch",
        duration: "2.75 hours",
        is_recurring: true,
        status: "in progress",
        category: "Development",
        task_tools: ["Git", "Jenkins"],
        deadline: "2025-05-28",
        due_by: "2025-05-28",
        task_point: 18,
        completed_at: null,
        created_by_id: "user-8",
        workroom_id: "room-4",
        assignedTo: [
          "James Allen",
          "Brandon Tucker",
          "Lindsey Reed",
          "Miguel Gomez",
          "Terry Palmer"
        ]
      }
    ]
  },
  {
    "roomName": "QA Review",
    "peopleInRoom": true,
    "isActive": false,
    "createdByYou": true,
    "kpi": { // Added room KPI
      "kpiName": "Test Coverage",
      "kpiMetric": "92%"
    },
    "members": [
      {
        "name": "Casey Howard",
        "image": "https://source.unsplash.com/random/100x100?sig=20",
        "points": 1655,
        "tasksDone": 89,
        "level": "Beginner",
        "kpiAlignment": "41%",
        "roomKpis": [
          "Enhance customer satisfaction",
          "Increase feature delivery"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Test Case Creation",
          "kpiMetric": "78%"
        }
      },
      {
        "name": "Luis Tran",
        "image": "https://source.unsplash.com/random/100x100?sig=21",
        "points": 1392,
        "tasksDone": 41,
        "level": "Expert",
        "kpiAlignment": "97%",
        "roomKpis": [
          "Reduce bug count",
          "Increase feature delivery"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Bug Detection Rate",
          "kpiMetric": "95%"
        }
      }
    ],
    "tasks": [
      {
        id: "task-12",
        created_at: "2024-07-29T13:00:00Z",
        updated_at: "2024-07-29T15:00:00Z",
        title: "Foreign place really study",
        duration: "2 hours",
        is_recurring: false,
        status: "in progress",
        category: "Testing",
        task_tools: ["Jira", "TestRail"],
        deadline: "2025-06-01",
        due_by: "2025-06-01",
        task_point: 14,
        completed_at: null,
        created_by_id: "user-9",
        workroom_id: "room-5",
        assignedTo: [
          "Luis Tran"
        ]
      },
      {
        id: "task-13",
        created_at: "2024-07-30T08:00:00Z",
        updated_at: "2024-07-30T10:00:00Z",
        title: "Above avoid say",
        duration: "2 hours",
        is_recurring: false,
        status: "completed",
        category: "Documentation",
        task_tools: ["Confluence", "Google Docs"],
        deadline: "2025-05-23",
        due_by: "2025-05-23",
        task_point: 10,
        completed_at: "2024-07-30T10:00:00Z",
        created_by_id: "user-10",
        workroom_id: "room-5",
        assignedTo: [
          "Luis Tran"
        ]
      },
      {
        id: "task-14",
        created_at: "2024-07-30T11:00:00Z",
        updated_at: "2024-07-30T13:30:00Z",
        title: "Play hospital answer down",
        duration: "2.5 hours",
        is_recurring: true,
        status: "in progress",
        category: "Design",
        task_tools: ["Figma", "Miro"],
        deadline: "2025-05-14",
        due_by: "2025-05-14",
        task_point: 16,
        completed_at: null,
        created_by_id: "user-9",
        workroom_id: "room-5",
        assignedTo: [
          "Casey Howard"
        ]
      }
    ]
  },
  {
    "roomName": "UI/UX Feedback",
    "peopleInRoom": true,
    "isActive": false,
    "createdByYou": true,
     "kpi": { // Added room KPI
      "kpiName": "Feedback Implementation",
      "kpiMetric": "70%"
    },
    "members": [
      {
        "name": "Hannah Boyd",
        "image": "https://source.unsplash.com/random/100x100?sig=25",
        "points": 2367,
        "tasksDone": 37,
        "level": "Intermediate",
        "kpiAlignment": "56%",
        "roomKpis": [
          "Reduce bug count",
          "Reduce time to resolve issues"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Feedback Quality",
          "kpiMetric": "82%"
        }
      },
      {
        "name": "Angela Underwood",
        "image": "https://source.unsplash.com/random/100x100?sig=26",
        "points": 2352,
        "tasksDone": 45,
        "level": "Beginner",
        "kpiAlignment": "48%",
        "roomKpis": [
          "Boost deployment frequency",
          "Streamline design process"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Feedback Contribution",
          "kpiMetric": "70%"
        }
      }
    ],
    "tasks": [
      {
        id: "task-15",
        created_at: "2024-07-30T14:00:00Z",
        updated_at: "2024-07-30T16:00:00Z",
        title: "Their seven share past us",
        duration: "2 hours",
        is_recurring: false,
        status: "completed",
        category: "Feedback",
        task_tools: ["Figma", "UserTesting"],
        deadline: "2025-05-12",
        due_by: "2025-05-12",
        task_point: 12,
        completed_at: "2024-07-30T16:00:00Z",
        created_by_id: "user-11",
        workroom_id: "room-6",
        assignedTo: [
          "Hannah Boyd"
        ]
      },
      {
        id: "task-16",
        created_at: "2024-07-31T09:00:00Z",
        updated_at: "2024-07-31T11:30:00Z",
        title: "How most nice",
        duration: "2.5 hours",
        is_recurring: false,
        status: "in progress",
        category: "Design",
        task_tools: ["Sketch", "InVision"],
        deadline: "2025-06-08",
        due_by: "2025-06-08",
        task_point: 18,
        completed_at: null,
        created_by_id: "user-12",
        workroom_id: "room-6",
        assignedTo: [
          "Angela Underwood"
        ]
      }
    ]
  },
  {
    "roomName": "Sprint Planning",
    "peopleInRoom": true,
    "isActive": false,
    "createdByYou": true,
    "kpi": { // Added room KPI
      "kpiName": "Sprint Goal Achievement",
      "kpiMetric": "88%"
    },
    "members": [
      {
        "name": "Angela Bowman",
        "image": "https://source.unsplash.com/random/100x100?sig=30",
        "points": 2331,
        "tasksDone": 62,
        "level": "Expert",
        "kpiAlignment": "45%",
        "roomKpis": [
          "Improve UI consistency",
          "Improve test coverage"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Sprint Planning Participation",
          "kpiMetric": "92%"
        }
      },
      {
        "name": "Sheri Pierce",
        "image": "https://source.unsplash.com/random/100x100?sig=31",
        "points": 3306,
        "tasksDone": 37,
        "level": "Beginner",
        "kpiAlignment": "69%",
        "roomKpis": [
          "Reduce bug count",
          "Reduce time to resolve issues"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Task Estimation Accuracy",
          "kpiMetric": "75%"
        }
      },
      {
        "name": "Dr. Jonathan Sullivan",
        "image": "https://source.unsplash.com/random/100x100?sig=32",
        "points": 1477,
        "tasksDone": 71,
        "level": "Intermediate",
        "kpiAlignment": "71%",
        "roomKpis": [
          "Improve UI consistency",
          "Increase feature delivery"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Sprint Goal Contribution",
          "kpiMetric": "80%"
        }
      },
      {
        "name": "Ana Cole",
        "image": "https://source.unsplash.com/random/100x100?sig=33",
        "points": 2518,
        "tasksDone": 33,
        "level": "Beginner",
        "kpiAlignment": "61%",
        "roomKpis": [
          "Boost deployment frequency",
          "Streamline design process"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": {  // Added member KPI
          "kpiName": "Task Completion Rate",
          "kpiMetric": "68%"
        }
      },
      {
        "name": "Jacqueline Bray",
        "image": "https://source.unsplash.com/random/100x100?sig=34",
        "points": 4128,
        "tasksDone": 27,
        "level": "Expert",
        "kpiAlignment": "65%",
        "roomKpis": [
          "Reduce bug count",
          "Reduce time to resolve issues"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Risk Identification",
          "kpiMetric": "90%"
        }
      }
    ],
    "tasks": [
      {
        id: "task-17",
        created_at: "2024-07-31T10:00:00Z",
        updated_at: "2024-07-31T12:15:00Z",
        title: "Send certainly eye someone",
        duration: "2.25 hours",
        is_recurring: false,
        status: "in progress",
        category: "Planning",
        task_tools: ["Jira", "Confluence"],
        deadline: "2025-05-17",
        due_by: "2025-05-17",
        task_point: 14,
        completed_at: null,
        created_by_id: "user-13",
        workroom_id: "room-7",
        assignedTo: [
          "Sheri Pierce",
          "Jacqueline Bray",
          "Ana Cole",
          "Angela Bowman"
        ]
      },
      {
        id: "task-18",
        created_at: "2024-08-01T09:00:00Z",
        updated_at: "2024-08-01T11:00:00Z",
        title: "Audience do",
        duration: "2 hours",
        is_recurring: false,
        status: "completed",
        category: "Documentation",
        task_tools: ["Google Docs"],
        deadline: "2025-06-08",
        due_by: "2025-06-08",
        task_point: 10,
        completed_at: "2024-08-01T11:00:00Z",
        created_by_id: "user-14",
        workroom_id: "room-7",
        assignedTo: [
          "Sheri Pierce",
          "Jacqueline Bray",
          "Dr. Jonathan Sullivan",
          "Angela Bowman"
        ]
      }
    ]
  },
  {
    "roomName": "All Hands",
    "peopleInRoom": true,
    "isActive": false,
    "createdByYou": false,
    "kpi": { // Added room KPI
      "kpiName": "Employee Engagement",
      "kpiMetric": "80%"
    },
    "members": [
      {
        "name": "Melissa Lara",
        "image": "https://source.unsplash.com/random/100x100?sig=35",
        "points": 1183,
        "tasksDone": 17,
        "level": "Beginner",
        "kpiAlignment": "70%",
        "roomKpis": [
          "Boost deployment frequency",
          "Streamline design process"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Meeting Participation",
          "kpiMetric": "90%"
        }
      },
      {
        "name": "Scott Owens",
        "image": "https://source.unsplash.com/random/100x100?sig=36",
        "points": 1951,
        "tasksDone": 40,
        "level": "Beginner",
        "kpiAlignment": "97%",
        "roomKpis": [
          "Boost deployment frequency",
          "Increase feature delivery"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Information Sharing",
          "kpiMetric": "75%"
        }
      },
      {
        "name": "Jacob Mitchell",
        "image": "https://source.unsplash.com/random/100x100?sig=37",
        "points": 1388,
        "tasksDone": 75,
        "level": "Beginner",
        "kpiAlignment": "56%",
        "roomKpis": [
          "Reduce bug count",
          "Improve test coverage"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Cross-functional Collaboration",
          "kpiMetric": "60%"
        }
      }
    ],
    "tasks": [
      {
        id: "task-19",
        created_at: "2024-08-01T10:00:00Z",
        updated_at: "2024-08-01T12:30:00Z",
        title: "Skin figure throughout",
        duration: "2.5 hours",
        is_recurring: false,
        status: "scheduled",
        category: "Presentation",
        task_tools: ["Google Slides", "Zoom"],
        deadline: "2025-05-28",
        due_by: "2025-05-28",
        task_point: 8,
        completed_at: null,
        created_by_id: "user-15",
        workroom_id: "room-8",
        assignedTo: []
      },
      {
        id: "task-20",
        created_at: "2024-08-02T09:00:00Z",
        updated_at: "2024-08-02T11:00:00Z",
        title: "Development one we",
        duration: "2 hours",
        is_recurring: false,
        status: "scheduled",
        category: "Discussion",
        task_tools: ["Slack", "Microsoft Teams"],
        deadline: "2025-05-13",
        due_by: "2025-05-13",
        task_point: 5,
        completed_at: null,
        created_by_id: "user-16",
        workroom_id: "room-8",
        assignedTo: []
      },
      {
        id: "task-21",
        created_at: "2024-08-02T14:00:00Z",
        updated_at: "2024-08-02T16:45:00Z",
        title: "Purpose politics case else dog",
        duration: "2.75 hours",
        is_recurring: true,
        status: "scheduled",
        category: "Brainstorming",
        task_tools: ["Miro", "Jamboard"],
        deadline: "2025-05-23",
        due_by: "2025-05-23",
        task_point: 12,
        completed_at: null,
        created_by_id: "user-15",
        workroom_id: "room-8",
        assignedTo: []
      }
    ]
  },
  {
    "roomName": "Standup",
    "peopleInRoom": false,
    "isActive": true,
    "createdByYou": false,
    "kpi": { // Added room KPI
      "kpiName": "Standup Participation",
      "kpiMetric": "95%"
    },
    "members": [],
    "tasks": [
      {
        id: "task-22",
        created_at: "2024-08-02T10:00:00Z",
        updated_at: "2024-08-02T10:15:00Z",
        title: "Area majority experience",
        duration: "15 minutes",
        is_recurring: true,
        status: "scheduled",
        category: "Standup",
        task_tools: ["Google Meet", "Slack"],
        deadline: "2025-05-21",
        due_by: "2025-05-21",
        task_point: 2,
        completed_at: null,
        created_by_id: "user-17",
        workroom_id: "room-9",
        assignedTo: []
      },
      {
        id: "task-23",
        created_at: "2024-08-03T10:00:00Z",
        updated_at: "2024-08-03T10:15:00Z",
        title: "Cause paper drug",
        duration: "15 minutes",
        is_recurring: true,
        status: "scheduled",
        category: "Standup",
        task_tools: ["Zoom", "Microsoft Teams"],
        deadline: "2025-06-06",
        due_by: "2025-06-06",
        task_point: 2,
        completed_at: null,
        created_by_id: "user-18",
        workroom_id: "room-9",
        assignedTo: []
      },
      {
        id: "task-24",
        created_at: "2024-08-03T10:00:00Z",
        updated_at: "2024-08-03T10:15:00Z",
        title: "Improve air relationship",
        duration: "15 minutes",
        is_recurring: true,
        status: "scheduled",
        category: "Standup",
        task_tools: ["Google Meet", "Slack"],
        deadline: "2025-06-04",
        due_by: "2025-06-04",
        task_point: 2,
        completed_at: null,
        created_by_id: "user-17",
        workroom_id: "room-9",
        assignedTo: []
      },
      {
        id: "task-25",
        created_at: "2024-08-04T10:00:00Z",
        updated_at: "2024-08-04T10:15:00Z",
        title: "Truth consider company",
        duration: "15 minutes",
        is_recurring: true,
        status: "scheduled",
        category: "Standup",
        task_tools: ["Zoom", "Microsoft Teams"],
        deadline: "2025-05-29",
        due_by: "2025-05-29",
        task_point: 2,
        completed_at: null,
        created_by_id: "user-18",
        workroom_id: "room-9",
        assignedTo: []
      }
    ]
  },
  {
    "roomName": "Backend Sync",
    "peopleInRoom": true,
    "isActive": false,
    "createdByYou": true,
    "kpi": {  // Added room KPI
      "kpiName": "API Performance",
      "kpiMetric": "87%"
    },
    "members": [
      {
        "name": "Michelle White",
        "image": "https://source.unsplash.com/random/100x100?sig=45",
        "points": 3118,
        "tasksDone": 26,
        "level": "Beginner",
        "kpiAlignment": "76%",
        "roomKpis": [
          "Reduce bug count",
          "Reduce time to resolve issues"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": {  // Added member KPI
          "kpiName": "API Development",
          "kpiMetric": "92%"
        }
      },
      {
        "name": "Ashley Howell",
        "image": "https://source.unsplash.com/random/100x100?sig=46",
        "points": 1789,
        "tasksDone": 57,
        "level": "Intermediate",
        "kpiAlignment": "65%",
        "roomKpis": [
          "Improve UI consistency",
          "Reduce time to resolve issues"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Database Management",
          "kpiMetric": "80%"
        }
      },
      {
        "name": "Heather Clark",
        "image": "https://source.unsplash.com/random/100x100?sig=47",
        "points": 2814,
        "tasksDone": 30,
        "level": "Intermediate",
        "kpiAlignment": "40%",
        "roomKpis": [
          "Reduce bug count",
          "Streamline design process"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Server Optimization",
          "kpiMetric": "70%"
        }
      },
      {
        "name": "Kayla Schroeder",
        "image": "https://source.unsplash.com/random/100x100?sig=48",
        "points": 3303,
        "tasksDone": 51,
        "level": "Beginner",
        "kpiAlignment": "89%",
        "roomKpis": [
          "Improve UI consistency",
          "Increase feature delivery"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": {  // Added member KPI
          "kpiName": "Code Deployment",
          "kpiMetric": "88%"
        }
      }
    ],
    "tasks": [
      {
        id: "task-26",
        created_at: "2024-08-04T09:00:00Z",
        updated_at: "2024-08-04T11:45:00Z",
        title: "Fast should what evening",
        duration: "2.75 hours",
        is_recurring: false,
        status: "in progress",
        category: "Development",
        task_tools: ["Git", "Docker"],
        deadline: "2025-06-04",
        due_by: "2025-06-04",
        task_point: 22,
        completed_at: null,
        created_by_id: "user-19",
        workroom_id: "room-10",
        assignedTo: [
          "Heather Clark",
          "Ashley Howell",
          "Michelle White",
          "Kayla Schroeder"
        ]
      },
      {
        id: "task-27",
        created_at: "2024-08-05T10:00:00Z",
        updated_at: "2024-08-05T12:00:00Z",
        title: "Lay us",
        duration: "2 hours",
        is_recurring: false,
        status: "completed",
        category: "Documentation",
        task_tools: ["Swagger", "Postman"],
        deadline: "2025-06-01",
        due_by: "2025-06-01",
        task_point: 15,
        completed_at: "2024-08-05T12:00:00Z",
        created_by_id: "user-20",
        workroom_id: "room-10",
        assignedTo: [
          "Michelle White"
        ]
      },
      {
        id: "task-28",
        created_at: "2024-08-05T13:00:00Z",
        updated_at: "2024-08-05T15:30:00Z",
        title: "Point few",
        duration: "2.5 hours",
        is_recurring: true,
        status: "in progress",
        category: "Testing",
        task_tools: ["JMeter", "JUnit"],
        deadline: "2025-05-14",
        due_by: "2025-05-14",
        task_point: 18,
        completed_at: null,
        created_by_id: "user-19",
        workroom_id: "room-10",
        assignedTo: [
          "Heather Clark",
          "Ashley Howell",
          "Kayla Schroeder",
          "Michelle White"
        ]
      },
      {
        id: "task-29",
        created_at: "2024-08-06T08:00:00Z",
        updated_at: "2024-08-06T10:00:00Z",
        title: "Us report we crime",
        duration: "2 hours",
        is_recurring: false,
        status: "scheduled",
        category: "Deployment",
        task_tools: ["Jenkins", "Kubernetes"],
deadline: "2025-05-14",
        due_by: "2025-05-14",
        task_point: 20,
        completed_at: null,
        created_by_id: "user-20",
        workroom_id: "room-10",
        assignedTo: []
      }
    ]
  },
  {
    "roomName": "Frontend Squad",
    "peopleInRoom": true,
    "isActive": true,
    "createdByYou": true,
    "kpi": { // Added room KPI
      "kpiName": "UI Responsiveness",
      "kpiMetric": "91%"
    },
    "members": [
      {
        "name": "Betty Moore",
        "image": "https://source.unsplash.com/random/100x100?sig=50",
        "points": 4159,
        "tasksDone": 50,
        "level": "Beginner",
        "kpiAlignment": "45%",
        "roomKpis": [
          "Boost deployment frequency",
          "Streamline design process"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Component Development",
          "kpiMetric": "89%"
        }
      },
      {
        "name": "Philip Collins",
        "image": "https://source.unsplash.com/random/100x100?sig=51",
        "points": 3941,
        "tasksDone": 85,
        "level": "Intermediate",
        "kpiAlignment": "55%",
        "roomKpis": [
          "Improve UI consistency",
          "Improve test coverage"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Performance Optimization",
          "kpiMetric": "85%"
        }
      },
      {
        "name": "Mathew Carson",
        "image": "https://source.unsplash.com/random/100x100?sig=52",
        "points": 4896,
        "tasksDone": 71,
        "level": "Beginner",
        "kpiAlignment": "85%",
        "roomKpis": [
          "Improve UI consistency",
          "Reduce time to resolve issues"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Accessibility Implementation",
          "kpiMetric": "92%"
        }
      },
      {
        "name": "Robert Garcia",
        "image": "https://source.unsplash.com/random/100x100?sig=53",
        "points": 1246,
        "tasksDone": 21,
        "level": "Intermediate",
        "kpiAlignment": "51%",
        "roomKpis": [
          "Reduce bug count",
          "Streamline design process"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Code Review Quality",
          "kpiMetric": "78%"
        }
      }
    ],
    "tasks": [
      {
        id: "task-30",
        created_at: "2024-08-06T09:00:00Z",
        updated_at: "2024-08-06T11:15:00Z",
        title: "Item program father until",
        duration: "2.25 hours",
        is_recurring: false,
        status: "scheduled",
        category: "Development",
        task_tools: ["React", "Git"],
        deadline: "2025-05-29",
        due_by: "2025-05-29",
        task_point: 18,
        completed_at: null,
        created_by_id: "user-21",
        workroom_id: "room-11",
        assignedTo: []
      },
      {
        id: "task-31",
        created_at: "2024-08-07T10:00:00Z",
        updated_at: "2024-08-07T12:00:00Z",
        title: "House interesting car reality",
        duration: "2 hours",
        is_recurring: false,
        status: "scheduled",
        category: "Testing",
        task_tools: ["Jest", "Cypress"],
        deadline: "2025-06-01",
        due_by: "2025-06-01",
        task_point: 14,
        completed_at: null,
        created_by_id: "user-22",
        workroom_id: "room-11",
        assignedTo: []
      },
      {
        id: "task-32",
        created_at: "2024-08-07T13:00:00Z",
        updated_at: "2024-08-07T15:30:00Z",
        title: "Really impact wind",
        duration: "2.5 hours",
        is_recurring: false,
        status: "in progress",
        category: "Design",
        task_tools: ["Figma", "Miro"],
        deadline: "2025-05-31",
        due_by: "2025-05-31",
        task_point: 20,
        completed_at: null,
        created_by_id: "user-21",
        workroom_id: "room-11",
        assignedTo: [
          "Betty Moore"
        ]
      },
      {
        id: "task-33",
        created_at: "2024-08-08T09:00:00Z",
        updated_at: "2024-08-08T11:00:00Z",
        title: "Plan she soon",
        duration: "2 hours",
        is_recurring: true,
        status: "scheduled",
        category: "Documentation",
        task_tools: ["Storybook", "Confluence"],
        deadline: "2025-06-05",
        due_by: "2025-06-05",
        task_point: 12,
        completed_at: null,
        created_by_id: "user-22",
        workroom_id: "room-11",
        assignedTo: [
          "Philip Collins",
          "Mathew Carson",
          "Robert Garcia"
        ]
      }
    ]
  },
  {
    "roomName": "Marketing Team",
    "peopleInRoom": true,
    "isActive": true,
    "createdByYou": false,
    "kpi": { // Added room KPI
      "kpiName": "Lead Generation",
      "kpiMetric": "83%"
    },
    "members": [
      {
        "name": "Lori Wood",
        "image": "https://source.unsplash.com/random/100x100?sig=145",
        "points": 3396,
        "tasksDone": 99,
        "level": "Intermediate",
        "kpiAlignment": "85%",
        "roomKpis": [
          "Enhance customer satisfaction",
          "Reduce time to resolve issues"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": {  // Added member KPI
          "kpiName": "Campaign Management",
          "kpiMetric": "91%"
        }
      },
      {
        "name": "Cynthia Young",
        "image": "https://source.unsplash.com/random/100x100?sig=146",
        "points": 3381,
        "tasksDone": 53,
        "level": "Expert",
        "kpiAlignment": "86%",
        "roomKpis": [
          "Improve UI consistency",
          "Increase feature delivery"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": {  // Added member KPI
          "kpiName": "Content Marketing",
          "kpiMetric": "87%"
        }
      },
      {
        "name": "Jose Alexander",
        "image": "https://source.unsplash.com/random/100x100?sig=147",
        "points": 2577,
        "tasksDone": 80,
        "level": "Intermediate",
        "kpiAlignment": "52%",
        "roomKpis": [
          "Boost deployment frequency",
          "Streamline design process"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": {  // Added member KPI
          "kpiName": "Social Media Marketing",
          "kpiMetric": "79%"
        }
      },
      {
        "name": "Terri Buckley",
        "image": "https://source.unsplash.com/random/100x100?sig=148",
        "points": 1179,
        "tasksDone": 28,
        "level": "Expert",
        "kpiAlignment": "80%",
        "roomKpis": [
          "Enhance customer satisfaction",
          "Improve test coverage"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "Email Marketing",
          "kpiMetric": "84%"
        }
      },
      {
        "name": "Sandy Goodman",
        "image": "https://source.unsplash.com/random/100x100?sig=149",
        "points": 4125,
        "tasksDone": 98,
        "level": "Beginner",
        "kpiAlignment": "65%",
        "roomKpis": [
          "Reduce bug count",
          "Improve test coverage"
        ],
        "aiSummary": "This member is performing well and aligning with KPIs.",
        "kpi": { // Added member KPI
          "kpiName": "SEO Performance",
          "kpiMetric": "76%"
        }
      }
    ],
    "tasks": [
      {
        id: "task-34",
        created_at: "2024-08-08T10:00:00Z",
        updated_at: "2024-08-08T12:00:00Z",
        title: "South bit occur",
        duration: "2 hours",
        is_recurring: false,
        status: "completed",
        category: "Advertising",
        task_tools: ["Google Ads", "Facebook Ads"],
        deadline: "2025-05-18",
        due_by: "2025-05-18",
        task_point: 16,
        completed_at: "2024-08-08T12:00:00Z",
        created_by_id: "user-23",
        workroom_id: "room-12",
        assignedTo: [
          "Lori Wood",
          "Cynthia Young"
        ]
      },
      {
        id: "task-35",
        created_at: "2024-08-09T09:00:00Z",
        updated_at: "2024-08-09T11:30:00Z",
        title: "Assume beautiful",
        duration: "2.5 hours",
        is_recurring: false,
        status: "in progress",
        category: "Content Creation",
        task_tools: ["WordPress", "Contentful"],
        deadline: "2025-05-22",
        due_by: "2025-05-22",
        task_point: 18,
        completed_at: null,
        created_by_id: "user-24",
        workroom_id: "room-12",
        assignedTo: [
          "Jose Alexander",
          "Terri Buckley"
        ]
      },
      {
        id: "task-36",
        created_at: "2024-08-09T14:00:00Z",
        updated_at: "2024-08-09T16:00:00Z",
        title: "Recently community",
        duration: "2 hours",
        is_recurring: false,
        status: "scheduled",
        category: "Social Media",
        task_tools: ["Hootsuite", "Buffer"],
        deadline: "2025-06-02",
        due_by: "2025-06-02",
        task_point: 14,
        completed_at: null,
        created_by_id: "user-23",
        workroom_id: "room-12",
        assignedTo: [
          "Sandy Goodman"
        ]
      },
      {
        id: "task-37",
        created_at: "2024-08-10T10:00:00Z",
        updated_at: "2024-08-10T12:45:00Z",
        title: "Anyone brother",
        duration: "2.75 hours",
        is_recurring: true,
        status: "in progress",
        category: "Email Marketing",
        task_tools: ["Mailchimp", "SendGrid"],
        deadline: "2025-05-24",
        due_by: "2025-05-24",
        task_point: 20,
        completed_at: null,
        created_by_id: "user-24",
        workroom_id: "room-12",
        assignedTo: [
          "Lori Wood",
          "Terri Buckley",
          "Sandy Goodman"
        ]
      },
      {
        id: "task-38",
        created_at: "2024-08-10T13:00:00Z",
        updated_at: "2024-08-10T15:00:00Z",
        title: "Foot ball",
        duration: "2 hours",
        is_recurring: false,
        status: "completed",
        category: "SEO",
        task_tools: ["SEMrush", "Ahrefs"],
        deadline: "2025-05-20",
        due_by: "2025-05-20",
        task_point: 17,
        completed_at: "2024-08-10T15:00:00Z",
        created_by_id: "user-23",
        workroom_id: "room-12",
        assignedTo: [
          "Cynthia Young",
          "Jose Alexander"
        ]
      }
    ]
  }
];
