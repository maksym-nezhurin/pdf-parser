const pdfjsLib = require('pdfjs-dist/build/pdf');
const {writeFile} = require("fs");

const pdfPath = 'src/test.pdf';

async function parsePDFToJSON() {
    try {
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        const pdf = await loadingTask.promise;

        const numPages = pdf.numPages;
        const jsonData = [];

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            console.log(textContent.items)
            const pageData = textContent.items.map((textItem) => {
                console.log(textItem.str)
                return textItem.str
            });
            jsonData.push({ page: pageNum, data: pageData });

            if (pageNum === numPages) {
                const jsonStr = JSON.stringify(jsonData);
                await writeFile('output.json', jsonStr, () => {
                    console.log('Finished')
                });
                console.log('PDF successfully parsed and converted to JSON.');
            }
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

parsePDFToJSON();
