import { googleSpeechCredentials } from "./private";

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

const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  interimResults: false, // If you want interim results, set this to true
};

export class SpeechClient {

  static async startSpeechRecognition() {
      // Create a recognize stream
    const recognizeStream = await client
    .streamingRecognize(request)
    .on('error', console.error)
    .on('data', (data: any) =>
      process.stdout.write(
        data.results[0] && data.results[0].alternatives[0]
          ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
          : '\n\nReached transcription time limit, press Ctrl+C\n'
      )
    );

    // Start recording and send the microphone input to the Speech API.
    // Ensure SoX is installed, see https://www.npmjs.com/package/node-record-lpcm16#dependencies
      recorder
      .record({
        sampleRateHertz: sampleRateHertz,
        threshold: 0,
        // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
        verbose: false,
        recordProgram: 'rec', // Try also "arecord" or "sox"
        silence: '10.0',
      })
      .stream()
      .on('error', console.error)
      .pipe(recognizeStream);

      console.log('Listening, press Ctrl+C to stop.');  
    }

}
