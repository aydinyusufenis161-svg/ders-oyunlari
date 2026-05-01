export class AudioEngine {
  static ctx: AudioContext | null = null;
  static isEnabled: boolean = true;
  
  static init() {
    if (!this.isEnabled) return;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    // Resume context if suspended (browser autoplay policy)
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  static playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
    if (!this.isEnabled) return;
    this.init();
    if (!this.ctx) return;
    
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  static playTick() {
    this.playTone(800, 'sine', 0.05, 0.05);
  }

  static playTimerTick() {
    this.playTone(400, 'square', 0.05, 0.02);
  }

  static playCorrect() {
    setTimeout(() => this.playTone(440, 'sine', 0.1, 0.1), 0);
    setTimeout(() => this.playTone(554.37, 'sine', 0.1, 0.1), 100);
    setTimeout(() => this.playTone(659.25, 'sine', 0.2, 0.1), 200);
    setTimeout(() => this.playTone(880, 'sine', 0.4, 0.1), 300);
  }

  static playWrong() {
    this.playTone(300, 'sawtooth', 0.3, 0.1);
    setTimeout(() => this.playTone(250, 'sawtooth', 0.4, 0.1), 150);
  }

  static playBankrupt() {
    this.playTone(200, 'sawtooth', 0.5, 0.15);
    setTimeout(() => this.playTone(150, 'sawtooth', 0.6, 0.15), 300);
    setTimeout(() => this.playTone(100, 'sawtooth', 0.8, 0.15), 600);
  }
  
  static playPass() {
    this.playTone(400, 'sine', 0.2, 0.1);
    setTimeout(() => this.playTone(400, 'sine', 0.2, 0.1), 150);
  }
}
