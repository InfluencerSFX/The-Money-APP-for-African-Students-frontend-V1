const VERSION = '1.0.2';
const DEFAULT_NO_OF_LIVENESS_FRAMES = 8;
const PORTRAIT_ID_PREVIEW_WIDTH = 396;
const PORTRAIT_ID_PREVIEW_HEIGHT = 527;

function isSamsungMultiCameraDevice() {
  const matchedModelNumber = navigator.userAgent.match(/SM-[N|G]\d{3}/);
  if (!matchedModelNumber) {
    return false;
  }

  const modelNumber = parseInt(matchedModelNumber[0].match(/\d{3}/)[0], 10);
  const smallerModelNumber = 970; // S10e
  return !Number.isNaN(modelNumber) && modelNumber >= smallerModelNumber;
}

function getLivenessFramesIndices(totalNoOfFrames, numberOfFramesRequired = DEFAULT_NO_OF_LIVENESS_FRAMES) {
  const selectedFrames = [];

  if (totalNoOfFrames < numberOfFramesRequired) {
    throw new Error('SmartCameraWeb: Minimum required no of frames is ', numberOfFramesRequired);
  }

  const frameDivisor = numberOfFramesRequired - 1;
  const frameInterval = Math.floor(totalNoOfFrames / frameDivisor);

  // NOTE: when we have satisfied our required 8 frames, but have good
  // candidates, we need to start replacing from the second frame
  let replacementFrameIndex = 1;

  for (let i = 0; i < totalNoOfFrames; i += frameInterval) {
    if (selectedFrames.length < 8) {
      selectedFrames.push(i);
    } else {
      // ACTION: replace frame, then sort selectedframes
      selectedFrames[replacementFrameIndex] = i;
      selectedFrames.sort((a, b) => a - b);

      // ACTION: update replacement frame index
      replacementFrameIndex += 1;
    }
  }

  // INFO: if we don't satisfy our requirement, we add the last index
  const lastFrameIndex = totalNoOfFrames - 1;

  if (selectedFrames.length < 8 && !selectedFrames.includes(lastFrameIndex)) {
    selectedFrames.push(lastFrameIndex);
  }

  return selectedFrames;
}

class SmartFileUpload {
  static memoryLimit = 10240000;

  static supportedTypes = ['image/jpeg', 'image/png'];

  static getHumanSize(numberOfBytes) {
    // Approximate to the closest prefixed unit
    const units = [
      'B',
      'kB',
      'MB',
      'GB',
      'TB',
      'PB',
      'EB',
      'ZB',
      'YB',
    ];
    const exponent = Math.min(
      Math.floor(Math.log(numberOfBytes) / Math.log(1024)),
      units.length - 1,
    );
    const approx = numberOfBytes / 1024 ** exponent;
    const output = exponent === 0
      ? `${numberOfBytes} bytes`
      : `${approx.toFixed(0)} ${units[exponent]}`;

    return output;
  }

  static getData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = () => {
        reject(new Error('An error occurred reading the file. Please check the file, and try again'));
      };
      reader.readAsDataURL(file);
    });
  }

  static async retrieve(files) {
    if (files.length > 1) {
      throw new Error('Only one file upload is permitted at a time');
    }

    const file = files[0];

    if (!SmartFileUpload.supportedTypes.includes(file.type)) {
      throw new Error('Unsupported file format. Please ensure that you are providing a JPG or PNG image');
    }

    if (file.size > SmartFileUpload.memoryLimit) {
      throw new Error(`${file.name} is too large. Please ensure that the file is less than ${SmartFileUpload.getHumanSize(SmartFileUpload.memoryLimit)}.`);
    }

    const imageAsDataUrl = await SmartFileUpload.getData(file);

    return imageAsDataUrl;
  }
}

function scwTemplateString() {
  return `
  <link rel="preconnect" href="https://fonts.gstatic.com"> 
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap" rel="stylesheet">

  <style>
    :host {
      --color-active: #001096;
      --color-default: #2D2B2A;
      --color-disabled: #848282;
    }

    * {
      font-family: 'DM Sans', sans-serif;
    }

    [hidden] {
      display: none !important;
    }

    [disabled] {
      cursor: not-allowed !important;
      filter: grayscale(75%);
    }

    .visually-hidden {
      border: 0;
      clip: rect(1px 1px 1px 1px);
      clip: rect(1px, 1px, 1px, 1px);
      height: auto;
      margin: 0;
      overflow: hidden;
      padding: 0;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    }

    img {
      height: auto;
      max-width: 100%;
      transform: scaleX(-1);
    }

    video {
      background-color: black;
    }

    a {
      color: currentColor;
      text-decoration: none;
    }

    svg {
      max-width: 100%;
    }

    .color-gray {
      color: #797979;
    }

    .color-red {
      color: red;
    }

    .color-richblue {
      color: #4E6577;
    }

    .color-richblue-shade {
      color: #0E1B42;
    }

    .color-digital-blue {
      color: #001096 !important;
    }

    .color-deep-blue {
      color: #001096;
    }

    .center {
      text-align: center;
      margin-left: auto;
      margin-right: auto;
    }

    .font-size-small {
      font-size: .75rem;
    }

    .font-size-large {
      font-size: 1.5rem;
    }

    .text-transform-uppercase {
      text-transform: uppercase;
    }

    [id*=-"screen"] {
      min-block-size: 100%;
    }

    [data-variant~="full-width"] {
      inline-size: 100%;
    }

    .flow > * + * {
      margin-top: 1rem;
    }

    .button {
      --button-color: var(--color-default);
      -webkit-appearance: none;
      appearance: none;
      border-radius: 2.5rem;
      border: 0;
      background-color: transparent;
      color: #fff;
      cursor: pointer;
      display: block;
      font-size: 18px;
      font-weight: 600;
      padding: .75rem 1.5rem;
      text-align: center;
    }

    .button:hover,
    .button:focus,
    .button:active {
      --button-color: var(--color-active);
    }

    .button:disabled {
      --button-color: var(--color-disabled);
    }

    .button[data-variant~='solid'] {
      background-color: var(--button-color);
      border: 2px solid var(--button-color);
    }

    .button[data-variant~='outline'] {
      color: var(--button-color);
      border: 2px solid var(--button-color);
    }

    .button[data-variant~='ghost'] {
      padding: 0px;
      color: var(--button-color);
      background-color: transparent;
    }

    .icon-btn {
      appearance: none;
      background: none;
      border: none;
      color: hsl(0deg 0% 94%);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px 8px;
    }
    .justify-right {
      justify-content: end !important;
    }
    .nav {
      display: flex;
      justify-content: space-between;
    }

    .back-wrapper {
      display: flex;
      align-items: center;
    }

    .back-button {
      display: block !important;
    }
    .back-button-text {
      font-size: 11px;
      line-height: 11px;
      color: rgb(21, 31, 114);
    }
    .section {
      border: 1px solid #f4f4f4;
      border-radius: .5rem;
      margin-left: auto;
      margin-right: auto;
      max-width: 35ch;
      padding: 1rem;
    }

    .selfie-review-image {
      overflow: hidden;
      aspect-ratio: 1/1;
    }

    #review-image {
      scale: 1.75;
    }

    @media (max-aspect-ratio: 1/1) {
      #review-image {
        transform: scaleX(-1) translateY(-10%);
      }
    }

    .tips,
    .powered-by {
      align-items: center;
      border-radius: .25rem;
      color: #4E6577;
      display: flex;
      justify-content: center;
      letter-spacing: .075em;
    }

    .powered-by {
      box-shadow: 0px 2.57415px 2.57415px rgba(0, 0, 0, 0.06);
      display: inline-flex;
      font-size: .5rem;
    }

    .tips {
      margin-left: auto;
      margin-right: auto;
      max-width: 17rem;
    }

    .tips > * + *,
    .powered-by > * + * {
      display: inline-block;
      margin-left: .5em;
    }

    .powered-by .company {
      color: #18406D;
      font-weight: 700;
      letter-spacing: .15rem;
    }

    .logo-mark {
      background-color: #004071;
      display: inline-block;
      padding: .25em .5em;
    }

    .logo-mark svg {
      height: auto;
      justify-self: center;
      width: .75em;
    }

    @keyframes fadeInOut {
      12.5% {
        opacity: 0;
      }

      50% {
        opacity: 1;
      }

      87.5% {
        opacity: 0;
      }
    }

    .id-video-container.portrait {
      width: 100%;
      position: relative;
      height: calc(200px * 1.4);
    }

    .id-video-container.portrait video {
      width: calc(213px + 0.9rem);
      height: 100%;
      position: absolute;
      top: 239px;
      left: 161px;
      padding-bottom: calc((214px * 1.4) / 3);
      padding-top: calc((191px * 1.4) / 3);
      object-fit: cover;

      transform: translateX(-50%) translateY(-50%);
      z-index: 1;
      block-size: 100%;
    }

    .video-container,
    .id-video-container.landscape {
      position: relative;
      z-index: 1;
      width: 100%;
    }

    .video-container #smile-cta,
    .video-container video,
    .id-video-container.landscape video {
      left: 50%;
      min-width: auto;
      position: absolute;
      top: calc(50% - 3px);
      transform: translateX(-50%) translateY(50%);
    }

    .video-container #smile-cta {
      color: white;
      font-size: 2rem;
      font-weight: bold;
      opacity: 0;
      top: calc(50% - 3rem);
    }

    .video-container video {
      min-height: 100%;
      transform: scaleX(-1) translateX(50%) translateY(-50%);
    }

    .video-container .video {
      background-color: black;
      position: absolute;
      left: 50%;
      height: calc(100% - 6px);
      clip-path: ellipse(101px 118px);
    }

    .id-video-container.landscape {
      min-height: calc((2 * 10rem) + 198px);
      height: auto;
    }

    .id-video-container.portrait .image-frame-portrait {
      border-width: 0.9rem;
      border-color: rgba(0, 0, 0, 0.7);
      border-style: solid;
      height: auto;
      position: absolute;
      top: 80px;
      left: 47px;
      z-index: 2;
      width: 200px;
      height: calc(200px * 1.4);
    }

    .id-video-container.landscape .image-frame {
      border-width: 10rem 1rem;
      border-color: rgba(0, 0, 0, 0.7);
      border-style: solid;
      height: auto;
      width: 90%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
    }

    .id-video-container.landscape video {
      width: 100%;
      transform: translateX(-50%) translateY(-50%);
      z-index: 1;
      height: 100%;
      block-size: 100%;
    }

    .id-video-container.landscape img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      max-width: 90%;
    }

    #id-review-screen .id-video-container,
    #back-of-id-review-screen .id-video-container {
      background-color: rgba(0, 0, 0, 1);
    }

    #id-review-screen .id-video-container.portrait, #back-of-id-review-screen .id-video-container.portrait {
      height: calc((200px * 1.4) + 100px);
    }
    #id-review-screen .id-video-container.portrait img, #back-of-id-review-screen .id-video-container.portrait img {
      height: 280px;
      width: 200px;
      padding-top: 14px;
      transform: none;
    }
    .actions {
      background-color: rgba(0, 0, 0, .7);
      bottom: 0;
      display: flex;
      justify-content: space-between;
      padding: 1rem;
      position: absolute;
      width: 90%;
      z-index: 2;
    }

    #back-of-id-camera-screen .id-video-container.portrait .actions,
    #id-camera-screen .id-video-container.portrait .actions {
      top: 145%;
      width: calc(200px * 1.4);
    }

    #back-of-id-camera-screen .section.portrait, #id-camera-screen .section.portrait {
      min-height: calc((200px * 1.4) + 260px);
    }

    #id-entry-screen,
    #back-of-id-entry-screen {
      block-size: 45rem;
      padding-block: 2rem;
      display: flex;
      flex-direction: column;
      max-block-size: 100%;
      max-inline-size: 40ch;
    }

    #id-entry-screen header p {
      margin-block: 0 !important;
    }

    .document-tips {
      margin-block-start: 1.5rem;
      display: flex;
      align-items: center;
      text-align: initial;
    }

    .document-tips svg {
      flex-shrink: 0;
      margin-inline-end: 1rem;
    }

    .document-tips p {
      margin-block: 0;
    }

    .document-tips p:first-of-type {
      font-size; 1.875rem;
      font-weight: bold
    }

    [type='file'] {
      display: none;
    }

    .document-tips > * + * {
      margin-inline-start; 1em;
    }
  </style>

  <svg hidden fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 396 259">
    <symbol id="image-frame">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0v69.605h13.349V13.349h56.256V0H0zM396 0h-69.605v13.349h56.256v56.256H396V0zM0 258.604V189h13.349v56.256h56.256v13.348H0zM396 258.604h-69.605v-13.348h56.256V189H396v69.604z" fill="#f00"/>
    </symbol>
  </svg>

  <svg hidden fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 396 527">
    <symbol id="image-frame-portrait">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M 0.59 0.2 L 0.59 142.384 L 13.912 142.384 L 13.912 17 L 70.05 17 L 70.05 0.2 L 0.59 0.2 Z M 395.764 0.2 L 326.303 0.2 L 326.303 17 L 382.442 17 L 382.442 142.384 L 395.764 142.384 L 395.764 0.2 Z M 0.59 528.461 L 0.59 386.277 L 13.912 386.277 L 13.912 511.663 L 70.05 511.663 L 70.05 528.461 L 0.59 528.461 Z M 395.764 528.461 L 326.303 528.461 L 326.303 511.663 L 382.442 511.663 L 382.442 386.277 L 395.764 386.277 L 395.764 528.461 Z" fill="#f00"/>
    </symbol>
  </svg>

  <svg hidden fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
    <symbol id="close-icon">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M.732.732a2.5 2.5 0 013.536 0L10 6.464 15.732.732a2.5 2.5 0 013.536 3.536L13.536 10l5.732 5.732a2.5 2.5 0 01-3.536 3.536L10 13.536l-5.732 5.732a2.5 2.5 0 11-3.536-3.536L6.464 10 .732 4.268a2.5 2.5 0 010-3.536z" fill="#fff"/>
    </symbol>
  </svg>

  <svg hidden fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41 41">
    <symbol id="approve-icon">
      <circle cx="20.5" cy="20.5" r="20" stroke="#fff"/>
      <path d="M12.3 20.5l6.15 6.15 12.3-12.3" stroke="#fff" stroke-width="3.075" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    </symbol>
  </svg>

  <svg hidden fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 18">
    <symbol id="refresh-icon">
      <path d="M3.314 15.646a8.004 8.004 0 01-2.217-4.257 8.06 8.06 0 01.545-4.655l1.789.788a6.062 6.062 0 001.264 6.737 6.033 6.033 0 008.551 0c2.358-2.37 2.358-6.224 0-8.592a5.996 5.996 0 00-4.405-1.782l.662 2.354-3.128-.796-3.127-.796 2.25-2.324L7.748 0l.55 1.953a7.966 7.966 0 016.33 2.326 8.004 8.004 0 012.342 5.684 8.005 8.005 0 01-2.343 5.683A7.928 7.928 0 018.97 18a7.928 7.928 0 01-5.656-2.354z" fill="currentColor"/>
    </symbol>
  </svg>

  <div class='flow center'>
    <p class='color-red | center' id='error'>
    </p>
  </div>

  <div id='request-screen' class='flow center'>
    ${this.showNavigation ? `
      <div class="nav back-to-host-nav${this.hideBackToHost ? ' justify-right' : ''}">
        ${this.hideBackToHost ? '' : `
          <div class="back-wrapper back-to-host-wrapper">
            <button type='button' data-type='icon' id="back-button-exit" class="back-button back-button-exit icon-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                <path fill="#DBDBC4" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" opacity=".4"/>
                <path fill="#001096" d="M15.5 11.25h-5.19l1.72-1.72c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-3 3c-.29.29-.29.77 0 1.06l3 3c.15.15.34.22.53.22s.38-.07.53-.22c.29-.29.29-.77 0-1.06l-1.72-1.72h5.19c.41 0 .75-.34.75-.75s-.34-.75-.75-.75Z"/>
              </svg>
            </button>
            <div class="back-button-text">Back</div>
          </div>
        `}
        <button data-type='icon' type='button' id='request-screen-close' class='close-iframe icon-btn'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
            <path fill="#DBDBC4" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" opacity=".4"/>
            <path fill="#91190F" d="m13.06 12 2.3-2.3c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-2.3 2.3-2.3-2.3a.754.754 0 0 0-1.06 0c-.29.29-.29.77 0 1.06l2.3 2.3-2.3 2.3c-.29.29-.29.77 0 1.06.15.15.34.22.53.22s.38-.07.53-.22l2.3-2.3 2.3 2.3c.15.15.34.22.53.22s.38-.07.53-.22c.29-.29.29-.77 0-1.06l-2.3-2.3Z"/>
          </svg>
          <span class='visually-hidden'>Close SmileIdentity Verification frame</span>
        </button>
      </div>
    ` : ''}
    <div class='section | flow'>
      <p>
        We need access to your camera so that we can take selfie and proof-of-life images.
      </p>

      <button data-variant='solid' id='request-camera-access' class='button | center' type='button'>
        Request Camera Access
      </button>

      ${this.hideAttribution ? '' : `
        <powered-by-smile-id></powered-by-smile-id>
      `}
    </div>
  </div>

  <div hidden id='camera-screen' class='flow center'>
    ${this.showNavigation ? `
      <div class="nav back-to-host-nav${this.hideBackToHost ? ' justify-right' : ''}">
        ${this.hideBackToHost ? '' : `
          <div class="back-wrapper back-to-host-wrapper">
            <button type='button' data-type='icon' id="back-button" class="back-button icon-btn back-button-exit">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                <path fill="#DBDBC4" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" opacity=".4"/>
                <path fill="#001096" d="M15.5 11.25h-5.19l1.72-1.72c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-3 3c-.29.29-.29.77 0 1.06l3 3c.15.15.34.22.53.22s.38-.07.53-.22c.29-.29.29-.77 0-1.06l-1.72-1.72h5.19c.41 0 .75-.34.75-.75s-.34-.75-.75-.75Z"/>
              </svg>
            </button>
            <div class="back-button-text">Back</div>
          </div>
        `}
        <button data-type='icon' type='button' id='camera-screen-close' class='close-iframe icon-btn'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
            <path fill="#DBDBC4" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" opacity=".4"/>
            <path fill="#91190F" d="m13.06 12 2.3-2.3c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-2.3 2.3-2.3-2.3a.754.754 0 0 0-1.06 0c-.29.29-.29.77 0 1.06l2.3 2.3-2.3 2.3c-.29.29-.29.77 0 1.06.15.15.34.22.53.22s.38-.07.53-.22l2.3-2.3 2.3 2.3c.15.15.34.22.53.22s.38-.07.53-.22c.29-.29.29-.77 0-1.06l-2.3-2.3Z"/>
          </svg>
          <span class='visually-hidden'>Close SmileIdentity Verification frame</span>
        </button>
      </div>
    ` : ''}
    <h1>Take a Selfie</h1>

    <div class='section | flow'>
      <div class='video-container'>
        <div class='video'>
        </div>
        <svg id="image-outline" width="215" height="245" viewBox="0 0 215 245" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M210.981 122.838C210.981 188.699 164.248 241.268 107.55 241.268C50.853 241.268 4.12018 188.699 4.12018 122.838C4.12018 56.9763 50.853 4.40771 107.55 4.40771C164.248 4.40771 210.981 56.9763 210.981 122.838Z" stroke="var(--color-active)" stroke-width="7.13965"/>
        </svg>
        <p id='smile-cta' class='color-gray'>SMILE</p>
      </div>

      <small class='tips'>
        <svg width='44' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 40">
          <path fill="#F8F8FA" fill-rule="evenodd" d="M17.44 0h4.2c4.92 0 7.56.68 9.95 1.96a13.32 13.32 0 015.54 5.54c1.27 2.39 1.95 5.02 1.95 9.94v4.2c0 4.92-.68 7.56-1.95 9.95a13.32 13.32 0 01-5.54 5.54c-2.4 1.27-5.03 1.95-9.95 1.95h-4.2c-4.92 0-7.55-.68-9.94-1.95a13.32 13.32 0 01-5.54-5.54C.68 29.19 0 26.56 0 21.64v-4.2C0 12.52.68 9.9 1.96 7.5A13.32 13.32 0 017.5 1.96C9.89.68 12.52 0 17.44 0z" clip-rule="evenodd"/>
          <path fill="#AEB6CB" d="M19.95 10.58a.71.71 0 000 1.43.71.71 0 000-1.43zm-5.54 2.3a.71.71 0 000 1.43.71.71 0 000-1.43zm11.08 0a.71.71 0 000 1.43.71.71 0 000-1.43zm-5.63 1.27a4.98 4.98 0 00-2.05 9.48v1.2a2.14 2.14 0 004.28 0v-1.2a4.99 4.99 0 00-2.23-9.48zm-7.75 4.27a.71.71 0 000 1.43.71.71 0 000-1.43zm15.68 0a.71.71 0 000 1.43.71.71 0 000-1.43z"/>
        </svg>
        <span>Tips: Put your face inside the oval frame and click to "take selfie"</span> </small>

      <button data-variant='solid' id='start-image-capture' class='button | center' type='button'>
        Take Selfie
      </button>

      ${this.hideAttribution ? '' : `
        <powered-by-smile-id></powered-by-smile-id>
      `}
    </div>
  </div>

  <div hidden id='failed-image-test-screen' class='flow center'>
    <div class='section | flow center'>
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="enable-background:new 0 0 319 443" height="200" viewBox="0 0 319 443">
        <image xlink:href="data:image/png;base64,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" width="319" height="443" style="overflow:visible"/>
      </svg>
      <p class='color-red | center font-size-large'>
        Device not supported
      </p>
      <p class='center'>
        We are unable to use images captured on this device.
      </p>
      <p class='center'>
        Please try using a different device.
      </p>

      ${this.hideAttribution ? '' : `
        <powered-by-smile-id></powered-by-smile-id>
      `}
    </div>
  </div>


  <div hidden id='review-screen' class='flow center'>
    ${this.showNavigation ? `
      <div class="nav justify-right">
        <button data-type='icon' type='button'  id='review-screen-close' class='close-iframe icon-btn'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
            <path fill="#DBDBC4" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" opacity=".4"/>
            <path fill="#91190F" d="m13.06 12 2.3-2.3c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-2.3 2.3-2.3-2.3a.754.754 0 0 0-1.06 0c-.29.29-.29.77 0 1.06l2.3 2.3-2.3 2.3c-.29.29-.29.77 0 1.06.15.15.34.22.53.22s.38-.07.53-.22l2.3-2.3 2.3 2.3c.15.15.34.22.53.22s.38-.07.53-.22c.29-.29.29-.77 0-1.06l-2.3-2.3Z"/>
          </svg>
          <span class='visually-hidden'>Close SmileIdentity Verification frame</span>
        </button>
      </div>
    ` : ''}
    <h1>Review Selfie</h1>

    <div class='section | flow'>
      <div class='selfie-review-image'>
        <img
          alt='your selfie'
          id='review-image'
          src=''
          width='480'
          height='480'
        />
      </div>

      <p class='color-richblue-shade font-size-large'>
        Is this clear enough?
      </p>

      <p class='color-gray font-size-small'>
        Make sure your face is clear enough and the photo is not blurry
      </p>

      <button data-variant='solid' id='select-selfie' class='button | center' type='button'>
        Yes, use this one
      </button>

      <button data-variant='outline' id='restart-image-capture' class='button | center' type='button'>
        Re-take selfie
      </button>
    </div>
    ${this.hideAttribution ? '' : `
      <powered-by-smile-id></powered-by-smile-id>
    `}
  </div>

  <div hidden id='id-entry-screen' class='flow center'>
    ${this.showNavigation ? `
      <div class="nav">
        <div class="back-wrapper">
          <button type='button' data-type='icon' id="back-button-selfie" class="back-button icon-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
              <path fill="#DBDBC4" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" opacity=".4"/>
              <path fill="#001096" d="M15.5 11.25h-5.19l1.72-1.72c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-3 3c-.29.29-.29.77 0 1.06l3 3c.15.15.34.22.53.22s.38-.07.53-.22c.29-.29.29-.77 0-1.06l-1.72-1.72h5.19c.41 0 .75-.34.75-.75s-.34-.75-.75-.75Z"/>
            </svg>
          </button>
          <div class="back-button-text">Back</div>
        </div>
        <button data-type='icon' type='button' id='id-entry-close' class='close-iframe icon-btn'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
            <path fill="#DBDBC4" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" opacity=".4"/>
            <path fill="#91190F" d="m13.06 12 2.3-2.3c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-2.3 2.3-2.3-2.3a.754.754 0 0 0-1.06 0c-.29.29-.29.77 0 1.06l2.3 2.3-2.3 2.3c-.29.29-.29.77 0 1.06.15.15.34.22.53.22s.38-.07.53-.22l2.3-2.3 2.3 2.3c.15.15.34.22.53.22s.38-.07.53-.22c.29-.29.29-.77 0-1.06l-2.3-2.3Z"/>
          </svg>
          <span class='visually-hidden'>Close SmileIdentity Verification frame</span>
        </button>
      </div>
    ` : ''}
    <header>
      <svg xmlns="http://www.w3.org/2000/svg" width="51" height="78" fill="none">
        <g clip-path="url(#clip-path)">
          <path fill="#7FCBF5" d="m37.806 75.563.15-52.06c0-1.625-1.145-3.581-2.53-4.394L4.126 1.054C3.435.632 2.772.602 2.32.874l-1.265.721c-.452.271-.753.813-.753 1.625l-.15 52.06c0 1.626 1.144 3.581 2.53 4.394L33.98 77.73c.934.541 1.958.09 1.807.18l1.266-.722c.451-.27.753-.843.753-1.625Zm-1.266.782c0 .392-.06.722-.18.963.12-.27.18-.602.18-.963Z"/>
          <path fill="#7FCBF5" d="m39.07 74.84.151-52.06c0-1.625-1.144-3.58-2.53-4.393L5.39.361c-.692-.42-1.355-.45-1.807-.18L2.32.903c-.452.271-.753.813-.753 1.625l-.15 52.06c0 1.625 1.144 3.581 2.53 4.394l31.299 18.055c.934.542 1.958.09 1.807.181l1.266-.722c.451-.271.753-.843.753-1.625v-.03Zm-1.265.783c0 .391-.06.722-.18.963.12-.27.18-.602.18-.963Z"/>
          <path fill="#3B3837" d="M13.19 40.626c-.873-.06-1.687.03-2.44.27 1.597 2.498 3.525 4.635 5.603 6.2-1.265-2.077-2.35-4.274-3.163-6.47Zm9.88 5.687c-.813 1.264-1.897 2.227-3.192 2.799 2.078.842 4.006.933 5.633.27a24.828 24.828 0 0 0-2.44-3.069Zm-5.542-4.393c-1.054-.542-2.109-.933-3.133-1.144a34.476 34.476 0 0 0 3.133 6.23V41.92Zm1.265.722v5.085c1.265-.511 2.32-1.384 3.133-2.587a21.086 21.086 0 0 0-3.133-2.498Zm-7.35-10.593-4.609-2.648c.12 3.16 1.205 6.65 3.043 9.99.873-.3 1.807-.39 2.801-.33-.753-2.438-1.175-4.785-1.265-6.982m6.115 3.521-4.88-2.829c.06 2.017.452 4.153 1.175 6.41 1.205.21 2.44.662 3.705 1.324V35.6Zm6.145 3.52-4.88-2.828v4.905c1.235.783 2.47 1.776 3.675 2.95.723-1.415 1.115-3.1 1.205-5.026Zm5.844 3.371-4.609-2.648c-.09 2.107-.512 3.972-1.295 5.507a30.696 30.696 0 0 1 2.802 3.581c1.867-1.204 2.952-3.43 3.102-6.44ZM14.154 25.73c-.904 1.504-1.416 3.43-1.506 5.627l4.88 2.829v-5.748c-1.145-.722-2.26-1.625-3.374-2.678m8.043 4.634a13.447 13.447 0 0 1-3.404-1.264v5.748l4.88 2.829c-.09-2.287-.572-4.815-1.476-7.313Zm-11.869-9.088c-2.078 1.084-3.343 3.49-3.524 6.68l4.609 2.649c.09-2.378.633-4.454 1.566-6.079a31.138 31.138 0 0 1-2.65-3.25Zm15.725 9.058c-.813.21-1.717.27-2.65.18.933 2.709 1.445 5.387 1.536 7.855l4.608 2.648c-.15-3.37-1.385-7.222-3.464-10.713m-8.465-7.613c-1.084.42-2.018 1.113-2.801 2.046a19.827 19.827 0 0 0 2.771 2.166v-4.212m1.265.722v4.213c.934.481 1.838.842 2.772 1.053a33.855 33.855 0 0 0-2.771-5.266Zm-2.38-2.137c-1.867-.722-3.614-.903-5.12-.451.723.963 1.476 1.896 2.289 2.738.783-1.023 1.747-1.805 2.862-2.317m3.524 2.016a34.581 34.581 0 0 1 2.832 5.567c.813.09 1.566.06 2.29-.12-1.507-2.197-3.254-4.063-5.122-5.477m-8.886 33.945s-.271-.271-.271-.452V55.16c0-.15.12-.24.27-.15l14.008 8.065s.271.27.271.451v1.595c0 .15-.12.24-.27.15l-14.008-8.064Zm0-4.093s-.271-.27-.271-.451v-1.595c0-.15.12-.241.27-.15l14.008 8.064s.271.27.271.451v1.595c0 .15-.12.241-.27.15l-14.008-8.064Zm4.308-38.037s-.272-.27-.272-.451V13.03c0-.15.12-.241.271-.15l7.772 4.332s.272.271.272.452v1.595c0 .15-.12.24-.271.15l-7.773-4.333Zm2.71 34.546s-.09-.06-.15-.09h-.06c-3.193-1.956-6.236-5.146-8.525-9.028-2.47-4.183-3.826-8.667-3.826-12.639 0-4.152 1.596-7.222 4.338-8.395 2.26-.963 5.12-.572 8.103 1.083h.06s.09.09.151.12c.06.03.09.06.15.09h.06c2.983 1.806 5.845 4.725 8.074 8.276 2.741 4.363 4.278 9.238 4.278 13.391 0 3.942-1.386 6.861-3.886 8.185-2.32 1.234-5.362.933-8.555-.872h-.06s-.091-.09-.151-.12Zm15.756-29.731L2.707 1.896c-1.416-.812-2.56-.15-2.56 1.445l-.151 51.94c0 1.625 1.114 3.58 2.53 4.393L33.735 77.67c1.416.813 2.56.151 2.56-1.444l.15-51.91c0-1.625-1.144-3.58-2.53-4.393"/>
          <path fill="#7FCBF5" d="M16.353 47.096c-2.079-1.565-4.007-3.701-5.603-6.2.753-.24 1.566-.33 2.44-.27a35.724 35.724 0 0 0 3.163 6.47Zm3.494 2.016a7.52 7.52 0 0 0 3.193-2.799c.874.933 1.687 1.987 2.44 3.07-1.626.662-3.554.542-5.633-.27Zm-2.38-2.137a33.523 33.523 0 0 1-3.133-6.229c1.025.211 2.079.572 3.133 1.144v5.085Zm1.235.723v-5.086a19.828 19.828 0 0 1 3.163 2.498c-.813 1.203-1.897 2.076-3.163 2.588Zm-8.886-8.336c-1.838-3.31-2.922-6.8-3.043-9.99l4.61 2.648c.06 2.196.481 4.543 1.265 6.981a7.717 7.717 0 0 0-2.802.331m3.976-.21c-.692-2.227-1.084-4.394-1.174-6.41l4.88 2.828v4.905c-1.266-.662-2.5-1.113-3.706-1.324Zm8.646 4.995c-1.205-1.174-2.44-2.167-3.705-2.95v-4.904l4.91 2.828c-.09 1.926-.482 3.611-1.205 5.026Zm3.946 4.785a30.707 30.707 0 0 0-2.801-3.582c.783-1.564 1.205-3.4 1.295-5.507l4.609 2.649c-.15 3.009-1.235 5.236-3.103 6.44ZM12.647 31.296c.09-2.197.603-4.122 1.507-5.627 1.114 1.053 2.259 1.956 3.404 2.678v5.748l-4.91-2.829m6.115 3.521V29.04c1.174.602 2.29 1.024 3.434 1.264.873 2.528 1.386 5.026 1.476 7.313l-4.88-2.829m-11.96-6.891c.181-3.19 1.416-5.597 3.525-6.68a28.286 28.286 0 0 0 2.651 3.25c-.934 1.624-1.476 3.7-1.566 6.078l-4.61-2.648Zm18.105 10.442c-.09-2.468-.602-5.146-1.536-7.854.934.09 1.837 0 2.65-.18 2.08 3.49 3.314 7.342 3.465 10.712l-4.609-2.648m-7.35-11.435a19.841 19.841 0 0 1-2.772-2.167 6.523 6.523 0 0 1 2.802-2.046v4.213m1.235.722v-4.213a33.86 33.86 0 0 1 2.771 5.266c-.903-.21-1.837-.571-2.771-1.053Zm-5.212-4.032c-.813-.843-1.566-1.776-2.289-2.739 1.506-.451 3.284-.3 5.121.452-1.115.511-2.078 1.294-2.862 2.317m9.188 5.296a34.581 34.581 0 0 0-2.831-5.567c1.867 1.414 3.614 3.28 5.12 5.477-.722.15-1.476.18-2.289.12m-4.579-8.185s-.09-.06-.15-.09h-.06c-2.983-1.685-5.845-2.077-8.104-1.114-2.741 1.174-4.338 4.243-4.338 8.396 0 4.153 1.356 8.426 3.826 12.639 2.29 3.882 5.332 7.072 8.525 8.998h.06s.09.12.15.15c.061.03.091.06.152.09h.06c3.193 1.806 6.236 2.137 8.555.903 2.5-1.324 3.856-4.243 3.886-8.185 0-4.153-1.536-9.028-4.278-13.361-2.229-3.551-5.09-6.5-8.073-8.276h-.06s-.09-.09-.15-.12"/>
          <path fill="#43C15F" d="M40.668 50.165h-.03c-5.723 0-10.363 4.635-10.363 10.352v.03c0 5.717 4.64 10.352 10.363 10.352h.03c5.723 0 10.363-4.635 10.363-10.352v-.03c0-5.717-4.64-10.352-10.363-10.352Z"/>
          <path fill="#E5E7E7" d="m38.826 65.873-5.603-5.447 1.627-1.685 3.976 3.822 7.591-7.343 1.627 1.685-9.188 8.968h-.03Z"/>
        </g>
        <defs>
          <clipPath id="clip-path">
            <path fill="#fff" d="M0 0h51v78H0z"/>
          </clipPath>
        </defs>
      </svg>
      <h1>
        Submit${this.captureBackOfID ? ' the Front of' : ''} Your ID
      </h1>
      <p>
        We'll use it to verify your identity.
      </p>
      <p>
        Follow the tips below for the best results.
      </p>
    </header>
    <div class='flow'>
      <div class='document-tips'>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none">
          <g fill="#9394AB" clip-path="url(#clip)">
            <path fill-rule="evenodd" d="M26.827 16a10.827 10.827 0 1 1-21.655 0 10.827 10.827 0 0 1 21.655 0Z" clip-rule="evenodd"/>
            <path d="M16.51 3.825h-1.02L15.992 0l.518 3.825ZM22.53 5.707l-.884-.51 2.346-3.056-1.462 3.566ZM26.804 10.354l-.51-.883 3.557-1.479-3.047 2.362ZM28.183 16.51v-1.02l3.817.502-3.817.518ZM26.293 22.53l.51-.884 3.056 2.346-3.566-1.462ZM21.646 26.804l.884-.51 1.478 3.557-2.362-3.047ZM15.49 28.183h1.02L16.009 32l-.518-3.817ZM9.47 26.293l.884.51-2.346 3.056 1.462-3.566ZM5.196 21.646l.51.884-3.557 1.478 3.047-2.362ZM3.825 15.49v1.02L0 16.009l3.825-.518ZM5.707 9.47l-.51.884L2.14 8.008 5.707 9.47ZM10.354 5.196l-.883.51L7.992 2.15l2.362 3.047Z"/>
          </g>
          <defs>
            <clipPath id="clip">
              <path fill="#fff" d="M0 0h32v32H0z"/>
            </clipPath>
          </defs>
        </svg>
        <div>
          <p>Check the lighting</p>
          <p>
            Take your ID document image in a well-lit environment where it is easy to read, and free from glare on the card.
          </p>
        </div>
      </div>
      <div class='document-tips'>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="31" fill="none">
          <g fill="#9394AB" clip-path="url(#path)">
            <path d="M30.967 10.884H1.033A25.08 25.08 0 0 0 .65 12.06h30.702c-.11-.398-.238-.787-.384-1.176ZM31.515 12.696H.485c-.092.36-.165.721-.229 1.091h31.488c-.064-.37-.137-.73-.229-1.091ZM31.854 14.508H.146c-.045.333-.073.665-.1.997h31.908a18.261 18.261 0 0 0-.1-.997ZM32 16.767c0-.152 0-.294-.01-.446H.01c-.01.152-.01.294-.01.446 0 .152 0 .313.01.465h31.98c.01-.152.01-.313.01-.465ZM31.945 18.133H.055c.018.275.046.55.082.816h31.726c.036-.266.064-.54.082-.816ZM31.707 19.946H.293c.045.246.1.483.155.72h31.104c.055-.236.11-.474.155-.72ZM31.269 21.758H.73c.074.209.138.427.21.636h30.117c.073-.21.147-.427.21-.636ZM30.601 23.57H1.4l.247.541h28.708l.247-.54ZM29.687 25.383H2.322c.08.151.17.303.275.455h26.816l.274-.455ZM28.453 27.195H3.547l.284.36h24.338l.284-.36ZM26.816 29.007H5.184l.293.266h21.046l.293-.266ZM24.54 30.82H7.46l.284.18h16.512l.283-.18ZM28.873 6.898a16.377 16.377 0 0 0-.933-1.186A15.316 15.316 0 0 0 15.973 0 15.314 15.314 0 0 0 3.585 6.253h.027c-.164.218-.329.427-.484.645h25.746ZM29.12 7.268H2.88c-.293.437-.567.892-.823 1.357h27.886a13.617 13.617 0 0 0-.823-1.357ZM30.18 9.071H1.82c-.21.418-.403.845-.577 1.272h29.513a17.482 17.482 0 0 0-.575-1.272Z"/>
          </g>
          <defs>
            <clipPath id="path">
              <path fill="#fff" d="M0 0h32v31H0z"/>
            </clipPath>
          </defs>
        </svg>
        <div>
          <p>Make sure it's in focus</p>
          <p>
            Ensure the photo of the ID document you submit is not blurry: you should be able to read the text on the document.
          </p>
        </div>
      </div>
    </div>
    <div class='flow'>
      ${this.supportBothCaptureModes || this.documentCaptureModes === 'camera' ? `
        <button data-variant='solid full-width' class='button' type='button' id='take-photo'>
          Take Photo
        </button>
      ` : ''}
      ${this.supportBothCaptureModes || this.documentCaptureModes === 'upload' ? `
        <label id='upload-photo-label' data-variant='${this.supportBothCaptureModes ? 'outline' : 'solid'}' class='button'>
          <input type='file' onclick='this.value=null;' id='upload-photo' name='document' accept='image/png, image/jpeg' />
          <span>Upload Photo</span>
        </label>
      ` : ''}
    </div>
    ${this.hideAttribution ? '' : `
      <powered-by-smile-id></powered-by-smile-id>
    `}
  </div>

  <div hidden id='id-camera-screen' class='flow center'>
    ${this.showNavigation ? `
      <div class="nav">
        <div class="back-wrapper">
          <button type='button' data-type='icon' id="back-button-id-entry" class="back-button icon-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
              <path fill="#DBDBC4" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" opacity=".4"/>
              <path fill="#001096" d="M15.5 11.25h-5.19l1.72-1.72c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-3 3c-.29.29-.29.77 0 1.06l3 3c.15.15.34.22.53.22s.38-.07.53-.22c.29-.29.29-.77 0-1.06l-1.72-1.72h5.19c.41 0 .75-.34.75-.75s-.34-.75-.75-.75Z"/>
            </svg>
          </button>
          <div class="back-button-text">Back</div>
        </div>
        <button data-type='icon' type='button' id='id-camera-close' class='close-iframe icon-btn'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
            <path fill="#DBDBC4" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" opacity=".4"/>
            <path fill="#91190F" d="m13.06 12 2.3-2.3c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-2.3 2.3-2.3-2.3a.754.754 0 0 0-1.06 0c-.29.29-.29.77 0 1.06l2.3 2.3-2.3 2.3c-.29.29-.29.77 0 1.06.15.15.34.22.53.22s.38-.07.53-.22l2.3-2.3 2.3 2.3c.15.15.34.22.53.22s.38-.07.53-.22c.29-.29.29-.77 0-1.06l-2.3-2.3Z"/>
          </svg>
          <span class='visually-hidden'>Close SmileIdentity Verification frame</span>
        </button>
      </div>
    ` : ''}
    <h1>Take ID Card Photo</h1>
    <div class='section | flow ${this.isPortraitCaptureView ? 'portrait' : 'landscape'}'>
      <div class='id-video-container ${this.isPortraitCaptureView ? 'portrait' : 'landscape'}'>
        <svg class="image-frame" fill="none" height="259" width="396" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 396 259" ${this.isPortraitCaptureView ? 'hidden' : ''}>
          <use href='#image-frame' />
        </svg>

        <svg class="image-frame-portrait" fill="none" height="527" width="396" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 396 527" ${!this.isPortraitCaptureView ? 'hidden' : ''}>
          <use href='#image-frame-portrait' />
        </svg>

        <div class='actions' hidden>
          <button id='capture-id-image' class='button icon-btn | center' type='button'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="60" width="60">
              <circle cx="30" cy="30" r="27" stroke="currentColor" stroke-width="3" />
            </svg>
            <span class='visually-hidden'>Capture</span>
          </button>
        </div>
      </div>

      ${this.hideAttribution ? '' : `
        <powered-by-smile-id></powered-by-smile-id>
      `}
    </div>
  </div>

  <div hidden id='id-review-screen' class='flow center'>
    ${this.showNavigation ? `
      <div class="nav justify-right">
        <button data-type='icon' type='button'  id='id-review-screen-close' class='close-iframe icon-btn'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
            <path fill="#DBDBC4" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" opacity=".4"/>
            <path fill="#91190F" d="m13.06 12 2.3-2.3c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-2.3 2.3-2.3-2.3a.754.754 0 0 0-1.06 0c-.29.29-.29.77 0 1.06l2.3 2.3-2.3 2.3c-.29.29-.29.77 0 1.06.15.15.34.22.53.22s.38-.07.53-.22l2.3-2.3 2.3 2.3c.15.15.34.22.53.22s.38-.07.53-.22c.29-.29.29-.77 0-1.06l-2.3-2.3Z"/>
          </svg>
          <span class='visually-hidden'>Close SmileIdentity Verification frame</span>
        </button>
      </div>
    ` : ''}
    <h1>Review ID Card</h1>
    <div class='section | flow'>
      <div class='id-video-container ${this.isPortraitCaptureView ? 'portrait' : 'landscape'}'>
        <div class='actions'>
          <button id='re-capture-id-image' class='button icon-btn' type='button'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="40" width="40" viewBox='0 0 17 18'>
              <path d="M3.314 15.646a8.004 8.004 0 01-2.217-4.257 8.06 8.06 0 01.545-4.655l1.789.788a6.062 6.062 0 001.264 6.737 6.033 6.033 0 008.551 0c2.358-2.37 2.358-6.224 0-8.592a5.996 5.996 0 00-4.405-1.782l.662 2.354-3.128-.796-3.127-.796 2.25-2.324L7.748 0l.55 1.953a7.966 7.966 0 016.33 2.326 8.004 8.004 0 012.342 5.684 8.005 8.005 0 01-2.343 5.683A7.928 7.928 0 018.97 18a7.928 7.928 0 01-5.656-2.354z" fill="currentColor"/>
            </svg>
            <span class='visually-hidden'>Re-Capture</span>
          </button>
          <button id='select-id-image' class='button icon-btn' type='button'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox='0 0 41 41' height="40" width="40">
              <circle cx="20.5" cy="20.5" r="20" stroke="#fff"/>
              <path d="M12.3 20.5l6.15 6.15 12.3-12.3" stroke="#fff" stroke-width="3.075" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class='visually-hidden'>Accept Image</span>
          </button>
        </div>

        <img
          alt='your ID card'
          id='id-review-image'
          src=''
          width='396'
        />
      </div>

      ${this.hideAttribution ? '' : `
        <powered-by-smile-id></powered-by-smile-id>
      `}
    </div>
  </div>

  <div hidden id='back-of-id-entry-screen' class='flow center'>
    ${this.showNavigation ? `
      <div class="nav">
        <div class="back-wrapper">
          <button type='button' data-type='icon' id="back-button-id-image" class="back-button icon-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
              <path fill="#DBDBC4" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" opacity=".4"/>
              <path fill="#001096" d="M15.5 11.25h-5.19l1.72-1.72c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-3 3c-.29.29-.29.77 0 1.06l3 3c.15.15.34.22.53.22s.38-.07.53-.22c.29-.29.29-.77 0-1.06l-1.72-1.72h5.19c.41 0 .75-.34.75-.75s-.34-.75-.75-.75Z"/>
            </svg>
          </button>
          <div class="back-button-text">Back</div>
        </div>
        <button data-type='icon' type='button' id='back-id-entry-close' class='close-iframe icon-btn'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
            <path fill="#DBDBC4" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" opacity=".4"/>
            <path fill="#91190F" d="m13.06 12 2.3-2.3c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-2.3 2.3-2.3-2.3a.754.754 0 0 0-1.06 0c-.29.29-.29.77 0 1.06l2.3 2.3-2.3 2.3c-.29.29-.29.77 0 1.06.15.15.34.22.53.22s.38-.07.53-.22l2.3-2.3 2.3 2.3c.15.15.34.22.53.22s.38-.07.53-.22c.29-.29.29-.77 0-1.06l-2.3-2.3Z"/>
          </svg>
          <span class='visually-hidden'>Close SmileIdentity Verification frame</span>
        </button>
      </div>
      ` : ''}
    <header>
      <svg xmlns="http://www.w3.org/2000/svg" width="51" height="78" fill="none">
        <g clip-path="url(#clip-path)">
          <path fill="#7FCBF5" d="m37.806 75.563.15-52.06c0-1.625-1.145-3.581-2.53-4.394L4.126 1.054C3.435.632 2.772.602 2.32.874l-1.265.721c-.452.271-.753.813-.753 1.625l-.15 52.06c0 1.626 1.144 3.581 2.53 4.394L33.98 77.73c.934.541 1.958.09 1.807.18l1.266-.722c.451-.27.753-.843.753-1.625Zm-1.266.782c0 .392-.06.722-.18.963.12-.27.18-.602.18-.963Z"/>
          <path fill="#7FCBF5" d="m39.07 74.84.151-52.06c0-1.625-1.144-3.58-2.53-4.393L5.39.361c-.692-.42-1.355-.45-1.807-.18L2.32.903c-.452.271-.753.813-.753 1.625l-.15 52.06c0 1.625 1.144 3.581 2.53 4.394l31.299 18.055c.934.542 1.958.09 1.807.181l1.266-.722c.451-.271.753-.843.753-1.625v-.03Zm-1.265.783c0 .391-.06.722-.18.963.12-.27.18-.602.18-.963Z"/>
          <path fill="#3B3837" d="M13.19 40.626c-.873-.06-1.687.03-2.44.27 1.597 2.498 3.525 4.635 5.603 6.2-1.265-2.077-2.35-4.274-3.163-6.47Zm9.88 5.687c-.813 1.264-1.897 2.227-3.192 2.799 2.078.842 4.006.933 5.633.27a24.828 24.828 0 0 0-2.44-3.069Zm-5.542-4.393c-1.054-.542-2.109-.933-3.133-1.144a34.476 34.476 0 0 0 3.133 6.23V41.92Zm1.265.722v5.085c1.265-.511 2.32-1.384 3.133-2.587a21.086 21.086 0 0 0-3.133-2.498Zm-7.35-10.593-4.609-2.648c.12 3.16 1.205 6.65 3.043 9.99.873-.3 1.807-.39 2.801-.33-.753-2.438-1.175-4.785-1.265-6.982m6.115 3.521-4.88-2.829c.06 2.017.452 4.153 1.175 6.41 1.205.21 2.44.662 3.705 1.324V35.6Zm6.145 3.52-4.88-2.828v4.905c1.235.783 2.47 1.776 3.675 2.95.723-1.415 1.115-3.1 1.205-5.026Zm5.844 3.371-4.609-2.648c-.09 2.107-.512 3.972-1.295 5.507a30.696 30.696 0 0 1 2.802 3.581c1.867-1.204 2.952-3.43 3.102-6.44ZM14.154 25.73c-.904 1.504-1.416 3.43-1.506 5.627l4.88 2.829v-5.748c-1.145-.722-2.26-1.625-3.374-2.678m8.043 4.634a13.447 13.447 0 0 1-3.404-1.264v5.748l4.88 2.829c-.09-2.287-.572-4.815-1.476-7.313Zm-11.869-9.088c-2.078 1.084-3.343 3.49-3.524 6.68l4.609 2.649c.09-2.378.633-4.454 1.566-6.079a31.138 31.138 0 0 1-2.65-3.25Zm15.725 9.058c-.813.21-1.717.27-2.65.18.933 2.709 1.445 5.387 1.536 7.855l4.608 2.648c-.15-3.37-1.385-7.222-3.464-10.713m-8.465-7.613c-1.084.42-2.018 1.113-2.801 2.046a19.827 19.827 0 0 0 2.771 2.166v-4.212m1.265.722v4.213c.934.481 1.838.842 2.772 1.053a33.855 33.855 0 0 0-2.771-5.266Zm-2.38-2.137c-1.867-.722-3.614-.903-5.12-.451.723.963 1.476 1.896 2.289 2.738.783-1.023 1.747-1.805 2.862-2.317m3.524 2.016a34.581 34.581 0 0 1 2.832 5.567c.813.09 1.566.06 2.29-.12-1.507-2.197-3.254-4.063-5.122-5.477m-8.886 33.945s-.271-.271-.271-.452V55.16c0-.15.12-.24.27-.15l14.008 8.065s.271.27.271.451v1.595c0 .15-.12.24-.27.15l-14.008-8.064Zm0-4.093s-.271-.27-.271-.451v-1.595c0-.15.12-.241.27-.15l14.008 8.064s.271.27.271.451v1.595c0 .15-.12.241-.27.15l-14.008-8.064Zm4.308-38.037s-.272-.27-.272-.451V13.03c0-.15.12-.241.271-.15l7.772 4.332s.272.271.272.452v1.595c0 .15-.12.24-.271.15l-7.773-4.333Zm2.71 34.546s-.09-.06-.15-.09h-.06c-3.193-1.956-6.236-5.146-8.525-9.028-2.47-4.183-3.826-8.667-3.826-12.639 0-4.152 1.596-7.222 4.338-8.395 2.26-.963 5.12-.572 8.103 1.083h.06s.09.09.151.12c.06.03.09.06.15.09h.06c2.983 1.806 5.845 4.725 8.074 8.276 2.741 4.363 4.278 9.238 4.278 13.391 0 3.942-1.386 6.861-3.886 8.185-2.32 1.234-5.362.933-8.555-.872h-.06s-.091-.09-.151-.12Zm15.756-29.731L2.707 1.896c-1.416-.812-2.56-.15-2.56 1.445l-.151 51.94c0 1.625 1.114 3.58 2.53 4.393L33.735 77.67c1.416.813 2.56.151 2.56-1.444l.15-51.91c0-1.625-1.144-3.58-2.53-4.393"/>
          <path fill="#7FCBF5" d="M16.353 47.096c-2.079-1.565-4.007-3.701-5.603-6.2.753-.24 1.566-.33 2.44-.27a35.724 35.724 0 0 0 3.163 6.47Zm3.494 2.016a7.52 7.52 0 0 0 3.193-2.799c.874.933 1.687 1.987 2.44 3.07-1.626.662-3.554.542-5.633-.27Zm-2.38-2.137a33.523 33.523 0 0 1-3.133-6.229c1.025.211 2.079.572 3.133 1.144v5.085Zm1.235.723v-5.086a19.828 19.828 0 0 1 3.163 2.498c-.813 1.203-1.897 2.076-3.163 2.588Zm-8.886-8.336c-1.838-3.31-2.922-6.8-3.043-9.99l4.61 2.648c.06 2.196.481 4.543 1.265 6.981a7.717 7.717 0 0 0-2.802.331m3.976-.21c-.692-2.227-1.084-4.394-1.174-6.41l4.88 2.828v4.905c-1.266-.662-2.5-1.113-3.706-1.324Zm8.646 4.995c-1.205-1.174-2.44-2.167-3.705-2.95v-4.904l4.91 2.828c-.09 1.926-.482 3.611-1.205 5.026Zm3.946 4.785a30.707 30.707 0 0 0-2.801-3.582c.783-1.564 1.205-3.4 1.295-5.507l4.609 2.649c-.15 3.009-1.235 5.236-3.103 6.44ZM12.647 31.296c.09-2.197.603-4.122 1.507-5.627 1.114 1.053 2.259 1.956 3.404 2.678v5.748l-4.91-2.829m6.115 3.521V29.04c1.174.602 2.29 1.024 3.434 1.264.873 2.528 1.386 5.026 1.476 7.313l-4.88-2.829m-11.96-6.891c.181-3.19 1.416-5.597 3.525-6.68a28.286 28.286 0 0 0 2.651 3.25c-.934 1.624-1.476 3.7-1.566 6.078l-4.61-2.648Zm18.105 10.442c-.09-2.468-.602-5.146-1.536-7.854.934.09 1.837 0 2.65-.18 2.08 3.49 3.314 7.342 3.465 10.712l-4.609-2.648m-7.35-11.435a19.841 19.841 0 0 1-2.772-2.167 6.523 6.523 0 0 1 2.802-2.046v4.213m1.235.722v-4.213a33.86 33.86 0 0 1 2.771 5.266c-.903-.21-1.837-.571-2.771-1.053Zm-5.212-4.032c-.813-.843-1.566-1.776-2.289-2.739 1.506-.451 3.284-.3 5.121.452-1.115.511-2.078 1.294-2.862 2.317m9.188 5.296a34.581 34.581 0 0 0-2.831-5.567c1.867 1.414 3.614 3.28 5.12 5.477-.722.15-1.476.18-2.289.12m-4.579-8.185s-.09-.06-.15-.09h-.06c-2.983-1.685-5.845-2.077-8.104-1.114-2.741 1.174-4.338 4.243-4.338 8.396 0 4.153 1.356 8.426 3.826 12.639 2.29 3.882 5.332 7.072 8.525 8.998h.06s.09.12.15.15c.061.03.091.06.152.09h.06c3.193 1.806 6.236 2.137 8.555.903 2.5-1.324 3.856-4.243 3.886-8.185 0-4.153-1.536-9.028-4.278-13.361-2.229-3.551-5.09-6.5-8.073-8.276h-.06s-.09-.09-.15-.12"/>
          <path fill="#43C15F" d="M40.668 50.165h-.03c-5.723 0-10.363 4.635-10.363 10.352v.03c0 5.717 4.64 10.352 10.363 10.352h.03c5.723 0 10.363-4.635 10.363-10.352v-.03c0-5.717-4.64-10.352-10.363-10.352Z"/>
          <path fill="#E5E7E7" d="m38.826 65.873-5.603-5.447 1.627-1.685 3.976 3.822 7.591-7.343 1.627 1.685-9.188 8.968h-.03Z"/>
        </g>
        <defs>
          <clipPath id="clip-path">
            <path fill="#fff" d="M0 0h51v78H0z"/>
          </clipPath>
        </defs>
      </svg>
      <h1>
        Submit Back of ID
      </h1>
      <p>
        Submit back of ID document
      </p>
      <p>
        Follow the tips below for the best results.
      </p>
    </header>
    <div class='flow'>
      <div class='document-tips'>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none">
          <g fill="#9394AB" clip-path="url(#clip)">
            <path fill-rule="evenodd" d="M26.827 16a10.827 10.827 0 1 1-21.655 0 10.827 10.827 0 0 1 21.655 0Z" clip-rule="evenodd"/>
            <path d="M16.51 3.825h-1.02L15.992 0l.518 3.825ZM22.53 5.707l-.884-.51 2.346-3.056-1.462 3.566ZM26.804 10.354l-.51-.883 3.557-1.479-3.047 2.362ZM28.183 16.51v-1.02l3.817.502-3.817.518ZM26.293 22.53l.51-.884 3.056 2.346-3.566-1.462ZM21.646 26.804l.884-.51 1.478 3.557-2.362-3.047ZM15.49 28.183h1.02L16.009 32l-.518-3.817ZM9.47 26.293l.884.51-2.346 3.056 1.462-3.566ZM5.196 21.646l.51.884-3.557 1.478 3.047-2.362ZM3.825 15.49v1.02L0 16.009l3.825-.518ZM5.707 9.47l-.51.884L2.14 8.008 5.707 9.47ZM10.354 5.196l-.883.51L7.992 2.15l2.362 3.047Z"/>
          </g>
          <defs>
            <clipPath id="clip">
              <path fill="#fff" d="M0 0h32v32H0z"/>
            </clipPath>
          </defs>
        </svg>
        <div>
          <p>Check the lighting</p>
          <p>
            Take your ID document image in a well-lit environment where it is easy to read, and free from glare on the card.
          </p>
        </div>
      </div>
      <div class='document-tips'>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="31" fill="none">
          <g fill="#9394AB" clip-path="url(#path)">
            <path d="M30.967 10.884H1.033A25.08 25.08 0 0 0 .65 12.06h30.702c-.11-.398-.238-.787-.384-1.176ZM31.515 12.696H.485c-.092.36-.165.721-.229 1.091h31.488c-.064-.37-.137-.73-.229-1.091ZM31.854 14.508H.146c-.045.333-.073.665-.1.997h31.908a18.261 18.261 0 0 0-.1-.997ZM32 16.767c0-.152 0-.294-.01-.446H.01c-.01.152-.01.294-.01.446 0 .152 0 .313.01.465h31.98c.01-.152.01-.313.01-.465ZM31.945 18.133H.055c.018.275.046.55.082.816h31.726c.036-.266.064-.54.082-.816ZM31.707 19.946H.293c.045.246.1.483.155.72h31.104c.055-.236.11-.474.155-.72ZM31.269 21.758H.73c.074.209.138.427.21.636h30.117c.073-.21.147-.427.21-.636ZM30.601 23.57H1.4l.247.541h28.708l.247-.54ZM29.687 25.383H2.322c.08.151.17.303.275.455h26.816l.274-.455ZM28.453 27.195H3.547l.284.36h24.338l.284-.36ZM26.816 29.007H5.184l.293.266h21.046l.293-.266ZM24.54 30.82H7.46l.284.18h16.512l.283-.18ZM28.873 6.898a16.377 16.377 0 0 0-.933-1.186A15.316 15.316 0 0 0 15.973 0 15.314 15.314 0 0 0 3.585 6.253h.027c-.164.218-.329.427-.484.645h25.746ZM29.12 7.268H2.88c-.293.437-.567.892-.823 1.357h27.886a13.617 13.617 0 0 0-.823-1.357ZM30.18 9.071H1.82c-.21.418-.403.845-.577 1.272h29.513a17.482 17.482 0 0 0-.575-1.272Z"/>
          </g>
          <defs>
            <clipPath id="path">
              <path fill="#fff" d="M0 0h32v31H0z"/>
            </clipPath>
          </defs>
        </svg>
        <div>
          <p>Make sure it's in focus</p>
          <p>
            Ensure the photo of the ID document you submit is not blurry: you should be able to read the text on the document.
          </p>
        </div>
      </div>
    </div>
    <br />
    <div class='flow'>
      ${!this.documentType ? `
        <button data-variant='ghost full-width' class='button' type='button' id='skip-this-step'>
          Skip this step
        </button>
      ` : ''}
      ${this.supportBothCaptureModes || this.documentCaptureModes === 'camera' ? `
        <button data-variant='solid full-width' class='button' type='button' id='take-photo'>
          Take Photo
        </button>
      ` : ''}
      ${this.supportBothCaptureModes || this.documentCaptureModes === 'upload' ? `
        <label data-variant='${this.supportBothCaptureModes ? 'outline' : 'solid'}' class='button'>
          <input type='file' id='upload-photo' name='document' accept='image/png, image/jpeg' />
          <span>Upload Photo</span>
        </label>
      ` : ''}
    </div>
    ${this.hideAttribution ? '' : `
      <powered-by-smile-id></powered-by-smile-id>
    `}
  </div>

  <div hidden id='back-of-id-camera-screen' class='flow center'>
    ${this.showNavigation ? `
      <div class="nav">
        <div class="back-wrapper">
          <button type='button' data-type='icon' id="back-button-back-id-entry" class="back-button icon-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
              <path fill="#DBDBC4" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" opacity=".4"/>
              <path fill="#001096" d="M15.5 11.25h-5.19l1.72-1.72c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-3 3c-.29.29-.29.77 0 1.06l3 3c.15.15.34.22.53.22s.38-.07.53-.22c.29-.29.29-.77 0-1.06l-1.72-1.72h5.19c.41 0 .75-.34.75-.75s-.34-.75-.75-.75Z"/>
            </svg>
          </button>
          <div class="back-button-text">Back</div>
        </div>
        <button data-type='icon' type='button' id='back-id-camera-close' class='close-iframe icon-btn'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
            <path fill="#DBDBC4" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" opacity=".4"/>
            <path fill="#91190F" d="m13.06 12 2.3-2.3c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-2.3 2.3-2.3-2.3a.754.754 0 0 0-1.06 0c-.29.29-.29.77 0 1.06l2.3 2.3-2.3 2.3c-.29.29-.29.77 0 1.06.15.15.34.22.53.22s.38-.07.53-.22l2.3-2.3 2.3 2.3c.15.15.34.22.53.22s.38-.07.53-.22c.29-.29.29-.77 0-1.06l-2.3-2.3Z"/>
          </svg>
          <span class='visually-hidden'>Close SmileIdentity Verification frame</span>
        </button>
      </div>
    ` : ''}
    <h1>Take Back of ID Card Photo</h1>
    <div class='section | flow ${this.isPortraitCaptureView ? 'portrait' : 'landscape'}'>
      <div class='id-video-container ${this.isPortraitCaptureView ? 'portrait' : 'landscape'}'>
        <svg class="image-frame" fill="none" height="259" width="396" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 396 259" ${this.isPortraitCaptureView ? 'hidden' : ''}>
          <use href='#image-frame' />
        </svg>

        <svg class="image-frame-portrait" fill="none" height="527" width="396" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 396 527" ${!this.isPortraitCaptureView ? 'hidden' : ''}>
          <use href='#image-frame-portrait' />
        </svg>

        <div class='actions' hidden>
          <button id='capture-back-of-id-image' class='button icon-btn | center' type='button'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="60" width="60">
              <circle cx="30" cy="30" r="27" stroke="currentColor" stroke-width="3" />
            </svg>
            <span class='visually-hidden'>Capture</span>
          </button>
        </div>
      </div>

      ${this.hideAttribution ? '' : `
        <powered-by-smile-id></powered-by-smile-id>
      `}
    </div>
  </div>

  <div hidden id='back-of-id-review-screen' class='flow center'>
    ${this.showNavigation ? `
      <div class="nav justify-right">
        <button data-type='icon' type='button' id='back-review-screen-close' class='close-iframe icon-btn'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
            <path fill="#DBDBC4" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" opacity=".4"/>
            <path fill="#91190F" d="m13.06 12 2.3-2.3c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-2.3 2.3-2.3-2.3a.754.754 0 0 0-1.06 0c-.29.29-.29.77 0 1.06l2.3 2.3-2.3 2.3c-.29.29-.29.77 0 1.06.15.15.34.22.53.22s.38-.07.53-.22l2.3-2.3 2.3 2.3c.15.15.34.22.53.22s.38-.07.53-.22c.29-.29.29-.77 0-1.06l-2.3-2.3Z"/>
          </svg>
          <span class='visually-hidden'>Close SmileIdentity Verification frame</span>
        </button>
      </div>
    ` : ''}
    <h1>Review Back of ID Card Photo</h1>
    <div class='section | flow'>
      <div class='id-video-container ${this.isPortraitCaptureView ? 'portrait' : 'landscape'}'>
        <div class='actions'>
          <button id='re-capture-back-of-id-image' class='button icon-btn' type='button'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="40" width="40" viewBox='0 0 17 18'>
              <path d="M3.314 15.646a8.004 8.004 0 01-2.217-4.257 8.06 8.06 0 01.545-4.655l1.789.788a6.062 6.062 0 001.264 6.737 6.033 6.033 0 008.551 0c2.358-2.37 2.358-6.224 0-8.592a5.996 5.996 0 00-4.405-1.782l.662 2.354-3.128-.796-3.127-.796 2.25-2.324L7.748 0l.55 1.953a7.966 7.966 0 016.33 2.326 8.004 8.004 0 012.342 5.684 8.005 8.005 0 01-2.343 5.683A7.928 7.928 0 018.97 18a7.928 7.928 0 01-5.656-2.354z" fill="currentColor"/>
            </svg>
            <span class='visually-hidden'>Re-Capture</span>
          </button>
          <button id='select-back-of-id-image' class='button icon-btn' type='button'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox='0 0 41 41' height="40" width="40">
              <circle cx="20.5" cy="20.5" r="20" stroke="#fff"/>
              <path d="M12.3 20.5l6.15 6.15 12.3-12.3" stroke="#fff" stroke-width="3.075" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class='visually-hidden'>Accept Image</span>
          </button>
        </div>

        <img
          alt='your ID card'
          id='back-of-id-review-image'
          src=''
          width='396'
        />
      </div>

      ${this.hideAttribution ? '' : `
        <powered-by-smile-id></powered-by-smile-id>
      `}
    </div>
  </div>

  <div hidden id='thanks-screen' class='flow center'>
    <div class='section | flow'>
      <h1>Thank you</h1>

      ${this.hideAttribution ? '' : `
        <powered-by-smile-id></powered-by-smile-id>
      `}
    </div>
  </div>
  `;
}

class PoweredBySmileId extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = `
      <p style='margin-inline: auto; max-inline-size: 10rem'>
        <svg viewBox="0 0 90 9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.544 7V1.4H2.616C3.064 1.4 3.43467 1.47467 3.728 1.624C4.02133 1.77333 4.24 1.97867 4.384 2.24C4.528 2.50133 4.6 2.79467 4.6 3.12C4.6 3.42933 4.53067 3.71467 4.392 3.976C4.25333 4.232 4.03733 4.44 3.744 4.6C3.45067 4.75467 3.07467 4.832 2.616 4.832H1.568V7H0.544ZM1.568 4H2.552C2.90933 4 3.16533 3.92267 3.32 3.768C3.48 3.608 3.56 3.392 3.56 3.12C3.56 2.84267 3.48 2.62667 3.32 2.472C3.16533 2.312 2.90933 2.232 2.552 2.232H1.568V4ZM7.08025 7.096C6.69625 7.096 6.34958 7.008 6.04025 6.832C5.73625 6.656 5.49358 6.41333 5.31225 6.104C5.13625 5.78933 5.04825 5.42667 5.04825 5.016C5.04825 4.60533 5.13892 4.24533 5.32025 3.936C5.50158 3.62133 5.74425 3.376 6.04825 3.2C6.35758 3.024 6.70425 2.936 7.08825 2.936C7.46692 2.936 7.80825 3.024 8.11225 3.2C8.42158 3.376 8.66425 3.62133 8.84025 3.936C9.02158 4.24533 9.11225 4.60533 9.11225 5.016C9.11225 5.42667 9.02158 5.78933 8.84025 6.104C8.66425 6.41333 8.42158 6.656 8.11225 6.832C7.80292 7.008 7.45892 7.096 7.08025 7.096ZM7.08025 6.208C7.34692 6.208 7.57892 6.10933 7.77625 5.912C7.97358 5.70933 8.07225 5.41067 8.07225 5.016C8.07225 4.62133 7.97358 4.32533 7.77625 4.128C7.57892 3.92533 7.34958 3.824 7.08825 3.824C6.81625 3.824 6.58158 3.92533 6.38425 4.128C6.19225 4.32533 6.09625 4.62133 6.09625 5.016C6.09625 5.41067 6.19225 5.70933 6.38425 5.912C6.58158 6.10933 6.81358 6.208 7.08025 6.208ZM10.6632 7L9.50319 3.032H10.5192L11.2072 5.888L12.0072 3.032H13.1432L13.9432 5.888L14.6392 3.032H15.6552L14.4872 7H13.4232L12.5752 4.032L11.7272 7H10.6632ZM18.0886 7.096C17.6886 7.096 17.334 7.01067 17.0246 6.84C16.7153 6.66933 16.4726 6.42933 16.2966 6.12C16.1206 5.81067 16.0326 5.45333 16.0326 5.048C16.0326 4.63733 16.118 4.272 16.2886 3.952C16.4646 3.632 16.7046 3.384 17.0086 3.208C17.318 3.02667 17.6806 2.936 18.0966 2.936C18.486 2.936 18.83 3.02133 19.1286 3.192C19.4273 3.36267 19.6593 3.59733 19.8246 3.896C19.9953 4.18933 20.0806 4.51733 20.0806 4.88C20.0806 4.93867 20.078 5 20.0726 5.064C20.0726 5.128 20.07 5.19467 20.0646 5.264H17.0486C17.07 5.57333 17.1766 5.816 17.3686 5.992C17.566 6.168 17.8033 6.256 18.0806 6.256C18.2886 6.256 18.462 6.21067 18.6006 6.12C18.7446 6.024 18.8513 5.90133 18.9206 5.752H19.9606C19.886 6.00267 19.7606 6.232 19.5846 6.44C19.414 6.64267 19.2006 6.80267 18.9446 6.92C18.694 7.03733 18.4086 7.096 18.0886 7.096ZM18.0966 3.768C17.846 3.768 17.6246 3.84 17.4326 3.984C17.2406 4.12267 17.118 4.336 17.0646 4.624H19.0406C19.0246 4.36267 18.9286 4.15467 18.7526 4C18.5766 3.84533 18.358 3.768 18.0966 3.768ZM20.9419 7V3.032H21.8539L21.9499 3.776C22.0939 3.52 22.2885 3.31733 22.5339 3.168C22.7845 3.01333 23.0779 2.936 23.4139 2.936V4.016H23.1259C22.9019 4.016 22.7019 4.05067 22.5259 4.12C22.3499 4.18933 22.2112 4.30933 22.1099 4.48C22.0139 4.65067 21.9659 4.888 21.9659 5.192V7H20.9419ZM25.9714 7.096C25.5714 7.096 25.2168 7.01067 24.9074 6.84C24.5981 6.66933 24.3554 6.42933 24.1794 6.12C24.0034 5.81067 23.9154 5.45333 23.9154 5.048C23.9154 4.63733 24.0008 4.272 24.1714 3.952C24.3474 3.632 24.5874 3.384 24.8914 3.208C25.2008 3.02667 25.5634 2.936 25.9794 2.936C26.3688 2.936 26.7128 3.02133 27.0114 3.192C27.3101 3.36267 27.5421 3.59733 27.7074 3.896C27.8781 4.18933 27.9634 4.51733 27.9634 4.88C27.9634 4.93867 27.9608 5 27.9554 5.064C27.9554 5.128 27.9528 5.19467 27.9474 5.264H24.9314C24.9528 5.57333 25.0594 5.816 25.2514 5.992C25.4488 6.168 25.6861 6.256 25.9634 6.256C26.1714 6.256 26.3448 6.21067 26.4834 6.12C26.6274 6.024 26.7341 5.90133 26.8034 5.752H27.8434C27.7688 6.00267 27.6434 6.232 27.4674 6.44C27.2968 6.64267 27.0834 6.80267 26.8274 6.92C26.5768 7.03733 26.2914 7.096 25.9714 7.096ZM25.9794 3.768C25.7288 3.768 25.5074 3.84 25.3154 3.984C25.1234 4.12267 25.0008 4.336 24.9474 4.624H26.9234C26.9074 4.36267 26.8114 4.15467 26.6354 4C26.4594 3.84533 26.2408 3.768 25.9794 3.768ZM30.6487 7.096C30.2754 7.096 29.942 7.00533 29.6487 6.824C29.3554 6.64267 29.1234 6.39467 28.9527 6.08C28.782 5.76533 28.6967 5.408 28.6967 5.008C28.6967 4.608 28.782 4.25333 28.9527 3.944C29.1234 3.62933 29.3554 3.384 29.6487 3.208C29.942 3.02667 30.2754 2.936 30.6487 2.936C30.9474 2.936 31.2087 2.992 31.4327 3.104C31.6567 3.216 31.838 3.37333 31.9767 3.576V1.24H33.0007V7H32.0887L31.9767 6.432C31.8487 6.608 31.678 6.76267 31.4647 6.896C31.2567 7.02933 30.9847 7.096 30.6487 7.096ZM30.8647 6.2C31.1954 6.2 31.4647 6.09067 31.6727 5.872C31.886 5.648 31.9927 5.36267 31.9927 5.016C31.9927 4.66933 31.886 4.38667 31.6727 4.168C31.4647 3.944 31.1954 3.832 30.8647 3.832C30.5394 3.832 30.27 3.94133 30.0567 4.16C29.8434 4.37867 29.7367 4.66133 29.7367 5.008C29.7367 5.35467 29.8434 5.64 30.0567 5.864C30.27 6.088 30.5394 6.2 30.8647 6.2ZM38.3017 7.096C38.003 7.096 37.7417 7.04 37.5177 6.928C37.2937 6.816 37.1124 6.65867 36.9737 6.456L36.8617 7H35.9497V1.24H36.9737V3.6C37.1017 3.424 37.2697 3.26933 37.4777 3.136C37.691 3.00267 37.9657 2.936 38.3017 2.936C38.675 2.936 39.0084 3.02667 39.3017 3.208C39.595 3.38933 39.827 3.63733 39.9977 3.952C40.1684 4.26667 40.2537 4.624 40.2537 5.024C40.2537 5.424 40.1684 5.78133 39.9977 6.096C39.827 6.40533 39.595 6.65067 39.3017 6.832C39.0084 7.008 38.675 7.096 38.3017 7.096ZM38.0857 6.2C38.411 6.2 38.6804 6.09067 38.8937 5.872C39.107 5.65333 39.2137 5.37067 39.2137 5.024C39.2137 4.67733 39.107 4.392 38.8937 4.168C38.6804 3.944 38.411 3.832 38.0857 3.832C37.755 3.832 37.483 3.944 37.2697 4.168C37.0617 4.38667 36.9577 4.66933 36.9577 5.016C36.9577 5.36267 37.0617 5.648 37.2697 5.872C37.483 6.09067 37.755 6.2 38.0857 6.2ZM41.3051 8.76L42.2251 6.736H41.9851L40.4411 3.032H41.5531L42.6651 5.824L43.8251 3.032H44.9131L42.3931 8.76H41.3051Z" fill="#001096"/>
          <g clipPath="url(#clip0_1923_23296)">
              <path d="M58.5141 6.02913C58.5644 6.37005 58.8092 6.77098 59.4839 6.77098C60.0578 6.77098 60.336 6.56623 60.336 6.23338C60.336 5.90053 60.142 5.75579 59.788 5.71292L58.5988 5.58482C57.5612 5.47387 56.9539 4.86819 56.9539 3.87872C56.9539 2.77779 57.7801 2.04401 59.4335 2.04401C61.2135 2.04401 61.9221 2.88874 61.9894 3.88679H60.3195C60.2687 3.51157 59.965 3.27253 59.442 3.27253C58.9783 3.27253 58.6577 3.44349 58.6577 3.75062C58.6577 3.99774 58.8097 4.18534 59.2141 4.21964L60.1844 4.30486C61.4918 4.41582 62.0397 5.04672 62.0397 6.0962C62.0397 7.21377 61.3477 7.999 59.4504 7.999C57.5532 7.999 56.9534 7.02667 56.8691 6.02862H58.5141V6.02913Z" fill="#001096" />
              <path d="M70.1965 5.28736V7.85484H68.5431V5.56019C68.5431 5.09925 68.3746 4.80069 67.9194 4.80069C67.4212 4.80069 67.2108 5.11639 67.2108 5.78159V7.85484H65.5824V5.56019C65.5824 5.09925 65.4133 4.80069 64.9581 4.80069C64.4605 4.80069 64.2496 5.11639 64.2496 5.78159V7.85484H62.5967V3.58932H64.2496V4.24644C64.5113 3.75171 64.9581 3.45265 65.6586 3.45265C66.3592 3.45265 66.8309 3.7855 67.0587 4.35689C67.3285 3.80265 67.7842 3.45265 68.5351 3.45265C69.6735 3.45265 70.197 4.16928 70.197 5.28736H70.1965Z" fill="#001096" />
              <path d="M70.9785 3.8535V2.18118H72.6319V3.8535H70.9785ZM70.9785 7.85476V4.2504H72.6319V7.85476H70.9785Z" fill="#001096" />
              <path d="M73.4121 7.85475V2.18167H75.065V7.85525H73.4121V7.85475Z" fill="#001096" />
              <path d="M78.7264 6.53958H80.3579C80.1968 7.3243 79.5696 7.99151 78.0179 7.99151C76.2294 7.99151 75.6221 6.8568 75.6221 5.71351C75.6221 4.48499 76.3391 3.45265 78.0179 3.45265C79.8653 3.45265 80.3629 4.59594 80.3629 5.77302C80.3629 5.91776 80.3539 6.05443 80.3374 6.13966H77.2336C77.3178 6.68583 77.5881 6.89059 78.0518 6.89059C78.3729 6.89059 78.6083 6.73526 78.7269 6.53908L78.7264 6.53958ZM77.2416 5.21877H78.8022C78.7519 4.77497 78.5404 4.52785 78.0428 4.52785C77.5791 4.52785 77.3348 4.70689 77.2416 5.21877Z" fill="#001096" />
              <path d="M83.5907 7.85476H81.8994L81.9034 2.18118H83.5902L83.5912 7.85476H83.5907Z" fill="#001096" />
              <path d="M89.9995 5.00535C89.9995 6.46434 89.1474 7.85475 87.3345 7.85475H84.3652V2.18167H87.3345C89.1479 2.18167 89.9995 3.54686 89.9995 5.00535ZM86.9376 6.5067C87.8401 6.5067 88.2364 5.99482 88.2364 5.00535C88.2364 4.01588 87.8226 3.52971 86.9376 3.52971H86.06V6.5067H86.9376Z" fill="#001096" />
              <path d="M52.2123 3.88737H48V7.86846H52.2123V3.88737Z" fill="#001096" />
              <path d="M53.2359 0C53.2165 0 53.1975 0.00201727 53.1786 0.00252159C53.1591 0.00252159 53.1402 0 53.1207 0C52.0457 0 51.0869 0.708567 51.0869 2.27044V3.8888H55.2882V2.27044C55.2882 0.708567 54.3174 0 53.2359 0Z" fill="#FF9B00" />
          </g>
          <defs>
              <clipPath id="clip0_1923_23296">
                  <rect width="42" height="8" fill="white" transform="translate(48)" />
              </clipPath>
          </defs>
        </svg>
      </p>
    `;

    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
  }
}

function hasMoreThanNColors(data, n = 16) {
  const colors = new Set();
  for (let i = 0; i < Math.min(data.length, 10000); i += 4) {
    // eslint-disable-next-line no-bitwise
    colors.add((data[i] << 16) | (data[i + 1] << 8) | data[i + 2]);
    if (colors.size > n) {
      return true;
    }
  }
  return false;
}

window.customElements.define('powered-by-smile-id', PoweredBySmileId);

class SmartCameraWeb extends HTMLElement {
  constructor() {
    super();
    this.scwTemplateString = scwTemplateString.bind(this);
    this.render = () => this.scwTemplateString();
    this.attachShadow({ mode: 'open' });
    this.activeScreen = null;
  }

  setActiveScreen(element) {
    this.activeScreen.hidden = true;
    element.hidden = false; // eslint-disable-line no-param-reassign
    this.activeScreen = element;
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = this.render();

    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      this.setUpEventListeners();
    } else {
      const heading = document.createElement('h1');
      heading.classList.add('error-message');
      heading.textContent = 'Your browser does not support this integration';

      this.shadowRoot.innerHTML = heading;
    }
  }

  disconnectedCallback() {
    if (this.activeScreen) {
      this.activeScreen.hidden = true;
    }
    this.activeScreen = null;
    this.shadowRoot.innerHTML = '';
  }

  static get observedAttributes() {
    return ['document-capture-modes', 'document-type', 'hide-back-to-host', 'show-navigation'];
  }

  attributeChangedCallback(name) {
    switch (name) {
    case 'document-capture-modes':
    case 'document-type':
    case 'hide-back-to-host':
    case 'show-navigation':
      this.shadowRoot.innerHTML = this.render();
      this.setUpEventListeners();
      break;
    default:
      break;
    }
  }

  setUpEventListeners() {
    this.errorMessage = this.shadowRoot.querySelector('#error');

    this.requestScreen = this.shadowRoot.querySelector('#request-screen');
    this.activeScreen = this.requestScreen;
    this.cameraScreen = this.shadowRoot.querySelector('#camera-screen');
    this.failedImageTestScreen = this.shadowRoot.querySelector('#failed-image-test-screen');
    this.reviewScreen = this.shadowRoot.querySelector('#review-screen');
    this.idEntryScreen = this.shadowRoot.querySelector('#id-entry-screen');
    this.IDCameraScreen = this.shadowRoot.querySelector('#id-camera-screen');
    this.IDReviewScreen = this.shadowRoot.querySelector('#id-review-screen');
    this.backOfIdEntryScreen = this.shadowRoot.querySelector('#back-of-id-entry-screen');
    this.backOfIDCameraScreen = this.shadowRoot.querySelector('#back-of-id-camera-screen');
    this.backOfIDReviewScreen = this.shadowRoot.querySelector('#back-of-id-review-screen');
    this.thanksScreen = this.shadowRoot.querySelector('#thanks-screen');

    this.videoContainer = this.shadowRoot.querySelector('.video-container > .video');
    this.smileCTA = this.shadowRoot.querySelector('#smile-cta');
    this.imageOutline = this.shadowRoot.querySelector('#image-outline path');
    this.startImageCapture = this.shadowRoot.querySelector('#start-image-capture');
    this.captureIDImage = this.shadowRoot.querySelector('#capture-id-image');
    this.captureBackOfIDImage = this.shadowRoot.querySelector('#capture-back-of-id-image');
    this.reviewImage = this.shadowRoot.querySelector('#review-image');
    this.IDReviewImage = this.shadowRoot.querySelector('#id-review-image');
    this.backOfIDReviewImage = this.shadowRoot.querySelector('#back-of-id-review-image');

    this.reStartImageCapture = this.shadowRoot.querySelector('#restart-image-capture');
    this.reCaptureIDImage = this.shadowRoot.querySelector('#re-capture-id-image');
    this.reCaptureBackOfIDImage = this.shadowRoot.querySelector('#re-capture-back-of-id-image');
    this.selectSelfie = this.shadowRoot.querySelector('#select-selfie');
    this.selectIDImage = this.shadowRoot.querySelector('#select-id-image');
    this.selectBackOfIDImage = this.shadowRoot.querySelector('#select-back-of-id-image');
    this.takeDocumentPhotoButton = this.idEntryScreen.querySelector('#take-photo');
    this.uploadDocumentPhotoButton = this.idEntryScreen.querySelector('#upload-photo');
    this.skipBackOfDocumentPhotoButton = this.backOfIdEntryScreen.querySelector('#skip-this-step');
    this.takeBackOfDocumentPhotoButton = this.backOfIdEntryScreen.querySelector('#take-photo');
    this.uploadBackOfDocumentPhotoButton = this.backOfIdEntryScreen.querySelector('#upload-photo');

    this.shadowRoot.querySelector('#request-camera-access').addEventListener('click', () => this.init());

    if (this.showNavigation) {
      // Add Back Button Listeners
      const backButtons = this.shadowRoot.querySelectorAll('.back-button-exit');
      backButtons.forEach((button) => {
        button.addEventListener('click', () => {
          this._backAndExit();
        });
      });

      // Add Close Button Listeners
      const closeButtons = this.shadowRoot.querySelectorAll('.close-iframe');
      closeButtons.forEach((button) => {
        button.addEventListener('click', () => {
          this._exitSmartCamera();
        });
      });
    }

    if (this.takeDocumentPhotoButton) this.takeDocumentPhotoButton.addEventListener('click', () => this._startIDCamera());
    if (this.skipBackOfDocumentPhotoButton) this.skipBackOfDocumentPhotoButton.addEventListener('click', () => this._skipBackDocument());
    if (this.takeBackOfDocumentPhotoButton) this.takeBackOfDocumentPhotoButton.addEventListener('click', () => this._startIDCamera());
    if (this.uploadDocumentPhotoButton) this.uploadDocumentPhotoButton.addEventListener('change', (e) => this._uploadDocument(e));
    if (this.uploadBackOfDocumentPhotoButton) this.uploadBackOfDocumentPhotoButton.addEventListener('change', (e) => this._uploadDocument(e));

    this.backToSelfie = this.shadowRoot.querySelector('#back-button-selfie');
    this.backToIdEntryButton = this.shadowRoot.querySelector('#back-button-id-entry');
    this.backToBackIdEntryButton = this.shadowRoot.querySelector('#back-button-back-id-entry');
    this.backToIdImageButton = this.shadowRoot.querySelector('#back-button-id-image');

    if (this.backToSelfie) {
      this.backToSelfie.addEventListener('click', () => {
        this._reStartImageCapture();
      });
    }

    if (this.backToIdEntryButton) {
      this.backToIdEntryButton.addEventListener('click', () => {
        this.setActiveScreen(this.idEntryScreen);
      });
    }

    if (this.backToBackIdEntryButton) {
      this.backToBackIdEntryButton.addEventListener('click', () => {
        this.setActiveScreen(this.backOfIdEntryScreen);
      });
    }

    if (this.backToIdImageButton) {
      this.backToIdImageButton.addEventListener('click', () => {
        this.setActiveScreen(this.IDReviewScreen);
      });
    }

    this.startImageCapture.addEventListener('click', () => {
      this._startImageCapture();
    });

    this.selectSelfie.addEventListener('click', () => {
      this._selectSelfie();
    });

    this.selectIDImage.addEventListener('click', () => {
      this._selectIDImage();
    });

    this.selectBackOfIDImage.addEventListener('click', () => {
      this._selectIDImage(true);
    });

    this.captureIDImage.addEventListener('click', () => {
      this._captureIDImage();
    });

    this.captureBackOfIDImage.addEventListener('click', () => {
      this._captureIDImage();
    });

    this.reStartImageCapture.addEventListener('click', () => {
      this._reStartImageCapture();
    });

    this.reCaptureIDImage.addEventListener('click', () => {
      this._reCaptureIDImage();
    });

    this.reCaptureBackOfIDImage.addEventListener('click', () => {
      this._reCaptureIDImage();
    });
  }

  init() {
    this._videoStreamDurationInMS = 7800;
    this._imageCaptureIntervalInMS = 200;

    this._data = {
      images: [],
      partner_params: {
        libraryVersion: VERSION,
        permissionGranted: false,
      },
    };
    this._rawImages = [];

    navigator.mediaDevices.getUserMedia({ audio: false, video: true })
      .then((stream) => {
        this.handleSuccess(stream);
      })
      .catch((e) => {
        this.handleError(e);
      });
  }

  reset() {
    this.disconnectedCallback();
    this.connectedCallback();
  }

  resetErrorMessage() {
    this.errorMessage.textContent = '';
  }

  handleSuccess(stream) {
    const videoExists = !!this.videoContainer.querySelector('video');
    const video = videoExists ? this.videoContainer.querySelector('video') : document.createElement('video');

    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;

    if ('srcObject' in video) {
      video.srcObject = stream;
    } else {
      video.src = window.URL.createObjectURL(stream);
    }
    video.play();

    if (!videoExists) this.videoContainer.prepend(video);

    this._data.partner_params.permissionGranted = true;

    this.setActiveScreen(this.cameraScreen);

    this._stream = stream;
    this._video = video;
  }

  handleIDStream(stream) {
    const videoExists = this.activeScreen === this.IDCameraScreen
      ? !!this.IDCameraScreen.querySelector('video')
      : !!this.backOfIDCameraScreen.querySelector('video');

    let video = null;
    if (videoExists) {
      if (this.activeScreen === this.IDCameraScreen) {
        video = this.IDCameraScreen.querySelector('video');
      } else {
        video = this.backOfIDCameraScreen.querySelector('video');
      }
    } else {
      video = document.createElement('video');
    }

    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;

    if ('srcObject' in video) {
      video.srcObject = stream;
    } else {
      video.src = window.URL.createObjectURL(stream);
    }
    video.play();

    const videoContainer = this.activeScreen === this.IDCameraScreen
      ? this.IDCameraScreen.querySelector('.id-video-container')
      : this.backOfIDCameraScreen.querySelector('.id-video-container');

    video.onloadedmetadata = () => {
      videoContainer.querySelector('.actions').hidden = false;
    };

    if (!videoExists) {
      videoContainer.prepend(video);
    }

    this._IDStream = stream;
    this._IDVideo = video;
  }

  handleError(e) {
    switch (e.name) {
    case 'NotAllowedError':
    case 'SecurityError':
      this.errorMessage.textContent = `
          Looks like camera access was not granted, or was blocked by a browser
          level setting / extension. Please follow the prompt from the URL bar,
          or extensions, and enable access.
          You may need to refresh to start all over again
        `;
      break;
    case 'AbortError':
      this.errorMessage.textContent = `
          Oops! Something happened, and we lost access to your stream.
          Please refresh to start all over again
        `;
      break;
    case 'NotReadableError':
      this.errorMessage.textContent = `
          There seems to be a problem with your device's camera, or its connection.
          Please check this, and when resolved, try again. Or try another device.
        `;
      break;
    case 'NotFoundError':
      this.errorMessage.textContent = `
          We are unable to find a video stream.
          You may need to refresh to start all over again
        `;
      break;
    case 'TypeError':
      this.errorMessage.textContent = `
          This site is insecure, and as such cannot have access to your camera.
          Try to navigate to a secure version of this page, or contact the owner.
        `;
      break;
    default:
      this.errorMessage.textContent = e.message;
    }
  }

  _startImageCapture() {
    this.startImageCapture.disabled = true;

    /**
     * this was culled from https://jakearchibald.com/2013/animated-line-drawing-svg/
     */
    // NOTE: initialise image outline
    const imageOutlineLength = this.imageOutline.getTotalLength();
    // Clear any previous transition
    this.imageOutline.style.transition = 'none';
    // Set up the starting positions
    this.imageOutline.style.strokeDasharray = `${imageOutlineLength} ${imageOutlineLength}`;
    this.imageOutline.style.strokeDashoffset = imageOutlineLength;
    // Trigger a layout so styles are calculated & the browser
    // picks up the starting position before animating
    this.imageOutline.getBoundingClientRect();
    // Define our transition
    this.imageOutline.style.transition = `stroke-dashoffset ${this._videoStreamDurationInMS / 1000}s ease-in-out`;
    // Go!
    this.imageOutline.style.strokeDashoffset = '0';

    this.smileCTA.style.animation = `fadeInOut ease ${this._videoStreamDurationInMS / 1000}s`;

    this._imageCaptureInterval = setInterval(() => {
      this._capturePOLPhoto();
    }, this._imageCaptureIntervalInMS);

    this._videoStreamTimeout = setTimeout(() => {
      this._stopVideoStream(this._stream);
    }, this._videoStreamDurationInMS);
  }

  _captureIDImage() {
    const image = this._drawIDImage();

    if (this.activeScreen === this.IDCameraScreen) {
      this.IDReviewImage.src = image;
    } else {
      this.backOfIDReviewImage.src = image;
    }

    this._data.images.push({
      image: image.split(',')[1],
      image_type_id: this.activeScreen === this.IDCameraScreen ? 3 : 7,
    });

    this._stopIDVideoStream();

    if (this.activeScreen === this.IDCameraScreen) {
      this.setActiveScreen(this.IDReviewScreen);
    } else {
      this.setActiveScreen(this.backOfIDReviewScreen);
    }
  }

  _drawImage(canvas, enableImageTests = true, video = this._video) {
    this.resetErrorMessage();
    const context = canvas.getContext('2d');

    context.drawImage(
      video,
      0,
      0,
      video.videoWidth,
      video.videoHeight,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    if (enableImageTests) {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      const hasEnoughColors = hasMoreThanNColors(imageData.data);

      if (hasEnoughColors) {
        return context;
      }
      throw new Error('Unable to capture webcam images - Please try another device');
    } else {
      return context;
    }
  }

  _capturePOLPhoto() {
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = (canvas.width * this._video.videoHeight) / this._video.videoWidth;

    // NOTE: we do not want to test POL images
    this._drawImage(canvas, false);

    this._rawImages.push(canvas.toDataURL('image/jpeg'));
  }

  _captureReferencePhoto() {
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = (canvas.width * this._video.videoHeight) / this._video.videoWidth;

    // NOTE: we want to test the image quality of the reference photo
    this._drawImage(canvas, !this.disableImageTests);

    const image = canvas.toDataURL('image/jpeg');

    this._referenceImage = image;

    this._data.images.push({
      image: image.split(',')[1],
      image_type_id: 2,
    });
  }

  _skipBackDocument() {
    this._publishSelectedImages();
  }

  async _uploadDocument(event) {
    this.resetErrorMessage();
    try {
      const { files } = event.target;

      // validate file, and convert file to data url
      const fileData = await SmartFileUpload.retrieve(files);

      // add file to images list
      this._data.images.push({
        // NOTE: data URLs start with a file type before the base64 data,
        // separated by a comma.
        //
        // we are only interested in the base64 segment, so we extract it
        image: fileData.split(',')[1],
        image_type_id: this.activeScreen === this.idEntryScreen ? 3 : 7,
      });

      // add file to preview state
      const nextScreen = this.activeScreen === this.idEntryScreen ? this.IDReviewScreen : this.backOfIDReviewScreen;
      const previewImage = nextScreen.querySelector('img');
      previewImage.src = fileData;

      // change active screen
      this.setActiveScreen(nextScreen);
    } catch (error) {
      this.handleError(error);
    }
  }

  _drawIDImage(video = this._IDVideo) {
    const canvas = document.createElement('canvas');
    if (this.isPortraitCaptureView) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame onto the canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get the dimensions of the video preview frame
      const previewWidth = PORTRAIT_ID_PREVIEW_WIDTH;
      const previewHeight = PORTRAIT_ID_PREVIEW_HEIGHT;

      // Define the padding value
      const paddingPercent = 0.5; // 50% of the preview dimensions;
      const paddedWidth = previewWidth * (1 + paddingPercent);
      const paddedHeight = previewHeight * (1 + paddingPercent);

      // Calculate the dimensions of the cropped image based on the padded preview frame dimensions
      const cropWidth = paddedWidth;
      const cropHeight = paddedHeight;
      const cropLeft = (canvas.width - cropWidth) / 2;
      const cropTop = (canvas.height - cropHeight) / 2;

      // Create a new canvas element for the cropped image
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = cropWidth;
      croppedCanvas.height = cropHeight;

      // Draw the cropped image onto the new canvas
      const croppedCtx = croppedCanvas.getContext('2d');
      croppedCtx.drawImage(canvas, cropLeft, cropTop, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

      return croppedCanvas.toDataURL('image/jpeg');
    }

    canvas.width = 2240;
    canvas.height = 1260;

    const context = canvas.getContext('2d');
    const aspectRatio = video.videoWidth / video.videoHeight;

    // NOTE: aspectRatio is greater than 1 in landscape mode, less in portrait
    if (aspectRatio < 1) {
      const imageFrame = this.activeScreen.querySelector('[class*="image-frame"]:not([hidden]) [href*="image-frame"]');
      const videoBox = video.getBoundingClientRect();
      const frameBox = imageFrame.getBoundingClientRect();

      const sourceXOffset = ((frameBox.left - videoBox.left) / videoBox.width) * video.videoWidth;
      const sourceYOffset = ((frameBox.top - videoBox.top) / videoBox.height) * video.videoHeight;
      const sourceWidth = frameBox.width * (video.videoWidth / videoBox.width);
      const sourceHeight = frameBox.height * (video.videoHeight / videoBox.height);

      canvas.height = (canvas.width * frameBox.height) / frameBox.width;

      context.drawImage(video, sourceXOffset, sourceYOffset, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg');
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
  }

  _stopVideoStream(stream) {
    try {
      clearTimeout(this._videoStreamTimeout);
      clearInterval(this._imageCaptureInterval);
      clearInterval(this._drawingInterval);
      this.smileCTA.style.animation = 'none';

      this._capturePOLPhoto(); // NOTE: capture the last photo
      this._captureReferencePhoto();
      stream.getTracks().forEach((track) => track.stop());

      this.reviewImage.src = this._referenceImage;

      const totalNoOfFrames = this._rawImages.length;

      const livenessFramesIndices = getLivenessFramesIndices(totalNoOfFrames);

      this._data.images = this._data.images.concat(livenessFramesIndices.map((imageIndex) => ({
        image: this._rawImages[imageIndex].split(',')[1],
        image_type_id: 6,
      })));

      this.setActiveScreen(this.reviewScreen);
    } catch (error) {
      this.setActiveScreen(this.failedImageTestScreen);
    }
  }

  _stopIDVideoStream(stream = this._IDStream) {
    stream.getTracks().forEach((track) => track.stop());
  }

  async _startIDCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'environment',
          width: { min: 1280 },
          // NOTE: Special case for multi-camera Samsung devices (learnt from Acuant)
          // "We found out that some triple camera Samsung devices (S10, S20, Note 20, etc) capture images blurry at edges.
          // Zooming to 2X, matching the telephoto lens, doesn't solve it completely but mitigates it."
          zoom: isSamsungMultiCameraDevice() ? 2.0 : 1.0,
        },
      });

      if (this.activeScreen === this.idEntryScreen) {
        this.setActiveScreen(this.IDCameraScreen);
      } else if (this.activeScreen === this.backOfIdEntryScreen) {
        this.setActiveScreen(this.backOfIDCameraScreen);
      }

      this.handleIDStream(stream);
    } catch (e) {
      this.handleError(e);
    }
  }

  _selectSelfie() {
    if (!this.captureID) {
      this._publishSelectedImages();
    } else {
      this.setActiveScreen(this.idEntryScreen);
    }
  }

  _selectIDImage(backOfIDCaptured = false) {
    if (!this.captureBackOfID || backOfIDCaptured) {
      this._publishSelectedImages();
    } else {
      this.setActiveScreen(this.backOfIdEntryScreen);
    }
  }

  _publishSelectedImages() {
    this.dispatchEvent(
      new CustomEvent('imagesComputed', { detail: this._data }),
    );

    this.setActiveScreen(this.thanksScreen);
  }

  _exitSmartCamera() {
    this.dispatchEvent(
      new CustomEvent('close', { detail: {} }),
    );
  }

  _backAndExit() {
    this.dispatchEvent(
      new CustomEvent('backExit', { detail: {} }),
    );
  }

  async _reStartImageCapture() {
    this.startImageCapture.disabled = false;

    this._rawImages = [];
    this._data.images = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });

      this.handleSuccess(stream);
    } catch (e) {
      this.handleError(e);
    }
  }

  async _reCaptureIDImage() {
    const previousScreen = this.activeScreen === this.IDReviewScreen
      ? this.idEntryScreen : this.backOfIdEntryScreen;
    this.setActiveScreen(previousScreen);

    // NOTE: removes the last element in the list
    this._data.images.pop();
  }

  get captureID() {
    return this.hasAttribute('capture-id');
  }

  get captureBackOfID() {
    return this.getAttribute('capture-id') === 'back' || false;
  }

  get hideAttribution() {
    return this.hasAttribute('hide-attribution');
  }

  get showNavigation() {
    return this.hasAttribute('show-navigation');
  }

  get hideBackToHost() {
    return this.hasAttribute('hide-back-to-host');
  }

  get documentType() {
    return this.getAttribute('document-type');
  }

  get isPortraitCaptureView() {
    return this.getAttribute('document-type') === 'GREEN_BOOK';
  }

  get documentCaptureModes() {
    /*
      NOTE: options are `camera`, `upload`, and a comma-separated combination
      of both.

      defaults to `camera`;
    */
    return this.getAttribute('document-capture-modes') || 'camera';
  }

  get supportBothCaptureModes() {
    const value = this.documentCaptureModes;
    return value.includes('camera') && value.includes('upload');
  }

  get disableImageTests() {
    return this.hasAttribute('disable-image-tests');
  }

  get doNotUpload() {
    return this.getAttribute('document-capture-modes') === 'camera';
  }
}

window.customElements.define('smart-camera-web', SmartCameraWeb);
