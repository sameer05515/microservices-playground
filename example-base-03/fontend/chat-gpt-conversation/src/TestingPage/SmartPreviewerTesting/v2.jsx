import React, { useState } from "react";
import MDSectionV6 from "../../common/components/MDSection/v6";
import { availableOutputTypes } from "../../common/components/SmartPreviewer/utils";
import SmartPreviewer from "../../common/components/SmartPreviewer/v1";

const initialContent = `
The **Mahakumbh**, also known as the **Kumbh Mela**, is one of the largest spiritual gatherings in the world, held every twelve years at four sacred riverbank locations in India: Prayagraj, Haridwar, Ujjain, and Nashik. The festival is deeply rooted in Hindu mythology and is based on the belief that bathing in the holy rivers during the auspicious time of the Kumbh Mela can cleanse individuals of their sins and help them attain liberation, or moksha. Millions of devotees, including sadhus, pilgrims, and tourists, gather to participate in rituals, take a holy dip, and witness the grandeur of this extraordinary event.

The origins of the Mahakumbh trace back to the mythological tale of the **Samudra Manthan**, or the churning of the ocean of milk, as described in Hindu scriptures. It is believed that during the churning, the celestial nectar of immortality, known as **amrit**, spilled at four locations, which became the sites of the Mahakumbh. The planetary alignments during the festival are said to replicate the celestial positions at the time of the mythological event, making the occasion immensely auspicious. Each location hosts the Mahakumbh in a rotational cycle, ensuring its continuity and cultural significance.

The Mahakumbh is not just a religious event but also a symbol of India's rich cultural and spiritual diversity. Pilgrims from all walks of life, including ascetics, sages, and householders, converge at the Mela to seek blessings and spiritual solace. The sight of naga sadhus (naked ascetics) performing rituals, the melodious chanting of hymns, and the vibrant processions of saints create an otherworldly atmosphere that is both mesmerizing and inspiring. The event also serves as a platform for spiritual discourse, where learned scholars and gurus engage in discussions about philosophy, religion, and the essence of life.

Apart from its spiritual and cultural significance, the Mahakumbh is a logistical marvel, showcasing India's organizational prowess. Managing such a massive gathering involves meticulous planning to provide infrastructure, healthcare, security, and sanitation for millions of visitors. Temporary tent cities are constructed to accommodate pilgrims, while volunteers and authorities work tirelessly to ensure the smooth functioning of the event. The Mahakumbh, therefore, stands as a testament to India's unity in diversity, blending faith, tradition, and modernity into an awe-inspiring spectacle.



`;

const SmartPreviewerTestingV2 = () => {
  const [content, setContent] = useState(initialContent);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6">
      {/* Dashboard Header */}
      <h2 className="text-3xl font-semibold text-center text-blue-600 dark:text-blue-400 mb-6 md:text-4xl">
        MDSection and SmartPreviewer Testing Dashboard
      </h2>

      {/* Markdown Input Section */}
      <div className="mb-8">
        <label htmlFor="markdown-input" className="block text-lg font-medium mb-2">
          Enter Markdown Content:
        </label>
        <textarea
          id="markdown-input"
          className="w-full p-4 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
          rows="8"
          placeholder="Type your Markdown content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>

      {/* Rendered Markdown Sections */}
      <div className="space-y-10">
        <SmartPreviewer
          className="rounded-lg"
          data={{ content, textOutputType: availableOutputTypes.MARKDOWN }}
        />
        <MDSectionV6 content={content} />
      </div>
    </div>
  );
};

export default SmartPreviewerTestingV2;
