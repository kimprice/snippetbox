// Parts of this file are adapted from Google's infinite streaming sample
// https://github.com/googleapis/nodejs-speech/blob/master/samples/infiniteStreaming.js
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0

import { extContext } from "./extension";
import * as vscode from "vscode";
import { ToolboxPanel } from "./ToolboxPanel";
import * as readline from 'readline';

const recorder = require('node-record-lpcm16');

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

const { Writable: WRITABLE } = require('stream');

// TODO - properly connect to environment variables
process.env.GOOGLE_APPLICATION_CREDENTIALS = "";

// Creates a client
const client = new speech.SpeechClient();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const encoding = 'LINEAR16'; // 'Encoding of the audio file, e.g. LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US'; // 'BCP-47 language code, e.g. en-US';
const streamingLimit = 300000; // in ms, API call times out at 305s



// TODO - maybe define properties
let recognizeStream: any = null;
let recording: any = null;
let restartCounter = 0;
let micInput: any[] = [];
let lastMicInput: any[] = [];
let resultEndTime = 0;
let isFinalEndTime = 0;
let finalRequestEndTime = 0;
let newStream = true;
let bridgingOffset = 0;
let lastTranscriptWasFinal = false;

let request: any = null;

export class SpeechClient {

  private static isConfigured = false;

  static setSpeechConfiguration(keywords?: string[]) {
    // Set API Key
    process.env.GOOGLE_APPLICATION_CREDENTIALS = vscode.Uri.joinPath(extContext.extensionUri, "speechrecext.json").fsPath;

    // Set configuration
    request = {
      config: {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
      },
      speechContexts: [{
        phrases: keywords,
      }],
      interimResults: true, // If you want interim results, set this to true
    };
  }

  static startSpeechRecognition(keywords?: string[]) {

    if (!SpeechClient.isConfigured) {
      SpeechClient.setSpeechConfiguration(keywords);
    }

    micInput = []; // clear current input

    // Create a recognize stream
    recognizeStream = client
    .streamingRecognize(request)
    .on('error', (err: any) => {
      if (err.code === 11) { // don't know what this error code is
        // restartStream();
      } else {
        console.error(`Google Speech API request error: ${err}`);
      }
    })
    .on('data', SpeechClient.speechCallback);

    // Restart stream when streamingLimit expires
    setTimeout(SpeechClient.restartStream, streamingLimit);

    // Start recording and send the microphone input to the Speech API.
    // Ensure SoX is installed, see https://www.npmjs.com/package/node-record-lpcm16#dependencies
    // Options for recorder
    // sampleRate            : 16000  // audio sample rate
    // channels              : 1      // number of channels
    // threshold             : 0.5    // silence threshold (rec only)
    // endOnSilence          : false  // automatically end on silence (if supported)
    // thresholdStart        : null   // silence threshold to start recording, overrides threshold (rec only)
    // thresholdEnd          : null   // silence threshold to end recording, overrides threshold (rec only)
    // silence               : '1.0'  // seconds of silence before ending
    // recorder              : 'sox'  // Defaults to 'sox'
    // device                : null   // recording device (e.g.: 'plughw:1')
    // audioType             : 'wav'  // audio type to record
      recording = recorder
      .record({
        sampleRateHertz: sampleRateHertz,
        threshold: 0,
        // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
        verbose: false,
        recordProgram: 'rec', // Try also "arecord" or "sox"
        silence: '1.0',
      })
      .stream()
      .on('error', (err: any) => {
        console.error('Audio recording error ' + err);
      })
      .pipe(SpeechClient.micInputStreamTransform);

      console.log('Listening, press Ctrl+C to stop.'); 
      
      
    } // end startSpeechRecognition

    static speechCallback = (stream: any) => {
      // Convert API result end time from seconds + nanoseconds to milliseconds
      resultEndTime = stream.results[0].resultEndTime.seconds * 1000 +
        Math.round(stream.results[0].resultEndTime.nanos / 1000000);

      // Calculate correct time based on offset from audio sent twice
      const correctedTime = resultEndTime - bridgingOffset + streamingLimit * restartCounter;
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      let stdoutText = '';
      if (stream.results[0] && stream.results[0].alternatives[0]) {
        let transcript = stream.results[0].alternatives[0].transcript;
        stdoutText = correctedTime + ': ' + transcript;
            // console.log(transcript);
            if (ToolboxPanel.currentPanel) {
              const webview = ToolboxPanel.getPanelWebview();
              webview?.postMessage({
                type: "transcript",
                value: transcript,
              });
            }
      }

      if (stream.results[0].isFinal) {
        process.stdout.write(`${stdoutText}\n`);
  
        isFinalEndTime = resultEndTime;
        lastTranscriptWasFinal = true;
      } else {
        // Make sure transcript does not exceed console character length
        if (stdoutText.length > process.stdout.columns) {
          stdoutText =
            stdoutText.substring(0, process.stdout.columns - 4) + '...';
        }
        process.stdout.write(`${stdoutText}`);
  
        lastTranscriptWasFinal = false;
      }
    }; // end speechCallback

    static micInputStreamTransform = new WRITABLE({
      write(chunk: any, encoding: any, next: () => void) {
        if (newStream && lastMicInput.length !== 0) {
          // Approximate math to calculate time of chunks
          const chunkTime = streamingLimit / lastMicInput.length;
          if (chunkTime !== 0) {
            if (bridgingOffset < 0) {
              bridgingOffset = 0;
            }
            if (bridgingOffset > finalRequestEndTime) {
              bridgingOffset = finalRequestEndTime;
            }
            const chunksFromMS = Math.floor(
              (finalRequestEndTime - bridgingOffset) / chunkTime
            );
            bridgingOffset = Math.floor(
              (lastMicInput.length - chunksFromMS) * chunkTime
            );
  
            for (let i = chunksFromMS; i < lastMicInput.length; i++) {
              recognizeStream.write(lastMicInput[i]);
            }
          }
          newStream = false;
        }

        micInput.push(chunk);

        if (recognizeStream) {
          recognizeStream.write(chunk);
        }

        next();
      },

      final() {
        if (recognizeStream) {
          recognizeStream.end();
        }
      },      

    });

    static restartStream() {
      if (recognizeStream) {
        recognizeStream.end();
        recognizeStream.removeListener('data', SpeechClient.speechCallback);
        recognizeStream = null;
      }
      if (resultEndTime > 0) {
        finalRequestEndTime = isFinalEndTime;
      }
      resultEndTime = 0;
  
      lastMicInput = [];
      lastMicInput = micInput;
  
      restartCounter++;
  
      if (!lastTranscriptWasFinal) {
        process.stdout.write('\n');
      }
      process.stdout.write(`${streamingLimit * restartCounter}: RESTARTING REQUEST\n`);
  
      newStream = true;
  
      SpeechClient.startSpeechRecognition();
    }

    static stopSpeechRecognition() { // not sure if this needs to async
      if (!recognizeStream) {
        console.log("System was never listening.");
        return;
      }
      recognizeStream.end();
      recognizeStream.removeListener('data', SpeechClient.speechCallback);
      recognizeStream = null;

      // recording.stop(); // for some reason this function isn't recognized
      console.log('Listening has stopped. Allow listening if you would like suggested references.');
    }

}
