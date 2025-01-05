class Section {
  constructor(type, uniqueId) {
    this.uniqueId = uniqueId;
    this.type = type;
    this.items = [];
  }

  addItem(name, uniqueId) {
    this.items.push({ name, uniqueId });
  }
}

export function mapResponseToSectionsForLeftList(response) {
  const sectionMap = new Map();

  response.forEach(({ type, name, uniqueId }) => {
    if (!sectionMap.has(type)) {
      sectionMap.set(type, new Section(type, `section_${type}`));
    }
    sectionMap.get(type).addItem(name, uniqueId);
  });

  // Convert the Map to an array of Section objects
  return Array.from(sectionMap.values());
}
