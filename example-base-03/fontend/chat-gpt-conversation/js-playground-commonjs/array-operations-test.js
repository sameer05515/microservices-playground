const mainArr = [
  {
    location: "/data/sample-conversations1.json",
    isLatest: false,
    id: "CONVERSATIONS_23_MAY_2023",
    createdOn: "2023-05-22",
    createdBy: "PREMENDRA",
  },
  {
    location: "/data/sample-conversations2.json",
    isLatest: false,
    id: "CONVERSATIONS_31_MAY_2023",
    createdOn: "2023-05-30",
    createdBy: "PREMENDRA",
  },
  {
    location: "/data/sample-conversations3.json",
    isLatest: false,
    id: "CONVERSATIONS_15_AUG_2023",
    createdOn: "2023-08-14",
    createdBy: "PREMENDRA",
  },
  {
    location: "/data/conversations-09-May-2024.json",
    isLatest: false,
    id: "CONVERSATIONS_09_MAY_2024",
    createdOn: "2024-05-08",
    createdBy: "PREMENDRA",
  },
  {
    location: "/data/conversations-10-May-2024.json",
    isLatest: false,
    id: "CONVERSATIONS_10_MAY_2024",
    createdOn: "2024-05-09",
    createdBy: "PREMENDRA",
  },
  {
    location: "/data/conversations-12-May-2024.json",
    isLatest: false,
    id: "CONVERSATIONS_12_MAY_2024",
    createdOn: "2024-05-11",
    createdBy: "PREMENDRA",
  },
  {
    location: "/data/conversations-24-May-2024.json",
    isLatest: false,
    id: "CONVERSATIONS_24_MAY_2024",
    createdOn: "2024-05-23",
    createdBy: "PREMENDRA",
  },
  {
    location: "/data/conversations-27-May-2024.json",
    isLatest: false,
    id: "CONVERSATIONS_27_MAY_2024",
    createdOn: "2024-05-26",
    createdBy: "PREMENDRA",
  },
  {
    location: "/data/conversations-17-June-2024.json",
    isLatest: false,
    id: "CONVERSATIONS_17_JUNE_2024",
    createdOn: "2024-06-16",
    createdBy: "PREMENDRA",
  },
  {
    location: "/data/conversations-12-July-2024.json",
    isLatest: false,
    id: "CONVERSATIONS_12_JULY_2024",
    createdOn: "2024-07-11",
    createdBy: "PREMENDRA",
  },
  {
    location: "/data/conversations_15_July_2024_Nandini.json",
    isLatest: false,
    id: "CONVERSATIONS_15_JULY_2024_NANDINI",
    createdOn: "2024-07-14",
    createdBy: "NANDINI",
  },
  {
    location: "/data/conversations-20-July-2024.json",
    isLatest: false,
    id: "CONVERSATIONS_20_JULY_2024",
    createdOn: "2024-07-19",
    createdBy: "PREMENDRA",
  },
  {
    location: "/data/conversations-15-Aug-2024.json",
    isLatest: false,
    id: "CONVERSATIONS_15_Aug_2024",
    createdOn: "2024-08-14",
    createdBy: "PREMENDRA",
  },
  {
    location: "/data/conversations-18-Aug-2024.json",
    isLatest: false,
    id: "CONVERSATIONS_18_Aug_2024",
    createdOn: "2024-08-17",
    createdBy: "PREMENDRA",
  },
  {
    location: "/data/conversations-19-Aug-2024.json",
    isLatest: false,
    id: "CONVERSATIONS_19_Aug_2024",
    createdOn: "2024-08-18",
    createdBy: "PREMENDRA",
  },
  {
    location: "/data/conversations-25-Aug-2024.json",
    isLatest: false,
    id: "CONVERSATIONS_25_Aug_2024",
    createdOn: "2024-08-24",
    createdBy: "PREMENDRA",
  },
  {
    location: "/data/conversations-30-Aug-2024.json",
    isLatest: false,
    id: "CONVERSATIONS_30_Aug_2024",
    createdOn: "2024-08-29",
    createdBy: "PREMENDRA",
  },
  {
    location: "/data/conversations-06-Sep-2024.json",
    isLatest: false,
    id: "CONVERSATIONS_06_SEP_2024",
    createdOn: "2024-09-05",
    createdBy: "PREMENDRA",
  },
  {
    location: "/data/conversations-24-Sep-2024.json",
    isLatest: false,
    id: "CONVERSATIONS_24_SEP_2024",
    createdOn: "2024-09-23",
    createdBy: "PREMENDRA",
  },
  {
    location: "/data/conversations-23-Oct-2024.json",
    isLatest: false,
    id: "CONVERSATIONS_23_OCT_2024",
    createdOn: "2024-10-22",
    createdBy: "PREMENDRA",
  },
  {
    location: "/data/conversations-29-Nov-2024.json",
    isLatest: false,
    id: "CONVERSATIONS_29_NOV_2024",
    createdOn: "2024-11-28",
    createdBy: "PREMENDRA",
  },
  {
    location: "/data/conversations-05-Jan-2025.json",
    isLatest: true,
    id: "CONVERSATIONS_05_JAN_2025",
    createdOn: "2025-01-04",
    createdBy: "PREMENDRA",
  },
];

const arr = mainArr.splice(0, 4).map(({ id }) => ({ id }));

console.log(arr);

console.log(arr.reverse().map((v) => v.id));

console.log(
  JSON.stringify(
    //   JsonFileMap.map(({ id }) => ({ id })),
    arr.reverse().map((v) => v.id),
    null,
    0
  )
);

const reversedMap = arr.reverse();

console.log(
  "\n\n\n\n",
  JSON.stringify(
    //   JsonFileMap.map(({ id }) => ({ id })),
    reversedMap.map((v) => v.id),
    null,
    0
  )
);
