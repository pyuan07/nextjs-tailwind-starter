const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

// iOS splash screen sizes
const splashSizes = [
  // iPhone
  { name: 'iphone-5-splash', width: 640, height: 1136 },
  { name: 'iphone-6-splash', width: 750, height: 1334 },
  { name: 'iphone-6-plus-splash', width: 1242, height: 2208 },
  { name: 'iphone-x-splash', width: 1125, height: 2436 },
  { name: 'iphone-xr-splash', width: 828, height: 1792 },
  { name: 'iphone-xs-max-splash', width: 1242, height: 2688 },
  { name: 'iphone-12-splash', width: 1170, height: 2532 },
  { name: 'iphone-12-pro-max-splash', width: 1284, height: 2778 },

  // iPad
  { name: 'ipad-splash', width: 1536, height: 2048 },
  { name: 'ipad-pro-10-splash', width: 1668, height: 2224 },
  { name: 'ipad-pro-12-splash', width: 2048, height: 2732 },
]

async function generateSplashScreens() {
  const svgPath = path.join(__dirname, '../public/icon-base.svg')
  const publicDir = path.join(__dirname, '../public')

  console.log('🎨 Generating iOS splash screens...')

  try {
    // Read the SVG file
    const svgBuffer = fs.readFileSync(svgPath)

    for (const splash of splashSizes) {
      console.log(
        `⏳ Generating ${splash.name}.png (${splash.width}x${splash.height})`
      )

      // Calculate icon size (20% of screen width, max 256px)
      const iconSize = Math.min(Math.floor(splash.width * 0.2), 256)

      // Create background with app theme color
      const background = sharp({
        create: {
          width: splash.width,
          height: splash.height,
          channels: 4,
          background: { r: 99, g: 102, b: 241, alpha: 1 }, // Primary color
        },
      })

      // Resize icon
      const resizedIcon = await sharp(svgBuffer)
        .resize(iconSize, iconSize)
        .png()
        .toBuffer()

      // Position icon in center
      const iconLeft = Math.floor((splash.width - iconSize) / 2)
      const iconTop = Math.floor((splash.height - iconSize) / 2)

      // Composite icon on background
      await background
        .composite([
          {
            input: resizedIcon,
            left: iconLeft,
            top: iconTop,
          },
        ])
        .png()
        .toFile(path.join(publicDir, `${splash.name}.png`))

      console.log(`✅ Generated ${splash.name}.png`)
    }

    console.log('🎉 All splash screens generated successfully!')
  } catch (error) {
    console.error('❌ Error generating splash screens:', error)
    process.exit(1)
  }
}

generateSplashScreens()
