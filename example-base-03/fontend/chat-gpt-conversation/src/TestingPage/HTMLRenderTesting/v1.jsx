import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

//...

export default function HTMLRenderTestingV1() {
  const markdown = {
    description: "<p>Hello from the other </p>\n<p><strong>side</strong></p>",
  };

  const my2 = {
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
  };

  const my3 = {
    content:
      '<p>Below are links related to Creating the React component Library</p><ol><li><a href="https://www.youtube.com/watch?v=XHQi5a0TmMc">How to Create and Publish a React Component Library</a> by Alex Eagleson</li><li><a href="https://www.youtube.com/watch?v=L8SxJ_cN1qc">Build a UI Library with React, Typescript, TailwindCSS and Storybook</a>. By Code With Gionatha</li><li><a href="https://www.youtube.com/watch?v=KxnvvkNsSvs">How To Publish React Hooks And Components As NPM Package? A Beginner\'s Guide.</a> by tapaScript by Tapas Adhik</li></ol>',
    textOutputType: "html",
    textInputType: "CKEditor",
  };

  return (
    <>
      <ReactMarkdown children={markdown.description} rehypePlugins={[rehypeRaw]} />

      <ReactMarkdown
        children={my2.content}
        rehypePlugins={[rehypeRaw]}
        className={"prose dark:prose-invert max-w-full"}
        remarkPlugins={[remarkGfm]}
      />
      <ReactMarkdown
        children={my3.content}
        rehypePlugins={[rehypeRaw]}
        className={"prose dark:prose-invert max-w-full"}
        remarkPlugins={[remarkGfm]}
      />
    </>
  );
}
