import { collection, addDoc, query, where, orderBy, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';



export async function addMood(mood, note) {
  const user = auth.currentUser
  if (!user) throw new Error('Not signed in')

  return addDoc(collection(db, 'moods'), {
    uid: user.uid,
    mood,
    note,
    createdAt: serverTimestamp()
  })
}

export function watchMyMoods(callback) {
  const user = auth.currentUser
  if (!user) return () => { }

  const q = query(
    collection(db, 'moods'),
    where('uid', '==', user.uid),
    orderBy('createdAt', 'desc')
  )

  return onSnapshot(q, (snapshot) => {
    const moods = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(moods)
  })
}
export async function deleteMood(id) {
  const user = auth.currentUser
  if (!user) return
  return deleteDoc(doc(db, 'moods', id))
}


// ✅ WORKING: Helper function to get mood configuration
export function getMoodConfig(moodValue) {
  const moodOptions = [
    { value: 'amazing', emoji: '😄', label: 'Amazing', color: '#48bb78' },
    { value: 'happy', emoji: '😊', label: 'Happy', color: '#38b2ac' },
    { value: 'okay', emoji: '😐', label: 'Okay', color: '#ecc94b' },
    { value: 'sad', emoji: '😢', label: 'Sad', color: '#ed8936' },
    { value: 'terrible', emoji: '😭', label: 'Terrible', color: '#f56565' }
  ];

  return moodOptions.find(m => m.value === moodValue) || moodOptions[2]; // Default to 'okay'
}

// ✅ WORKING: Format timestamp nicely
export function formatTimestamp(timestamp) {
  if (!timestamp) return 'Just now';

  // Calculate time difference
  const now = new Date();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Return appropriate format
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  // For older entries, show full date
  return timestamp.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// TODO Phase 2: Swap this whole file from a mock writable to a Firestore-backed
//   store. The new shape should:
//     - subscribe to a query over the `moods` collection filtered by the
//       current user's uid and ordered by timestamp desc
//     - drive `moods` updates from onSnapshot()
//     - implement addMood() with addDoc + serverTimestamp()
//     - implement deleteMood() with deleteDoc()
//   Keep the public API (`moods`, `addMood`, `deleteMood`, `getMoodConfig`,
//   `formatTimestamp`) so the dashboard doesn't change. Verify: a second tab
//   signed in as the same user picks up new moods live; a different user
//   sees an isolated history.
