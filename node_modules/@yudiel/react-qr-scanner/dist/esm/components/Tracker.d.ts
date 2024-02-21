import React from 'react';
import { Result } from '@zxing/library';
interface TrackerProps {
    result?: Result;
    video: HTMLVideoElement | null;
    constraints?: MediaTrackConstraints;
    deviceId?: string;
    scanDelay: number;
}
declare const Tracker: (props: TrackerProps) => React.JSX.Element;
export default Tracker;
