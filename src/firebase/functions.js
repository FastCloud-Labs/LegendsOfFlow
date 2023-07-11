import db from "./init";

const getUidByUsername = async (username) => {
  try {
    const querySnapshot = await db
      .collection("profiles")
      .where("username", "==", username)
      .get();

    if (querySnapshot.empty) {
      return null;
    } else {
      return querySnapshot.docs[0].id;
    }
  } catch (error) {
    console.error("Error fetching user collection:", error);
    return null;
  }
};

const getUpcomingGames = async (uid) => {
  try {
    const querySnapshot = await db
      .collection("events")
      .where("owner", "==", uid)
      // .where("startDate", ">", new Date()) todo: need game starting date to be in the firestore
      .get();
    const opponentQuerySnapshot = await db
      .collection("events")
      .where("opponent", "==", uid)
      // .where("startDate", ">", new Date()) todo: need game starting date to be in the firestore
      .get();

    const upcomingGames = [];
    upcomingGames.push(...querySnapshot.docs.map((doc) => doc.data()));
    upcomingGames.push(...opponentQuerySnapshot.docs.map((doc) => doc.data()));

    return upcomingGames;
  } catch (error) {
    console.error("Error fetching user collection:", error);
    return null;
  }
};

const getPastGames = async (uid) => {
  try {
    const querySnapshot = await db
      .collection("events")
      .where("owner", "==", uid)
      // .where("startDate", "<", new Date()) todo: need game starting date to be in the firestore
      .get();
    const opponentQuerySnapshot = await db
      .collection("events")
      .where("opponent", "==", uid)
      // .where("startDate", "<", new Date()) todo: need game starting date to be in the firestore
      .get();

    const pastGames = [];
    pastGames.push(...querySnapshot.docs.map((doc) => doc.data()));
    pastGames.push(...opponentQuerySnapshot.docs.map((doc) => doc.data()));

    return pastGames;
  } catch (error) {
    console.error("Error fetching user collection:", error);
    return null;
  }
};

export { getUidByUsername, getUpcomingGames, getPastGames };
