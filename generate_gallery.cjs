const fs = require('fs');
const path = require('path');

const publicGalleryDir = path.join(__dirname, 'public', 'gallery');
const outputFilePath = path.join(__dirname, 'src', 'data', 'gallery.js');

try {
  const files = fs.readdirSync(publicGalleryDir);
  const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
  
  // Sort naturally so sunrise-2 comes before sunrise-10
  imageFiles.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));

  const galleryItems = imageFiles.map((file, index) => {
    return `  {
    id: ${index + 1},
    url: '/gallery/${file}',
    alt: 'Gallery image ${file.replace(/\.[^/.]+$/, "")}',
  },`;
  });

  const fileContent = `// Automatically generated gallery images
export const galleryImages = [
${galleryItems.join('\n')}
];
`;

  fs.writeFileSync(outputFilePath, fileContent, 'utf-8');
  console.log(`Successfully wrote ${imageFiles.length} items to ${outputFilePath}`);
} catch (error) {
  console.error('Error generating gallery:', error);
}
