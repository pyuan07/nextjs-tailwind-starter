const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

async function generatePWAIcons() {
  const svgPath = path.join(__dirname, '../public/icon-base.svg')
  const publicDir = path.join(__dirname, '../public')

  console.log('🎨 Generating PWA icons from SVG...')

  try {
    // Read the SVG file
    const svgBuffer = fs.readFileSync(svgPath)

    // Generate 192x192 icon
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'))
    console.log('✅ Generated icon-192.png')

    // Generate 512x512 icon
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'))
    console.log('✅ Generated icon-512.png')

    // Generate maskable 192x192 (with padding for safe area)
    await sharp(svgBuffer)
      .resize(154, 154) // 80% of 192 for safe area
      .extend({
        top: 19,
        bottom: 19,
        left: 19,
        right: 19,
        background: { r: 99, g: 102, b: 241, alpha: 1 }, // Match gradient start
      })
      .png()
      .toFile(path.join(publicDir, 'icon-192-maskable.png'))
    console.log('✅ Generated icon-192-maskable.png')

    // Generate maskable 512x512 (with padding for safe area)
    await sharp(svgBuffer)
      .resize(410, 410) // 80% of 512 for safe area
      .extend({
        top: 51,
        bottom: 51,
        left: 51,
        right: 51,
        background: { r: 99, g: 102, b: 241, alpha: 1 }, // Match gradient start
      })
      .png()
      .toFile(path.join(publicDir, 'icon-512-maskable.png'))
    console.log('✅ Generated icon-512-maskable.png')

    // Generate Apple Touch Icon (180x180)
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'))
    console.log('✅ Generated apple-touch-icon.png')

    // Generate favicon-32x32
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon-32x32.png'))
    console.log('✅ Generated favicon-32x32.png')

    // Generate favicon-16x16
    await sharp(svgBuffer)
      .resize(16, 16)
      .png()
      .toFile(path.join(publicDir, 'favicon-16x16.png'))
    console.log('✅ Generated favicon-16x16.png')

    console.log('🎉 All PWA icons generated successfully!')
  } catch (error) {
    console.error('❌ Error generating icons:', error)
    process.exit(1)
  }
}

generatePWAIcons()
