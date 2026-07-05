import { writable } from 'svelte/store';
import { collection, addDoc, query, where, orderBy, onSnapshot, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

// The moods store containing the array of mood entries for the logged-in user
export const moods = writable([]);

let unsubscribe = null;

// Automatically manage subscription to the user's mood collection based on auth state
onAuthStateChanged(auth, (user) => {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }

  if (user) {
    const q = query(
      collection(db, 'moods'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    unsubscribe = onSnapshot(q, (snapshot) => {
      const moodList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          mood: data.mood,
          note: data.note,
          // Handle serverTimestamp which is null/undefined during offline persistence / local cache latency
          timestamp: data.createdAt ? data.createdAt.toDate() : new Date(),
          ...data
        };
      });
      moods.set(moodList);
    }, (error) => {
      console.error("Firestore onSnapshot error:", error);
    });
  } else {
    moods.set([]);
  }
});

// ✅ Add mood to Firestore
export async function addMood(mood, note) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');

  return addDoc(collection(db, 'moods'), {
    uid: user.uid,
    mood,
    note,
    createdAt: serverTimestamp()
  });
}

// ✅ Delete mood from Firestore
export async function deleteMood(id) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
  return deleteDoc(doc(db, 'moods', id));
}

// ✅ Helper function to get mood configuration (emojis, labels, colors)
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

// ✅ Format timestamp nicely
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
