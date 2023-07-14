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

const getStatsByUid = async (uid) => {
  try {
    const docSnapshot = await db.collection("profiles").doc(uid).get();
    if (docSnapshot.exists) {
      const data = docSnapshot.data();
      const stats = data.stats || {};
      return stats;
    } else {
      return {};
    }
  } catch (error) {
    console.error("Error fetching stats:", error);
    return null;
  }
};

const getProfile = async (uid) => {
  try {
    const docSnapshot = await db.collection("profiles").doc(uid).get();
    if (docSnapshot.exists) {
      const data = docSnapshot.data();
      return { uid: docSnapshot.id, ...data };
    } else {
      return {};
    }
  } catch (error) {
    console.error("Error fetching stats:", error);
    return null;
  }
};

const getAllProfiles = async () => {
  try {
    const querySnapshot = await db.collection("profiles").get();
    const profiles = [];
    querySnapshot.forEach((doc) => profiles.push(doc.data()));
    return profiles;
  } catch (error) {
    console.error("Error fetching user collection:", error);
    return null;
  }
};

const getInviteFriendsList = async (uid) => {
  try {
    const querySnapshot = await db.collection("profiles").get();
    const profiles = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return { uid: doc.id, ...data };
    });
    const querySnapshot2 = await db.collection("friends").doc(uid).get();
    const friendsData = querySnapshot2.data();
    const friends = friendsData?.accepted?.map((friend) => friend.uid) || [];
    const inviteFriends = profiles.filter((profile) => {
      return !friends.includes(profile.uid) && profile.uid !== uid;
    });
    return inviteFriends;
  } catch (error) {
    console.error("Error fetching user collection:", error);
    return null;
  }
};

const getFriendsList = async (uid) => {
  try {
    const querySnapshot = await db.collection("friends").doc(uid).get();
    const friendsData = querySnapshot.data().accepted;
    const friends = friendsData.map((friend) => friend.uid);
    const friendsProfiles = await Promise.all(
      friends.map(async (friend) => {
        const profile = await getProfile(friend);
        return profile;
      })
    );
    return friendsProfiles;
  } catch (error) {
    console.error("Error fetching user collection:", error);
    return null;
  }
};

export {
  getUidByUsername,
  getUpcomingGames,
  getPastGames,
  getStatsByUid,
  getProfile,
  getAllProfiles,
  getInviteFriendsList,
  getFriendsList,
};
