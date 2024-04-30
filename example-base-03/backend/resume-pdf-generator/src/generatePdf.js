const fs = require('fs');
const PDFDocument = require('pdfkit');

// Sample resume JSON
const resume = {
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "123-456-7890",
  "education": {
    "degree": "Bachelor of Science",
    "university": "University of Example",
    "year": "2020"
  },
  "experience": [
    {
      "position": "Software Engineer",
      "company": "Tech Company XYZ",
      "duration": "2018-2022"
    },
    {
      "position": "Intern",
      "company": "Startup ABC",
      "duration": "2017"
    }
  ],
  "skills": ["JavaScript", "Python", "HTML", "CSS"]
};

// Define styles
const styles = {
    title: { fontSize: 20, alignment: 'center' },
    sectionHeading: { fontSize: 14, underline: true },
    contactInfo: { fontSize: 12, color: 'blue' },
    bodyText: { fontSize: 12 }
  };
  
  // Function to generate PDF
  function generatePDF(resume, filePath, styles) {
    const doc = new PDFDocument();
  
    // Pipe the PDF content to a file
    doc.pipe(fs.createWriteStream(filePath));
  
    // Write resume content to PDF using styles
    doc.font('Helvetica');
    doc.text(`Resume of ${resume.name}`, styles.title).moveDown(2);
    doc.text(`Email: ${resume.email}`, styles.contactInfo).moveDown();
    doc.text(`Phone: ${resume.phone}`, styles.contactInfo).moveDown();
    doc.text(`Education: ${resume.education.degree} from ${resume.education.university} (${resume.education.year})`, styles.bodyText).moveDown();
    doc.text('Experience:', styles.sectionHeading).moveDown();
    resume.experience.forEach(exp => {
      doc.text(`- ${exp.position} at ${exp.company} (${exp.duration})`, styles.bodyText).moveDown();
    });
    doc.text('Skills:', styles.sectionHeading).moveDown();
    resume.skills.forEach(skill => {
      doc.text(`- ${skill}`, styles.bodyText).moveDown();
    });
  
    // Finalize the PDF
    doc.end();
  }
  
  // Generate PDF using styles
  generatePDF(resume, './dist/resume-styled.pdf', styles);