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

    const friendsSnapshot = await db.collection("friends").doc(uid).get();
    const friendsData = friendsSnapshot?.data();
    const acceptedFriends =
      friendsData?.accepted?.map((friend) => friend.uid) || [];
    const sentFriends = friendsData?.sent?.map((friend) => friend.uid) || [];
    const pendingFriends =
      friendsData?.pending?.map((friend) => friend.uid) || [];

    const inviteFriends = profiles?.filter((profile) => {
      return (
        !acceptedFriends?.includes(profile.uid) &&
        !sentFriends?.includes(profile.uid) &&
        !pendingFriends?.includes(profile.uid) &&
        profile.uid !== uid
      );
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
    const friendsData = querySnapshot?.data()?.accepted;
    const friendUids = friendsData?.map((friend) => friend.uid) || [];
    const friendsProfiles = await Promise.all(
      friendUids.map(async (friendUid) => {
        const profile = await getProfile(friendUid);
        return profile;
      })
    );
    return friendsProfiles;
  } catch (error) {
    console.error("Error fetching user collection:", error);
    return null;
  }
};

const getPendingFriendsList = async (uid) => {
  try {
    const querySnapshot = await db.collection("friends").doc(uid).get();
    const friendsData = querySnapshot?.data().pending;
    const friends = friendsData?.map((friend) => friend.uid);
    const friendsProfiles = await Promise.all(
      friends?.map(async (friend) => {
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

const addFriend = async (uid, friendUid) => {
  try {
    // check if friendUid is already in the sent list of the requester
    const requesterSnapshot = await db.collection("friends").doc(uid).get();
    const requesterData = requesterSnapshot?.data() || {
      sent: [],
      pending: [],
    };
    const isAlreadySent = requesterData.sent.some(
      (sentFriend) => sentFriend.uid === friendUid
    );

    if (isAlreadySent) {
      throw new Error("Friend request already sent");
    }

    // add uid to sent list of requester
    requesterData.sent = requesterData.sent || [];
    requesterData.sent.push({ uid: friendUid, time: Date.now() });

    // add uid to pending list of friend
    const friendSnapshot = await db.collection("friends").doc(friendUid).get();
    const friendData = friendSnapshot?.data() || { sent: [], pending: [] };
    friendData.pending = friendData.pending || [];
    friendData.pending.push({ uid: uid, time: Date.now() });

    // update requester and friend documents
    await Promise.all([
      db.collection("friends").doc(uid).set(requesterData),
      db.collection("friends").doc(friendUid).set(friendData),
    ]);

    return true;
  } catch (error) {
    console.error("Error adding friend:", error);
    return null;
  }
};

const acceptFriend = async (uid, friendUid) => {
  try {
    // check if friendUid is already in the accepted list of current user
    const currUserSnapshot = await db.collection("friends").doc(uid).get();
    const currUserData = currUserSnapshot?.data() || {
      accepted: [],
      sent: [],
    };
    const acceptedList = currUserData.accepted ?? [];
    const isFriendAccepted = acceptedList.some(
      (friend) => friend.uid === friendUid
    );
    if (isFriendAccepted) {
      throw new Error("Friend request already accepted");
    }

    // add uid to current user list of requester
    currUserData.accepted = acceptedList.concat({
      uid: friendUid,
      time: Date.now(),
    });

    // remove friendUid from current user pending list
    currUserData.pending = (currUserData.pending || []).filter(
      (friend) => friend.uid !== friendUid
    );

    // add uid to accepted list of friend
    const friendSnapshot = await db.collection("friends").doc(friendUid).get();
    const friendData = friendSnapshot?.data() || { accepted: [], pending: [] };
    const friendAcceptedList = friendData.accepted ?? [];
    friendData.accepted = friendAcceptedList.concat({
      uid: uid,
      time: Date.now(),
    });

    // remove uid from friend sent list
    friendData.sent = (friendData.sent || []).filter(
      (friend) => friend.uid !== uid
    );

    // update requester and friend documents
    await Promise.all([
      db.collection("friends").doc(uid).set(currUserData),
      db.collection("friends").doc(friendUid).set(friendData),
    ]);

    return true;
  } catch (error) {
    console.error("Error accepting friend:", error);
    return null;
  }
};

const rejectFriend = async (uid, friendUid) => {
  try {
    // check if friendUid is already in the pending list of requester
    const requesterSnapshot = await db.collection("friends").doc(uid).get();
    const requesterData = requesterSnapshot?.data() || { pending: [] };
    const isFriendPending = requesterData.pending.some(
      (friend) => friend.uid === friendUid
    );
    if (!isFriendPending) {
      throw new Error("Friend request already rejected");
    }

    // remove uid from pending list of requester
    requesterData.pending = requesterData.pending.filter(
      (friend) => friend.uid !== friendUid
    );

    // remove uid from sent list of friend
    const friendSnapshot = await db.collection("friends").doc(friendUid).get();
    const friendData = friendSnapshot?.data() || { sent: [] };
    friendData.sent = friendData.sent.filter((friend) => friend.uid !== uid);

    // update requester and friend documents
    await Promise.all([
      db.collection("friends").doc(uid).set(requesterData),
      db.collection("friends").doc(friendUid).set(friendData),
    ]);

    return true;
  } catch (error) {
    console.error("Error rejecting friend:", error);
    return null;
  }
};

const removeFriend = async (uid, friendUid) => {
  try {
    // check if friendUid is already in the accepted list of requester
    const requesterSnapshot = await db.collection("friends").doc(uid).get();
    const requesterData = requesterSnapshot?.data() || { accepted: [] };
    const isFriendAccepted = requesterData.accepted.some(
      (friend) => friend.uid === friendUid
    );
    if (!isFriendAccepted) {
      throw new Error("Friend already removed");
    }

    // remove uid from accepted list of requester
    requesterData.accepted = requesterData.accepted.filter(
      (friend) => friend.uid !== friendUid
    );

    // remove uid from accepted list of friend
    const friendSnapshot = await db.collection("friends").doc(friendUid).get();
    const friendData = friendSnapshot?.data() || { accepted: [] };
    friendData.accepted = friendData.accepted.filter(
      (friend) => friend.uid !== friendUid
    );

    // update requester and friend documents
    await Promise.all([
      db.collection("friends").doc(uid).set(requesterData),
      db.collection("friends").doc(friendUid).set(friendData),
    ]);

    return true;
  } catch (error) {
    console.error("Error removing friend:", error);
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
  getPendingFriendsList,
  addFriend,
  acceptFriend,
  rejectFriend,
  removeFriend,
};
