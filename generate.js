const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1a1a1a"/>
            <stop offset="100%" style="stop-color:#0d0d0d"/>
        </linearGradient>
    </defs>
    <rect width="512" height="512" rx="100" fill="url(#bgGradient)"/>
    <rect x="56" y="80" width="400" height="120" rx="20" fill="#000000"/>
    <rect x="66" y="90" width="380" height="100" rx="15" fill="#1a1a1a"/>
    <circle cx="128" cy="260" r="50" fill="#a5a5a5"/>
    <circle cx="256" cy="260" r="50" fill="#a5a5a5"/>
    <circle cx="384" cy="260" r="50" fill="#a5a5a5"/>
    <circle cx="456" cy="260" r="50" fill="#ff9f0a"/>
    <circle cx="128" cy="340" r="50" fill="#333333"/>
    <circle cx="256" cy="340" r="50" fill="#333333"/>
    <circle cx="384" cy="340" r="50" fill="#333333"/>
    <circle cx="456" cy="340" r="50" fill="#ff9f0a"/>
    <circle cx="128" cy="420" r="50" fill="#333333"/>
    <circle cx="256" cy="420" r="50" fill="#333333"/>
    <circle cx="384" cy="420" r="50" fill="#333333"/>
    <circle cx="456" cy="420" r="50" fill="#ff9f0a"/>
    <ellipse cx="192" cy="500" rx="92" ry="50" fill="#333333"/>
    <circle cx="384" cy="500" r="50" fill="#333333"/>
    <circle cx="456" cy="500" r="50" fill="#ff9f0a"/>
    <text x="128" y="275" font-family="Arial" font-size="40" fill="#000" text-anchor="middle" font-weight="bold">AC</text>
    <text x="256" y="275" font-family="Arial" font-size="40" fill="#000" text-anchor="middle" font-weight="bold">±</text>
    <text x="384" y="275" font-family="Arial" font-size="40" fill="#000" text-anchor="middle" font-weight="bold">%</text>
    <text x="456" y="275" font-family="Arial" font-size="35" fill="#fff" text-anchor="middle" font-weight="bold">÷</text>
    <text x="128" y="355" font-family="Arial" font-size="45" fill="#fff" text-anchor="middle" font-weight="bold">7</text>
    <text x="256" y="355" font-family="Arial" font-size="45" fill="#fff" text-anchor="middle" font-weight="bold">8</text>
    <text x="384" y="355" font-family="Arial" font-size="45" fill="#fff" text-anchor="middle" font-weight="bold">9</text>
    <text x="456" y="355" font-family="Arial" font-size="35" fill="#fff" text-anchor="middle" font-weight="bold">×</text>
    <text x="128" y="435" font-family="Arial" font-size="45" fill="#fff" text-anchor="middle" font-weight="bold">4</text>
    <text x="256" y="435" font-family="Arial" font-size="45" fill="#fff" text-anchor="middle" font-weight="bold">5</text>
    <text x="384" y="435" font-family="Arial" font-size="45" fill="#fff" text-anchor="middle" font-weight="bold">6</text>
    <text x="456" y="435" font-family="Arial" font-size="35" fill="#fff" text-anchor="middle" font-weight="bold">−</text>
    <text x="192" y="515" font-family="Arial" font-size="45" fill="#fff" text-anchor="middle" font-weight="bold">0</text>
    <text x="384" y="515" font-family="Arial" font-size="35" fill="#fff" text-anchor="middle" font-weight="bold">.</text>
    <text x="456" y="515" font-family="Arial" font-size="40" fill="#fff" text-anchor="middle" font-weight="bold">=</text>
</svg>`;

async function generateIcons() {
    try {
        const sharp = require('sharp');
        
        console.log('🚀 Генерация иконок...\n');
        
        const svgBuffer = Buffer.from(svgContent);
        
        for (const size of sizes) {
            const outputPath = path.join(__dirname, `icon-${size}.png`);
            
            await sharp(svgBuffer)
                .resize(size, size)
                .png()
                .toFile(outputPath);
            
            console.log(`✅ icon-${size}.png (${size}x${size})`);
        }
        
        console.log('\n✅ Все иконки успешно сгенерированы!');
        
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND' && error.message.includes('sharp')) {
            console.log('\n❌ Модуль "sharp" не установлен.');
            console.log('\n📦 Установите зависимости командой:');
            console.log('   npm install\n');
        } else {
            console.error('\n❌ Ошибка:', error.message);
        }
        process.exit(1);
    }
}

generateIcons();
