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
      .where("eventDetails.fixture.status.short", "in", ["TBD", "NS", "LIVE"])
      .get();
    const opponentQuerySnapshot = await db
      .collection("events")
      .where("opponent", "==", uid)
      .where("eventDetails.fixture.status.short", "in", ["TBD", "NS", "LIVE"])
      .get();
    const upcomingGames = [];
    querySnapshot.forEach((doc) => upcomingGames.push(doc.data()));
    opponentQuerySnapshot.forEach((doc) => upcomingGames.push(doc.data()));

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
      .where("eventDetails.fixture.status.short", "not-in", [
        "TBD",
        "NS",
        "LIVE",
      ])
      .get();
    const opponentQuerySnapshot = await db
      .collection("events")
      .where("opponent", "==", uid)
      .where("eventDetails.fixture.status.short", "not-in", [
        "TBD",
        "NS",
        "LIVE",
      ])
      .get();
    const pastGames = [];
    querySnapshot.forEach((doc) => pastGames.push(doc.data()));
    opponentQuerySnapshot.forEach((doc) => pastGames.push(doc.data()));

    return pastGames;
  } catch (error) {
    console.error("Error fetching user collection:", error);
    return null;
  }
};

export { getUidByUsername, getUpcomingGames, getPastGames };
