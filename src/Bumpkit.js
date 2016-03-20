
import Store from './Store'
import Clock from './Clock'
import Clip from './Clip'
import Beep from './Beep'
import Sampler from './Sampler'

/** Bumpkit
*/

const AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext

class Bumpkit extends Store {
  constructor ({
    tempo = 120,
    resolution = 16,
    signature = 4/4
  } = {}) {
    super()
    this.context = new AudioContext()
    this.setState({
      playing: false,
      tempo,
      resolution,
      signature,
      step: 0,
      tracks: []
    })
    this.clock = new Clock(this.state, this.context)
    this.subscribe(this.clock.setState)
    this.clock.sync(this.tick.bind(this))

    this.tick = this.tick.bind(this)
    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
    this.playPause = this.playPause.bind(this)
    this.stop = this.stop.bind(this)
    this.kill = this.kill.bind(this)

    this.createBeep = this.createBeep.bind(this)
    this.createSampler = this.createSampler.bind(this)
  }

  tick ({ step, when }) {
    const { tracks } = this.state
    this.setState({ step })
    tracks.forEach((t) => {
      t.play({ step, when })
    })
  }

  play () {
    this.setState({ playing: true })
    this.clock.start()
  }

  pause () {
    this.setState({ playing: false })
  }

  playPause () {
    const { playing } = this.state
    if (playing) {
      this.pause()
    } else {
      this.play()
    }
  }

  stop () {
    this.setState({ playing: false })
    this.clock.setState({ step: 0 })
  }

  kill () {
    delete this.context
  }

  createBeep () {
    const { tracks } = this.state
    const beep = new Beep(this.context)
    this.clock.sync(beep.play)

    tracks.push(beep)
    this.setState({ tracks })
    return beep
  }

  createSampler (url) {
    const { tracks } = this.state
    const sampler = new Sampler(this.context)
    sampler.load(url)
    this.clock.sync(sampler.play)

    tracks.push(sampler)
    this.setState({ tracks })
    return sampler
  }

}

export default Bumpkit

// ---- ---- ---- ----
// - trigger ()
// - buffers {}
// - Buffers
//   - loadBuffers

