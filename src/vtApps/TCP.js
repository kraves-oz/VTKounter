const vtApp = require('../vtApp')
//const dgram = require('dgram')
const net = require('net')
//const log = require('electron-log')

class vtAppTcp extends vtApp {
  constructor(...args) {
    super(...args)

    this.name = "TCP"
    this.longName = "Generic TCP Countdown Timer"

    this.controls = {
      ...this.controls,
      port: {
        label: 'Port',
        type: 'string',
        default: '56789',
        required: true,
    },
    }

    // create client
    this.client = null

    // used to store last time stamp received
    this.lastReceivedTime = 0

  }

  send() {
    // send each command to PlaybackPro Plus
  }

  receive(response) {
    //log.info(response)

    response = response.toString()

    this.timer.noVT = false

    /// Break response string into arguments///

    switch(true) {
      case (response == 'N/A'):
        // returns 'N/A' when no video is playing
        this.timer.reset()
        break
      
      case (/(\d{2}:){2}\d{2}/.test(response)):
        // response is a remaining timestamp - HH:MM:SS
          
        break

      default:
        // otherwise assume it's the cue name
        this.timer.cueName = response
    }

    // update the GUI
    this.onSuccess()
  }

  onShowModeStart() {
    super.onShowModeStart()

    try {
      switch(this.config.port) {
        case this.TCP:
          this.client = new net.Socket()
          this.nextTCPCommand = 0

          this.client.connect(this.config.port, this.config.ip, () => {
            this.onSuccess()
            // send the next command
            this.client.write(this.commands[this.nextTCPCommand++])
          })

          this.client.on('data', (response) => {
            this.receive(response)
            // now send the next one
            this.client.write(this.commands[this.nextTCPCommand++])
          })
          break

        default:
          // otherwise throw an error
          this.onError(new Error(`Port '${this.config.port}' not supported`))
          return
      }

      this.client.on('error', this.onError)
    }
    catch(err) {
      this.onError(err)
    }
  }

  onShowModeStop() {
    super.onShowModeStop()

    this.lastReceivedTime = 0

    switch(this.config.port) {
//      case this.UDP:
//        if(this.client.close)
//          this.client.close()
//        break
      case this.TCP:
        if(this.client.destroy)
          this.client.destroy()
        break
    }
    
    this.client = null
  }

  get nextTCPCommand() {
    return this._nextTCPCommand
  }

  set nextTCPCommand(index) {
    if(index >= this.commands.length)
      index = 0
    
    this._nextTCPCommand = index
  }
}

module.exports = vtAppTcp