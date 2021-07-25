import { googleSpeechCredentials } from "./private";
import { ToolboxPanel } from "./ToolboxPanel";

const recorder = require('node-record-lpcm16');

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

// TODO - properly connect to environment variables
process.env.GOOGLE_APPLICATION_CREDENTIALS = googleSpeechCredentials;

// Creates a client
const client = new speech.SpeechClient();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const encoding = 'LINEAR16'; // 'Encoding of the audio file, e.g. LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US'; // 'BCP-47 language code, e.g. en-US';



// TODO - maybe define properties
let recognizeStream: any = null;
let recording: any = null;
let request: any = null;

export class SpeechClient {

  private static isConfigured = false;

  static setSpeechConfiguration(keywords?: string[]) {
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
      interimResults: false, // If you want interim results, set this to true
    };
  }

  static async startSpeechRecognition(keywords?: string[]) {

    if (!SpeechClient.isConfigured) {
      SpeechClient.setSpeechConfiguration(keywords);
    }

    // Create a recognize stream
    let transcript = "";
    recognizeStream = await client
    .streamingRecognize(request)
    .on('error', console.error)
    .on('data', (data: any) =>
      // process.stdout.write(
      //   data.results[0] && data.results[0].alternatives[0]
      //     ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
      //     : '\n\nReached transcription time limit, press Ctrl+C\n'
      // )
      {
        if (data.results[0] && data.results[0].alternatives[0]) {
          //  process.stdout.write(`Transcription: ${data.results[0].alternatives[0].transcript}\n`);
            transcript = data.results[0].alternatives[0].transcript;
            // console.log(transcript);
            if (ToolboxPanel.currentPanel) {
              const webview = ToolboxPanel.getPanelWebview();
              webview?.postMessage({
                type: "transcript",
                value: transcript,
              });
            }
        }
      }
    );

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
      .on('error', console.error)
      .pipe(recognizeStream);

      console.log('Listening, press Ctrl+C to stop.');  
    }

    static stopSpeechRecognition() { // not sure if this needs to async
      if (!recognizeStream) {
        console.log("System was never listening.");
        return;
      }
      recognizeStream.end();
      recognizeStream.removeListener('data', (data: any) => // is this the right way to remove the listener?
        process.stdout.write(
          data.results[0] && data.results[0].alternatives[0]
            ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
            : '\n\nReached transcription time limit, press Ctrl+C\n'
        ));
      recognizeStream = null;

      // recording.stop(); // for some reason this function isn't recognized
      console.log('Listening has stopped. Allow listening if you would like suggested references.');
    }

}
