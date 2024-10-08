import { AgoraVideoPlayer, IRemoteVideoTrack } from 'agora-rtc-react'
import React, { useContext, useState } from 'react'
import RemoteAudioMute from './Controls/Remote/RemoteAudioMute'
import RemoteVideoMute from './Controls/Remote/RemoteVideoMute'
import SwapUser from './Controls/SwapUser'
import PropsContext, { UIKitUser } from './PropsContext'
import RtcContext from './RtcContext'
import TracksContext from './TracksContext'
import VideoPlaceholder from './VideoPlaceholder'

/**
 * React context to expose user array displayed in the smaller view
 */
const MinVideoView = (props: { user: UIKitUser }) => {
  const { mediaStore } = useContext(RtcContext)
  const { styleProps, rtcProps } = useContext(PropsContext)
  const { facingMode } = useContext(TracksContext)

  const {
    minViewStyles,
    videoMode,
    minViewOverlayContainer,
    showSwapUser = false
  } = styleProps || {}
  const renderModeProp = videoMode?.min
  const [isShown, setIsShown] = useState(false)
  const { user } = props

  return (
    <div
      style={{
        ...{ display: 'flex', flex: 1 },
        ...minViewStyles
      }}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
    >
      {user.hasVideo === 1 ? (
        <div
          style={{
            ...{
              display: 'flex',
              flex: 1,
              position: 'relative'
            }
          }}
        >
          <AgoraVideoPlayer
            style={{
              flex: 10,
              display: 'flex',
              transform: facingMode === 'environment' ? 'scaleX(-1)' : 'none'
            }}
            config={{
              fit: renderModeProp !== undefined ? renderModeProp : 'cover'
            }}
            videoTrack={mediaStore[user.uid].videoTrack as IRemoteVideoTrack}
          />
          {isShown && (
            <div
              style={{
                ...{
                  margin: 4,
                  position: 'absolute',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column'
                },
                ...minViewOverlayContainer
              }}
            >
              {!rtcProps.disableRtm && <RemoteVideoMute UIKitUser={user} />}
              {!rtcProps.disableRtm && <RemoteAudioMute UIKitUser={user} />}
              {showSwapUser && <SwapUser UIKitUser={user} />}
            </div>
          )}
        </div>
      ) : (
        <VideoPlaceholder user={user} isShown={isShown} showButtons showSwap />
      )}
    </div>
  )
}

export default MinVideoView
