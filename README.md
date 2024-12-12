# Chatbot Application
This is a React Native Expo-based chatbot application that leverages Grok AI for text generation and Pollination AI for image generation.

## Features
- Text Messaging: Chat seamlessly with the bot for instant responses.
- Image Generation: Generate images based on your prompts.
- Text Narration: Convert text to speech for a hands-free experience.
- Speech to Text: Convert speech to a text prompt.

## Key Dependencies



-  [react](https://reactjs.org/)
-  [react-native](https://reactnative.dev/)
-  [expo](https://expo.dev/)
-  [expo-speech-recognition](https://docs.expo.dev/versions/latest/sdk/speech-recognition/)
-  [expo-speech](https://docs.expo.dev/versions/latest/sdk/speech/)




## Installation

1. Clone the Repoistory
   
   ```bash
   git clone https://github.com/AshitomW/chatbot.git

2. Install Dependencies

   ```
   npm install
   ```

3. Configure grok Api Key

    Put the API KEY in `apiKey` in constants.js
     ```
      export const apiKey="YOUR XAPI KEY"
     ```
4. Install Expo CLI (if not already installed)

   ```bash
     npm install -g expo-cli
5. Running App With Development Build

   To use features like expo-speech-recognition, a native development build is required.
   ```bash
   npx expo run:ios
   ```
   or
   ```bash
   npx expo run:android

## API Integrations
- [GrokAI/X-AI](https://x.ai/)
- [Pollinations-AI](https://pollinations.ai/)


## Potential Improvements

- Add conversation history
- Enhance UI/UX
- Implement more robust error handling

## Contributing

Fork the repository and submit pull requests for improvements or bug fixes. Contributions are appreciated to help make this project better!

