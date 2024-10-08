import { ILocalVideoTrack } from 'agora-rtc-react';
declare const startScreenshare: (appId: string, channel: string, track: ILocalVideoTrack, screenshareToken?: string | null | undefined, screenshareUid?: number | undefined, tokenUrl?: string | undefined, enableDualStream?: boolean | undefined) => Promise<void>;
declare let stopScreenshare: () => void;
export { startScreenshare, stopScreenshare };
