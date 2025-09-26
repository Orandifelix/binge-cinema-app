import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export type LastWatched = {
  movieId: string;
  title?: string;
  poster_path?: string;
};

/** Helper - path: users/{uid}/lastWatched */
const lastWatchedRef = (uid: string) => doc(db, "users", uid, "meta", "lastWatched");

/** Ensure user is logged in */
function requireUser() {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return user;
}

/** Save last watched movie */
export async function saveLastWatched(movie: LastWatched) {
  const user = requireUser();
  const ref = lastWatchedRef(user.uid);
  await setDoc(ref, movie, { merge: true });
}

/** Fetch last watched movie */
export async function getLastWatched(): Promise<LastWatched | null> {
  const user = requireUser();
  const ref = lastWatchedRef(user.uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as LastWatched) : null;
}
