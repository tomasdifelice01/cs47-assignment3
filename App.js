import { useState, useEffect } from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { myTopTracks, albumTracks } from "./utils/apiOptions";
import { REDIRECT_URI, SCOPES, CLIENT_ID, ALBUM_ID } from "./utils/constants";
import Colors from "./Themes/colors";
import images from "./Themes/images";

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
  Pressable,
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
      <Pressable style={styles.button} onPress={promptAsync}>
        <Image style={styles.buttonLogo} source={images.spotify} />

        <Text style={styles.buttonText}>CONNECT WITH SPOTIFY</Text>
      </Pressable>
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
        artists={item.artists}
        albumImage={item.album.images[0].url}
        albumName={item.album.name}
      />
    );
  };

  function Song(props) {
    console.log(props.albumImage);
    return (
      <SafeAreaView style={styles.songContainer}>
        <View style={styles.songIndex}>
          <Text style={styles.indexText}>{props.index}</Text>
        </View>
        <View style={styles.songImage}>
          <Image style={styles.image} source={{ uri: props.albumImage }} />
        </View>
        <View style={styles.songTitle}>
          <Text numberOfLines={1} style={styles.textStandard}>
            {props.title}
          </Text>
          <Text numberOfLines={2}>
            {props.artists.map((artistObj, index) => {
              return index != props.artists.length - 1 ? (
                <Text numberOfLines={1} style={styles.textGrayed}>
                  {artistObj.name},
                </Text>
              ) : (
                <Text numberOfLines={1} style={styles.textGrayed}>
                  {artistObj.name}
                </Text>
              );
            })}
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
      </SafeAreaView>
    );
  }
  componentToDisplay = null;
  if (!token) {
    componentToDisplay = <SpotifyButton />;
  } else {
    componentToDisplay = (
      <View style={styles.displayContainer}>
        <View style={styles.header}>
          <Image style={styles.spotifyLogo} source={images.spotify} />
          <Text style={styles.headerText}>My Top tracks</Text>
        </View>
        <SongList />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>{componentToDisplay}</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  displayContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
  },
  spotifyLogo: {
    width: 21,
    height: "90%",
    resizeMode: "contain",
    marginRight: 5,
  },
  header: {
    height: 40,
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    color: "white",
    fontWeight: "700",
    fontSize: 23,
    marginHorizontal: 5,
  },
  button: {
    display: "flex",
    flexDirection: "row",
    height: 35,
    width: "55%",
    backgroundColor: Colors.spotify,
    borderWidth: 1,
    borderRadius: 99999,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 13,
    color: "white",
    fontWeight: "800",
  },
  buttonLogo: {
    width: 17,
    height: "90%",
    resizeMode: "contain",
    marginRight: 5,
  },
  songContainer: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: Colors.background,
    width: "100%",
    height: 70,
    alignSelf: "center",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 5,
    marginVertical: 1,
  },
  songIndex: {
    width: "5%",
    color: "white",
    alignSelf: "center",
  },
  songImage: {
    width: "21%",
    color: "white",
  },
  image: {
    width: "95%",
    height: "86%",
    resizeMode: "contain",
    alignSelf: "center",
  },
  songTitle: {
    width: "32.5%",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingRight: 8,
  },
  songArtists: {
    maxHeight: 10,
  },
  songAlbum: {
    width: "25%",
    color: "white",
    paddingRight: 5,
  },
  songDuration: {
    width: "11.5%",
    color: "white",
  },
  textStandard: {
    fontSize: 13,
    color: "white",
    fontWeight: "300",
  },
  textGrayed: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: "200",
  },
  indexText: {
    fontSize: 12,
    color: "white",
    fontWeight: "200",
    textAlign: "center",
    paddingLeft: 5,
  },
});
