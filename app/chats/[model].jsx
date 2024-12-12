import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { styles } from "../index";
import * as Speech from "expo-speech";
import { GiftedChat } from "react-native-gifted-chat";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router, useLocalSearchParams } from "expo-router";
import {
  apiKey,
  BOT_ID,
  USER_ID,
  GROK_URL,
  POLLINATION_URL,
} from "../../constants/constants";

const craftMessage = (queryMessage, options, image = "") => {
  const message = {
    _id: Math.random().toString(36).substring(7),
    text: queryMessage,
    createdAt: new Date(),
    user: options,
  };
  if (image !== "") message.image = image;

  return message;
};

const Model = () => {
  const [recognizing, setRecognizing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [queryText, setQueryText] = useState("");

  const { model } = useLocalSearchParams();
  useSpeechRecognitionEvent("start", () => setRecognizing(true));
  useSpeechRecognitionEvent("end", () => setRecognizing(false));
  useSpeechRecognitionEvent("result", (event) => {
    setQueryText(event.results[0]?.transcript);
  });
  useSpeechRecognitionEvent("error", (event) => {
    console.log("error code:", event.error, "error message:", event.message);
  });

  const handleStart = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      console.warn("Permissions not granted", result);
      return;
    }
    // Start speech recognition
    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
      maxAlternatives: 1,
      continuous: false,
      requiresOnDeviceRecognition: false,
      addsPunctuation: false,
      contextualStrings: [
        "hello",
        "hi",
        "help",
        "how are you",
        "bye",
        "thank you",
        "chatbot",
        "assistant",
      ],
    });
  };

  function handleGeneration() {
    if (queryText.toLowerCase().includes("generate image")) {
      generateImage();
    } else {
      sendRequest();
    }
    setQueryText("");
  }

  const sendRequest = () => {
    const message = craftMessage(queryText, { _id: USER_ID });
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [message])
    );

    fetch(GROK_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "assistant",
            content: `You are ${model}, a chatbot assistant.`,
          },
          {
            role: "user",
            content: queryText,
          },
        ],
        model: "grok-beta",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const responseMessage = craftMessage(
          data.choices[0].message.content.trim(),
          { _id: BOT_ID, name: model }
        );

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [responseMessage])
        );
        Speech.speak(data.choices[0].message.content.trim(), {});
      })
      .catch((error) => console.error("Error:", error));
  };

  const generateImage = () => {
    const message = craftMessage(queryText, { _id: USER_ID });

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [message])
    );

    const imagelocation = `${POLLINATION_URL}/${queryText}`;

    fetch(imagelocation)
      .then((_) => {
        const responseMessage = craftMessage(
          "Image",
          {
            _id: BOT_ID,
            name: model,
          },
          imagelocation
        );

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [responseMessage])
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <SafeAreaView
      style={{ height: "100%", backgroundColor: "#EDEDED", flex: 1 }}
    >
      <View style={customStyles.messageContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>{model}</Text>
        <FontAwesome5 name="robot" size={24} color="black" />
      </View>
      <View style={customStyles.inputContainer}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <GiftedChat
            messages={messages}
            renderInputToolbar={() => {}}
            user={{ _id: 1 }}
          />
        </View>

        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <TouchableOpacity
            onPress={() => {
              if (!recognizing) {
                handleStart();
              } else {
                ExpoSpeechRecognitionModule.stop();
              }
            }}
          >
            <View style={customStyles.buttons}>
              {!recognizing ? (
                <FontAwesome name="microphone" size={24} color="white" />
              ) : (
                <FontAwesome name="microphone-slash" size={24} color="white" />
              )}
            </View>
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <TextInput
              value={queryText}
              placeholder="Enter your question"
              onChangeText={(text) => setQueryText(text)}
              style={customStyles.textInput}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              if (!queryText) return;
              handleGeneration();
            }}
          >
            <View style={customStyles.buttons}>
              <Ionicons name="send" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Model;

const customStyles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#EDEDED",
  },

  messageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 15,
    marginRight: 15,
  },

  buttons: {
    backgroundColor: "#007AFF",
    padding: 5,
    marginLeft: 15,
    marginRight: 10,
    marginBottom: 20,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    borderRadius: 40,

    borderWidth: 1,
    borderColor: "grey",
    height: 50,
    marginRight: 10,

    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
});
