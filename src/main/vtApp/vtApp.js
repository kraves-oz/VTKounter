const log = require('electron-log') // remove

export default class vtApp {
  /**
   * Logic and behaviour of each app supported by VT Kounter
   * @param {Object} config - Config for this app
   * @param {Object} callback - Includes callbacks: {onReceiveSuccess(), onReceiveError()}
   */
  constructor(config, callback) {
    // default constructor passing arguments
    this.config = config
    this.callback = callback

    // info for the current running VT
    this.timer = new vtTimer()
  }

  /**
   * Send function to request information from the app
   * This could include a call to the receive()
   */
  send() {
    return
  }

  /**
   * Receiver for the app's response to the send()
   * Expected resolve & reject functions are
   * this.callback.onReceiveSuccess & this.callback.onReceiveError respectively
   */
  receive() {
    return new Promise((resolve,reject) => {
      reject(new Error("Receiver undefined"))
    })
  }

  /**
   * Called when the app leaves config mode and enters show mode
   * e.g. override with OSC server start
   */
  onShowModeStart() {
    this.timer.reset()
    return
  }

  /**
   * Called when the app leaves show mode and enters config mode
   */
  onShowModeStop() {
    return
  }
}

class vtTimer {
  /**
   * Store for current VT info (in ms)
   * Used in show mode GUI
   */
  constructor() {
    this.reset()
  }

  get remaining() {
    var remaining = this.total - this.elapsed
    return remaining >= 0 ? remaining : 0
  }

  set remaining(remaining) {
    if(!this.elapsed)
      this.elapsed = this.total - remaining
    else
      this.total = this.elapsed + remaining
  }

  get seconds() {
    return {
      elapsed: Math.round(this.elapsed/1000),
      remaining: Math.round(this.remaining/1000),
      total: Math.round(this.total/1000)
    }
  }

  get progress() {
    return this.elapsed / this.total
  }

  /**
   * Reset the timer to defaults
   */
  reset() {
    this.elapsed = this.total = 0
    this.cueName = ""
    this.noVT = true
  }
}