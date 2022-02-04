import { useState, useEffect } from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { myTopTracks, albumTracks } from "./utils/apiOptions";
import { REDIRECT_URI, SCOPES, CLIENT_ID, ALBUM_ID } from "./utils/constants";
import Colors from "./Themes/colors";
import {
  StyleSheet,
  Text,
  Button,
  View,
  TextInput,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native-web";
import millisToMinutesAndSeconds from "./utils/millisToMinuteSeconds";

// Endpoints for authorizing with Spotify
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

export default function App() {
  const [token, setToken] = useState("");
  const [tracks, setTracks] = useState([]);
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: CLIENT_ID,
      scopes: SCOPES,
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: REDIRECT_URI,
    },
    discovery
  );

  //console.log(tracks);

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  useEffect(() => {
    if (token) {
      // TODO: Select which option you want: Top Tracks or Album Tracks

      // Comment out the one you are not using
      myTopTracks(setTracks, token);
      //albumTracks(ALBUM_ID, setTracks, token);
    }
  }, [token]);

  function SpotifyButton() {
    return (
      <Button
        style={styles.button}
        // pressing the add button calls our addTodo function
        title="Spotify Button"
        onPress={promptAsync}
      />
    );
  }

  function SongList() {
    return (
      <FlatList
        data={tracks} // set our data for the FlatList as the todos state variable we created earlier
        renderItem={renderSong} // use the renderTodo function to render each item
        keyExtractor={(item, index) => item + index}
      />
    );
  }

  const renderSong = ({ item, index }) => {
    console.log("NEW ITEM");

    //console.log(item);
    return (
      <Song
        index={index + 1}
        title={item.name}
        duration={item.duration_ms}
        artists={item.artists[0].name}
        albumImage={item.album.images[0].url}
        albumName={item.album.name}
      />
    );
  };

  function Song(props) {
    console.log(props.albumImage);
    return (
      <View style={styles.songContainer}>
        <View style={styles.songIndex}>
          <Text>{props.index}</Text>
        </View>
        <View style={styles.songImage}>
          <Image styles={styles.image} source={{ uri: props.albumImage }} />
        </View>
        <View style={styles.songTitle}>
          <Text numberOfLines={1} style={styles.textStandard}>
            {props.title}
          </Text>
          <Text numberOfLines={1} style={styles.textStandard}>
            {props.artists}
          </Text>
        </View>
        <View style={styles.songAlbum}>
          <Text numberOfLines={1} style={styles.textStandard}>
            {props.albumName}
          </Text>
        </View>
        <View style={styles.songDuration}>
          <Text style={styles.textStandard}>
            {millisToMinutesAndSeconds(props.duration)}
          </Text>
        </View>
      </View>
    );
  }
  componentToDisplay = null;
  if (!token) {
    componentToDisplay = <SpotifyButton />;
  } else {
    componentToDisplay = <SongList />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ color: "white" }}>Welcome to Assignment 3 - Spotify</Text>

      {componentToDisplay}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  button: {
    height: 40,
    width: "20%",
    borderColor: "gray",
    borderWidth: 1,
  },
  songContainer: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: Colors.background,
    width: "100%",
    height: 50,
    alignSelf: "center",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  index: {
    width: "10%",
    color: "white",
  },
  songImage: {
    width: "20%",
    color: "white",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  songTitle: {
    width: "32.5%",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  songAlbum: {
    width: "27.5%",
    color: "white",
  },
  songDuration: {
    width: "10%",
    color: "white",
  },
  textStandard: {
    color: "white",
  },
});
