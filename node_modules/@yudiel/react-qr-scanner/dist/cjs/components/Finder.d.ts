import React from 'react';
import { Result } from '@zxing/library';
interface FinderProps {
    scanCount: number;
    hideCount: boolean;
    tracker: boolean;
    border?: number;
    result?: Result;
    video: HTMLVideoElement | null;
    constraints?: MediaTrackConstraints;
    deviceId?: string;
    scanDelay: number;
}
export declare const Finder: (props: FinderProps) => React.JSX.Element;
export {};
