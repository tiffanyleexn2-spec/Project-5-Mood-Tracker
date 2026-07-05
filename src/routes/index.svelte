<script>
  // ============================================
  // MOOD TRACKER DASHBOARD - 65% Working Version
  // ============================================
  // 🎯 What's Working (65%):
  // ✅ Full mood tracking UI with mock data
  // ✅ Add moods with emoji selector
  // ✅ Display mood history with timestamps
  // ✅ Delete moods
  // ✅ Fully functional WITHOUT Firebase!
  //
  // ⚠️ Your TODO (30%):
  // - Replace mock store with Firebase Firestore
  // - Add user authentication
  // - Filter moods by userId
  //
  // 🚀 See results in <30 seconds! No Firebase needed initially.

  // ==================== IMPORTS ====================
  import {
    moods,
    addMood,
    deleteMood,
    getMoodConfig,
    formatTimestamp,
  } from "$lib/stores/moodStore";
  import { goto } from "$app/navigation";
  import { browser } from "$app/env";
  import authStore from "../stores/authStore.js";
  import { signOut } from "firebase/auth";
  import { auth } from "../firebase.js";

  // ==================== AUTH REDIRECT ====================
  $: if ($authStore.isLoggedIn === false && browser) {
    goto("/login");
  }

  // ==================== LOGOUT FUNCTION ====================
  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error logging out:", err);
    }
  }

  // ==================== STATE VARIABLES ====================
  // Mood form data
  let mood = ""; // Which mood did user select?
  let note = ""; // Optional note about their mood

  // App state
  let submitting = false; // True while saving new mood
  let error = ""; // Error messages

  // Mood options with emojis and colors!
  const moodOptions = [
    { value: "amazing", emoji: "😄", label: "Amazing", color: "#48bb78" },
    { value: "happy", emoji: "😊", label: "Happy", color: "#38b2ac" },
    { value: "okay", emoji: "😐", label: "Okay", color: "#ecc94b" },
    { value: "sad", emoji: "😢", label: "Sad", color: "#ed8936" },
    { value: "terrible", emoji: "😭", label: "Terrible", color: "#f56565" },
  ];

  // ✅ WORKING: Add mood handler
  async function handleAddMood() {
    // Validate that user selected a mood
    if (!mood) {
      error = "Please select a mood";
      return;
    }

    submitting = true;
    error = "";

    try {
      // Add mood using Firebase
      await addMood(mood, note);

      console.log("Mood saved successfully!");

      // Clear the form
      mood = "";
      note = "";
    } catch (err) {
      console.error("Error adding mood:", err);
      error = "Failed to add mood. Please try again.";
    } finally {
      submitting = false;
    }
  }

  // ✅ WORKING: Delete mood handler
  function handleDeleteMood(id) {
    if (confirm("Are you sure you want to delete this mood?")) {
      deleteMood(id);
    }
  }
</script>

<div class="dashboard-container">
  <!-- Header -->
  <div class="header">
    <div class="demo-badge">✨ Mock Data Demo - No Firebase Required!</div>
    <h1>🌈 Mood Tracker</h1>
    <p class="text-muted">Track your emotions and reflect on your day</p>
    <div class="d-flex justify-content-between align-items-center mt-3">
      <div class="text-muted small">
        Logged in as: <strong>{$authStore.user?.email || "Loading..."}</strong>
      </div>
      <button class="btn btn-outline-danger btn-sm" on:click={handleLogout}
        >Logout</button
      >
    </div>
  </div>

  <!-- Mood Input Form -->
  <div class="mood-form">
    <h5 class="mb-3">How are you feeling today?</h5>

    <!-- Error Message -->
    {#if error}
      <div class="error-message">⚠️ {error}</div>
    {/if}

    <!-- Mood Options -->
    <div class="mood-options">
      {#each moodOptions as option}
        <button
          class="mood-option"
          class:selected={mood === option.value}
          on:click={() => {
            mood = option.value;
            error = "";
          }}
          type="button"
        >
          <span class="mood-emoji">{option.emoji}</span>
          <span class="mood-label">{option.label}</span>
        </button>
      {/each}
    </div>

    <!-- Note Input -->
    <div class="mb-3">
      <label for="noteInput" class="form-label">Add a note (optional)</label>
      <textarea
        id="noteInput"
        class="form-control"
        rows="3"
        placeholder="What's on your mind?"
        bind:value={note}
        disabled={submitting}
      />
    </div>

    <!-- Submit Button -->
    <button
      class="btn btn-primary btn-block"
      on:click={handleAddMood}
      disabled={!mood || submitting}
    >
      {submitting ? "Adding..." : "Add Mood"}
    </button>
  </div>

  <!-- Moods History -->
  <div>
    <h5 class="text-white mb-3">Your Mood History ({$moods.length} entries)</h5>

    {#if $moods.length > 0}
      <!-- Display mood cards -->
      {#each $moods as moodEntry (moodEntry.id)}
        <div class="mood-card">
          <div class="mood-card-header">
            <div class="mood-display">
              <span class="mood-card-emoji"
                >{getMoodConfig(moodEntry.mood).emoji}</span
              >
              <div>
                <div class="mood-card-label">
                  {getMoodConfig(moodEntry.mood).label}
                </div>
                <div class="mood-timestamp">
                  {formatTimestamp(moodEntry.timestamp)}
                </div>
              </div>
            </div>
            <button
              class="btn-delete"
              on:click={() => handleDeleteMood(moodEntry.id)}
            >
              Delete
            </button>
          </div>
          {#if moodEntry.note}
            <p class="mood-note">{moodEntry.note}</p>
          {/if}
        </div>
      {/each}
    {:else}
      <!-- Empty state -->
      <div class="empty-state">
        <div class="empty-state-emoji">📝</div>
        <div class="empty-state-text">No moods tracked yet!</div>
        <div class="empty-state-subtext">
          Select a mood above to get started.
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  @import url("https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css");

  :global(body) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 2rem 0;
  }

  .dashboard-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .header {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  }

  .demo-badge {
    display: inline-block;
    background: #667eea;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .mood-form {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  }

  .mood-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .mood-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    background: white;
  }

  .mood-option:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .mood-option.selected {
    border-color: #667eea;
    background: #f7fafc;
    transform: translateY(-2px);
  }

  .mood-emoji {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .mood-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #4a5568;
  }

  .mood-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 1rem;
    transition: transform 0.2s;
  }

  .mood-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }

  .mood-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .mood-display {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .mood-card-emoji {
    font-size: 2rem;
  }

  .mood-card-label {
    font-size: 1.125rem;
    font-weight: 600;
    color: #2d3748;
  }

  .mood-timestamp {
    font-size: 0.875rem;
    color: #718096;
  }

  .mood-note {
    color: #4a5568;
    margin-bottom: 0.75rem;
    line-height: 1.6;
  }

  .btn-delete {
    padding: 0.375rem 0.75rem;
    background: #f56565;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-delete:hover {
    background: #e53e3e;
  }

  .error-message {
    background: #fed7d7;
    border: 1px solid #fc8181;
    color: #c53030;
    padding: 0.75rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 2rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(10px);
  }

  .empty-state-emoji {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .empty-state-text {
    color: white;
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
  }

  .empty-state-subtext {
    color: rgba(255, 255, 255, 0.8);
  }
</style>
