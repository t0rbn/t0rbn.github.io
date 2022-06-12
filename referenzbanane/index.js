const defaultBanana = [227, 179, 45]

async function initVideo() {
    const videoPlayer = document.querySelector('#video')
    try {
        videoPlayer.srcObject = await window.navigator.mediaDevices.getUserMedia({video: { facingMode: { ideal: "environment" } }})
        videoPlayer.onloadedmetadata = (e) => {
            videoPlayer.play()
        }
    } catch (err) {
        alert(err)
    }
}

function grabCenterPixelRGB() {
    const videoPlayer = document.querySelector('#video')
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.drawImage(videoPlayer, 0, 0, 100, 100)
    const pixel = context.getImageData(50, 50, 1, 1)
    return [pixel.data[0], pixel.data[1], pixel.data[2]]
}

function saveReferencePixel(rgbArr) {
    sessionStorage.setItem('referenceR', rgbArr[0])
    sessionStorage.setItem('referenceG', rgbArr[1])
    sessionStorage.setItem('referenceB', rgbArr[2])
}

function getReferencePixel() {
    const r = sessionStorage.getItem('referenceR')
    const g = sessionStorage.getItem('referenceG')
    const b = sessionStorage.getItem('referenceB')

    if (!r || !g || !b) {
        return defaultBanana
    }
    return [r, g, b]
}

function similarityToReference(testRgbArr) {
    if (!getReferencePixel()) {
        return
    }
    return 1 - testRgbArr.map((v, i) => Math.abs(getReferencePixel()[i] - v)).reduce((a, b) => a + b) / (255 * 3)
}

function getEmojiAndMessageForSimilarity() {
    const similarity = similarityToReference(grabCenterPixelRGB())
    var data = [
        {
            minSimilarity: 0.9,
            emoji: '😍',
            message: 'Die perfekte Banane!'
        },
        {
            minSimilarity: 0.85,
            emoji: '👍',
            message: 'gute Banane'
        },
        {
            minSimilarity: 0.8,
            emoji: '🤷',
            message: 'naja'
        },
        {
            minSimilarity: 0,
            emoji: '💩',
            message: 'bäh'
        }
    ]
    for (const d of data) {
        if (similarity >= d.minSimilarity) {
            return [d.emoji, d.message]
        }
    }
    return ['', '']
}

function renderUi() {
    document.querySelector('.tutorial').style.display = sessionStorage.getItem('hideTutorial') ? 'none' : 'block'

    setInterval(() => {
            const centerPixelRgb = grabCenterPixelRGB()
            const similarityData = getEmojiAndMessageForSimilarity(similarityToReference(centerPixelRgb))
            document.querySelector('.meter .emoji').textContent = similarityData[0]
            document.querySelector('.meter .message').textContent = similarityData[1]
        },
        250
    )
}

function initEventListeners() {
    document.querySelector('#set-reference').addEventListener('click', () => {
        if (window.confirm('Möchtest du wirklich eine neue Referenzbanane übernehmen?')) {
            saveReferencePixel(grabCenterPixelRGB())
            renderUi()
        }
    })

    document.querySelector('#accept-tutorial').addEventListener('click', () => {
        sessionStorage.setItem('hideTutorial', 'yes')
        renderUi()
    })
}

renderUi()
initEventListeners()
initVideo()
