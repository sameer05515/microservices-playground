import { isValidInteger } from "../../common/utils/basic-validations";

export const data = [
  undefined,
  null,
  {},
  "A string",
  {
    content:
      '<p>Below are links related to Creating the React component Library</p><ol><li><a href="https://www.youtube.com/watch?v=XHQi5a0TmMc">How to Create and Publish a React Component Library</a> by Alex Eagleson</li><li><a href="https://www.youtube.com/watch?v=L8SxJ_cN1qc">Build a UI Library with React, Typescript, TailwindCSS and Storybook</a>. By Code With Gionatha</li><li><a href="https://www.youtube.com/watch?v=KxnvvkNsSvs">How To Publish React Hooks And Components As NPM Package? A Beginner\'s Guide.</a> by tapaScript by Tapas Adhik</li></ol>',
    textOutputType: "html",
    textInputType: "CKEditor",
  },
  {
    content:
      "# Different ways to create a web application\n\n## Business Logic\n1. Backend Application should have APIs to perform Crud operations on Topics, Sections, Tweets, Tags\n2. Frontend Application to consume APIs to Save, Update, RetrieveAll, RetrieveByUniqueId\n3. SignUp, Login, and Authorization APIs as well as GUIs\n4. Reporting APIs as well as GUIs",
    textOutputType: "markdown",
    textInputType: "TextArea",
  },
  {
    content:
      "India is a vibrant land of unity in diversity. It boasts numerous languages, religions, and traditions coexisting harmoniously. From the snowy Himalayas in the north to the tropical beaches in the south, its cultural and geographical variety fascinates everyone. Festivals like Diwali, Eid, and Christmas unite people across boundaries.",
    textOutputType: "text",
    textInputType: "TextArea",
  },
  {
    content: `
  country: India
  states:
    - name: Rajasthan
      capital: Jaipur
    - name: Kerala
      capital: Thiruvananthapuram
    - name: West Bengal
      capital: Kolkata
  diversity:
    languages: [Hindi, Bengali, Tamil, Telugu, Malayalam]
    religions: [Hinduism, Islam, Christianity, Sikhism, Buddhism]
    climates: [Desert, Tropical, Alpine]
  
      `,
    textOutputType: "yaml",
    textInputType: "TextArea",
  },
  {
    content: `
  India's Diversity:
      The land of various cultures and traditions.
          It spans from the mountains of the Himalayas.
      To the coastal plains of the South.
          People here celebrate a spectrum of festivals.
      Respecting different religions, languages, and cuisines.
      `,
    textOutputType: "skeleton",
    textInputType: "TextArea",
  },
  {
    content: `
The **Mahakumbh**, also known as the **Kumbh Mela**, is one of the largest spiritual gatherings in the world, held every twelve years at four sacred riverbank locations in India: Prayagraj, Haridwar, Ujjain, and Nashik. The festival is deeply rooted in Hindu mythology and is based on the belief that bathing in the holy rivers during the auspicious time of the Kumbh Mela can cleanse individuals of their sins and help them attain liberation, or moksha. Millions of devotees, including sadhus, pilgrims, and tourists, gather to participate in rituals, take a holy dip, and witness the grandeur of this extraordinary event.

The origins of the Mahakumbh trace back to the mythological tale of the **Samudra Manthan**, or the churning of the ocean of milk, as described in Hindu scriptures. It is believed that during the churning, the celestial nectar of immortality, known as **amrit**, spilled at four locations, which became the sites of the Mahakumbh. The planetary alignments during the festival are said to replicate the celestial positions at the time of the mythological event, making the occasion immensely auspicious. Each location hosts the Mahakumbh in a rotational cycle, ensuring its continuity and cultural significance.

The Mahakumbh is not just a religious event but also a symbol of India's rich cultural and spiritual diversity. Pilgrims from all walks of life, including ascetics, sages, and householders, converge at the Mela to seek blessings and spiritual solace. The sight of naga sadhus (naked ascetics) performing rituals, the melodious chanting of hymns, and the vibrant processions of saints create an otherworldly atmosphere that is both mesmerizing and inspiring. The event also serves as a platform for spiritual discourse, where learned scholars and gurus engage in discussions about philosophy, religion, and the essence of life.

Apart from its spiritual and cultural significance, the Mahakumbh is a logistical marvel, showcasing India's organizational prowess. Managing such a massive gathering involves meticulous planning to provide infrastructure, healthcare, security, and sanitation for millions of visitors. Temporary tent cities are constructed to accommodate pilgrims, while volunteers and authorities work tirelessly to ensure the smooth functioning of the event. The Mahakumbh, therefore, stands as a testament to India's unity in diversity, blending faith, tradition, and modernity into an awe-inspiring spectacle.
    `,
    textOutputType: "text",
    textInputType: "TextArea",
  },
  {
    content: `
The **Mahakumbh**, also known as the **Kumbh Mela**, is one of the largest spiritual gatherings in the world, held every twelve years at four sacred riverbank locations in India: Prayagraj, Haridwar, Ujjain, and Nashik. The festival is deeply rooted in Hindu mythology and is based on the belief that bathing in the holy rivers during the auspicious time of the Kumbh Mela can cleanse individuals of their sins and help them attain liberation, or moksha. Millions of devotees, including sadhus, pilgrims, and tourists, gather to participate in rituals, take a holy dip, and witness the grandeur of this extraordinary event.

The origins of the Mahakumbh trace back to the mythological tale of the **Samudra Manthan**, or the churning of the ocean of milk, as described in Hindu scriptures. It is believed that during the churning, the celestial nectar of immortality, known as **amrit**, spilled at four locations, which became the sites of the Mahakumbh. The planetary alignments during the festival are said to replicate the celestial positions at the time of the mythological event, making the occasion immensely auspicious. Each location hosts the Mahakumbh in a rotational cycle, ensuring its continuity and cultural significance.

The Mahakumbh is not just a religious event but also a symbol of India's rich cultural and spiritual diversity. Pilgrims from all walks of life, including ascetics, sages, and householders, converge at the Mela to seek blessings and spiritual solace. The sight of naga sadhus (naked ascetics) performing rituals, the melodious chanting of hymns, and the vibrant processions of saints create an otherworldly atmosphere that is both mesmerizing and inspiring. The event also serves as a platform for spiritual discourse, where learned scholars and gurus engage in discussions about philosophy, religion, and the essence of life.

Apart from its spiritual and cultural significance, the Mahakumbh is a logistical marvel, showcasing India's organizational prowess. Managing such a massive gathering involves meticulous planning to provide infrastructure, healthcare, security, and sanitation for millions of visitors. Temporary tent cities are constructed to accommodate pilgrims, while volunteers and authorities work tirelessly to ensure the smooth functioning of the event. The Mahakumbh, therefore, stands as a testament to India's unity in diversity, blending faith, tradition, and modernity into an awe-inspiring spectacle.
    `,
    textOutputType: "markdown",
    textInputType: "TextArea",
  },
  {
    content: `
The **Mahakumbh**, also known as the **Kumbh Mela**, is one of the largest spiritual gatherings in the world, held every twelve years at four sacred riverbank locations in India: Prayagraj, Haridwar, Ujjain, and Nashik. The festival is deeply rooted in Hindu mythology and is based on the belief that bathing in the holy rivers during the auspicious time of the Kumbh Mela can cleanse individuals of their sins and help them attain liberation, or moksha. Millions of devotees, including sadhus, pilgrims, and tourists, gather to participate in rituals, take a holy dip, and witness the grandeur of this extraordinary event.

The origins of the Mahakumbh trace back to the mythological tale of the **Samudra Manthan**, or the churning of the ocean of milk, as described in Hindu scriptures. It is believed that during the churning, the celestial nectar of immortality, known as **amrit**, spilled at four locations, which became the sites of the Mahakumbh. The planetary alignments during the festival are said to replicate the celestial positions at the time of the mythological event, making the occasion immensely auspicious. Each location hosts the Mahakumbh in a rotational cycle, ensuring its continuity and cultural significance.

The Mahakumbh is not just a religious event but also a symbol of India's rich cultural and spiritual diversity. Pilgrims from all walks of life, including ascetics, sages, and householders, converge at the Mela to seek blessings and spiritual solace. The sight of naga sadhus (naked ascetics) performing rituals, the melodious chanting of hymns, and the vibrant processions of saints create an otherworldly atmosphere that is both mesmerizing and inspiring. The event also serves as a platform for spiritual discourse, where learned scholars and gurus engage in discussions about philosophy, religion, and the essence of life.

Apart from its spiritual and cultural significance, the Mahakumbh is a logistical marvel, showcasing India's organizational prowess. Managing such a massive gathering involves meticulous planning to provide infrastructure, healthcare, security, and sanitation for millions of visitors. Temporary tent cities are constructed to accommodate pilgrims, while volunteers and authorities work tirelessly to ensure the smooth functioning of the event. The Mahakumbh, therefore, stands as a testament to India's unity in diversity, blending faith, tradition, and modernity into an awe-inspiring spectacle.
    `,
    /**Intentionally not passing the other values*/
    // textOutputType: "text",
    // textInputType: "TextArea",
  },
  {
    content: `
<div style="max-width: 800px; margin: 0 auto; padding: 16px; font-family: Arial, sans-serif; line-height: 1.6;">
  <h1 style="font-size: 24px; font-weight: bold; color: #1D4ED8; margin-bottom: 16px;">The Cow</h1>
  <p style="color: #374151; margin-bottom: 16px;">
    The cow is a domestic animal and has been a faithful companion to humans for thousands of years. Known for its gentle nature and usefulness, the cow holds a special place in agriculture and daily life. It belongs to the Bovidae family and is found in almost every corner of the world, adapting to various climates and environments.
  </p>
  <h2 style="font-size: 20px; font-weight: bold; color: #047857; margin-bottom: 12px;">Importance in Agriculture</h2>
  <p style="color: #374151; margin-bottom: 16px;">
    Cows play a pivotal role in agriculture. They are primarily raised for their milk, which serves as a source of nutrition for millions of people. Dairy products like cheese, butter, and yogurt are made from cow's milk. In addition, cows are used for plowing fields in many rural areas where modern machinery is unavailable, making them indispensable to small-scale farmers.
  </p>
  <h2 style="font-size: 20px; font-weight: bold; color: #047857; margin-bottom: 12px;">Cultural Significance</h2>
  <p style="color: #374151; margin-bottom: 16px;">
    In many cultures, cows are considered sacred and revered. For example, in India, the cow is a symbol of wealth, strength, and abundance. It is often worshiped and regarded as a maternal figure, providing sustenance to people. This reverence is reflected in festivals and rituals dedicated to cows in various parts of the country.
  </p>
  <h2 style="font-size: 20px; font-weight: bold; color: #047857; margin-bottom: 12px;">Environmental Benefits</h2>
  <p style="color: #374151; margin-bottom: 16px;">
    Beyond their agricultural and cultural significance, cows contribute to the environment by producing manure, which is a natural fertilizer. Manure improves soil fertility and reduces the need for chemical fertilizers, promoting sustainable farming practices. Additionally, biogas produced from cow dung is an eco-friendly alternative to fossil fuels, aiding in the reduction of carbon footprints.
  </p>
  <h2 style="font-size: 20px; font-weight: bold; color: #047857; margin-bottom: 12px;">Conclusion</h2>
  <p style="color: #374151; margin-bottom: 16px;">
    The cow is an invaluable part of human society, contributing to agriculture, culture, and the environment. Its importance transcends boundaries and cultures, making it a symbol of harmony and utility. Protecting and caring for cows ensures a sustainable future for generations to come.
  </p>
</div>

    `,
    textOutputType: "html",
    textInputType: "CKEditor",
  },
];

export const getNextIndex = (index = 0) => {
  if (!isValidInteger(index) || index < 0) {
    return -1;
  }
  return (index + data.length + 1) % data.length;
};
