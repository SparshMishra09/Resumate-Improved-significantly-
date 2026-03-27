import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';

// Use Vite's worker loading mechanism
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export const extractTextFromPdf = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  
  try {
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      useSystemFonts: true, // Help with some PDFs
    });
    
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items
        .map((item) => item.str)
        .filter(str => str !== undefined);
      fullText += strings.join(' ') + '\n';
    }

    if (!fullText.trim()) {
      throw new Error("No readable text found in the PDF. It might be an image-based PDF or have complex formatting.");
    }

    return fullText;
  } catch (error) {
    console.error("PDF.js Extraction Error Details:", error);
    if (error.name === 'PasswordException') {
      throw new Error("This PDF is password protected.");
    }
    throw new Error(`Failed to read PDF: ${error.message}`);
  }
};




