<script>
  // ============================================
  // LOGIN PAGE - Student Template
  // ============================================
  // 🎯 Learning Goals:
  // - Use Firebase signInWithEmailAndPassword to log users in
  // - Handle errors with try-catch (what if password is wrong?)
  // - Show loading states while waiting for Firebase
  // - Navigate to different pages after login

  // ==================== IMPORTS ====================

  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { auth } from '../firebase.js';
  import { goto } from '$app/navigation';
  import { browser } from '$app/env';
  import authStore from '../stores/authStore.js';

  // ==================== STATE VARIABLES ====================

  let email = '';        // User's email
  let password = '';     // User's password
  let error = '';
  let loading = false;

  // ==================== LOGIN FUNCTION ====================

  async function login() {
    error = '';

    if (!email.trim() || !password) {
      error = 'Please enter your email and password';
      return;
    }

    loading = true;

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
  
      console.log('Login successful!');

      await goto('/');

    } catch (err) {
      console.error('Login error:', err);

      switch (err.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          error = 'Invalid email or password. Please try again.';
          break;
        case 'auth/too-many-requests':
          error = 'Too many failed attempts. Please try again later.';
          break;
        default:
          error = 'Login failed. Please try again.';
      }

    } finally {
      loading = false;
    }
  }

  // ==================== REACTIVE CHECKS ====================

  $: if ($authStore.isLoggedIn && !loading && browser) {
    goto('/');
  }
</script>

<style>
  @import url("https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css");

  .container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .card {
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    border: none;
    border-radius: 16px;
  }

  .error-message {
    background: #fed7d7;
    border: 1px solid #fc8181;
    color: #c53030;
    padding: 0.75rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
</style>

<div class="container">
  <div class="card mt-5 text-center" style="width: 24em;">
    <div class="card-body p-4">
      <h5 class="card-title">Welcome Back</h5>
      <p class="card-text text-muted">Login to continue tracking your mood</p>

      {#if error}
        <div class="error-message">
          ⚠️ {error}
        </div>
      {/if}

      <!-- Login Form -->
      <form on:submit|preventDefault={login}>
        <!-- Email Input -->
        <div class="mb-3 text-left">
          <label for="emailInput" class="form-label">Email address</label>
          <input
            bind:value={email}
            type="email"
            class="form-control"
            id="emailInput"
            placeholder="your@email.com"
            disabled={loading}
            required
          />
        </div>

        <!-- Password Input -->
        <div class="mb-3 text-left">
          <label for="passwordInput" class="form-label">Password</label>
          <input
            bind:value={password}
            type="password"
            class="form-control"
            id="passwordInput"
            placeholder="Your password"
            disabled={loading}
            required
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="btn btn-dark btn-block mt-3"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  </div>

  <div class="text-center mt-3">
    <a href="/signup" class="text-white" style="text-decoration: none;">
      First time? <strong>Create an account</strong>
    </a>
  </div>
</div>