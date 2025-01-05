class Section {
  constructor(type) {
    this.type = type;
    this.items = [];
  }

  addItem(name, uniqueId) {
    this.items.push({ name, uniqueId });
  }
}

export function mapResponseToSections(response) {
  const sectionMap = new Map();

  response.forEach(({ type, name, uniqueId }) => {
    if (!sectionMap.has(type)) {
      sectionMap.set(type, new Section(type));
    }
    sectionMap.get(type).addItem(name, uniqueId);
  });

  // Convert the Map to an array of Section objects
  return Array.from(sectionMap.values());
}

// Example usage
//   const backendResponse = [
//     { type: "Task", name: "Task 1", uniqueId: "1" },
//     { type: "Task", name: "Task 2", uniqueId: "2" },
//     { type: "Topic", name: "Topic 1", uniqueId: "3" },
//     { type: "Topic", name: "Topic 2", uniqueId: "4" }
//   ];

//   const sections = mapResponseToSections(backendResponse);
//   console.log(sections);
