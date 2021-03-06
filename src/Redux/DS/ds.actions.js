import DsActionTypes from "./ds.types";
import axios from "axios";

const url = process.env.REACT_APP_BACKEND_BASE_URL;

export const postDSSong = obj => dispatch => {
  dispatch({
    type: DsActionTypes.POST_DS_SONGS_FETCHING
  });
  console.log("OBJ passed into postDSSong", JSON.stringify(obj));
  axios
    .post(`${url}/request`, obj)
    .then(res => {
      console.log("success postDSSong");
      if (
        res.data.songs !== undefined &&
        res.data.songs !== null &&
        res.data.songs.length > 0
      ) {
        if (localStorage.getItem("ds_songs") !== null) {
          const previous_ds_songs = localStorage.getItem("ds_songs");

          localStorage.setItem(
            "ds_songs",
            JSON.stringify(JSON.parse(previous_ds_songs).concat(res.data.songs))
          );

          /*    localStorage.setItem(
              'ds_songs',
              JSON.stringify([
                ...new Set(
                  JSON.parse(previous_ds_songs)
                    .concat(res.data.songs)
                    .map(song => ({
                      similarity: song.similarity,
                      values: song.values,
                    })),
                ),
              ]),
            ); */
        } else {
          localStorage.setItem("ds_songs", JSON.stringify(res.data.songs));
        }
      }
      dispatch({
        type: DsActionTypes.POST_DS_SONGS_SUCCESS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: DsActionTypes.POST_DS_SONGS_FAILURE,
        payload: err.data
      });
    });
};
