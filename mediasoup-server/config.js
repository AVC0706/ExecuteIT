

module.exports = {
  server: {
    port: process.env.SERVER_PORT || 8000
  },
  mediasoup: {
    // mediasoup Server settings.
    logLevel: 'warn',
    logTags: [
      'info',
      'ice',
      'dtls',
      'rtp',
      'srtp',
      'rtcp',
      'rbe',
      'rtx'
    ],
    rtcIPv4: process.env.RTC_IP || true,
    rtcIPv6: false,
    rtcAnnouncedIPv4: process.env.RTC_ANNOUNCED_IP || null,
    rtcAnnouncedIPv6: null,
    rtcMinPort: process.env.RTC_MIN_PORT || 40000,
    rtcMaxPort: process.env.RTC_MAX_PORT || 49999,
    // mediasoup Room codecs.
    mediaCodecs: [
      {
        kind: 'audio',
        name: 'opus',
        clockRate: 48000,
        channels: 2,
        parameters: {
          useinbandfec: 1
        }
      },
      {
        kind: 'video',
        name: 'VP8',
        clockRate: 90000
      },
      /*{
        kind: 'video',
        name: 'H264',
        clockRate: 90000,
        parameters: {
          'packetization-mode': 1
        }
      }*/
    ],
    // mediasoup per Peer max sending bitrate (in bps).
    maxBitrate: 500000
  },
  iceServers: [{ 'urls': 'stun:stun.l.google.com:19302' }]
};
