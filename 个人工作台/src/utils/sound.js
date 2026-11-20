// 电子木鱼音效合成工具
// 使用 Web Audio API 合成"深沉木鱼"音效

let audioCtx = null

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  // 如果处于 suspended 状态，需要用户交互后恢复
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

/**
 * 播放深沉木鱼音效
 * 低频 450Hz，正弦波，余韵 0.25s，带敲击瞬态噪声
 */
export function playMuyuSound() {
  try {
    const ctx = getAudioCtx()
    const now = ctx.currentTime

    // 主音 - 正弦波 450Hz
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(450, now)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1200, now)

    // 包络：快速起音 + 指数衰减
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.5, now + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.3)

    // 敲击瞬态噪声（模拟木鱼的"咔"声）
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.02, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3)
    }
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.3, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02)
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.setValueAtTime(675, now)
    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noise.start(now)
  } catch (e) {
    // 静默降级
    console.warn('音效播放失败:', e)
  }
}
