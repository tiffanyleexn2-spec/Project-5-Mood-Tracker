<script>
  // ============================================
  // SIGNUP PAGE - Student Template
  // ============================================
  // 🎯 Learning Goals:
  // - Use Firebase createUserWithEmailAndPassword to create accounts
  // - Validate user input (email format, password strength)
  // - Handle Firebase errors gracefully
  // - Understand password confirmation pattern

  // ==================== IMPORTS ====================

  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { auth } from '../firebase.js';
  import { goto } from '$app/navigation';
  import { browser } from '$app/env';
  import authStore from '../stores/authStore.js';

  // ==================== STATE VARIABLES ====================

  let email = '';              // User's email
  let password = '';           // User's password
  let confirmPassword = '';
  let error = '';
  let loading = false;

  // ==================== VALIDATION FUNCTIONS ====================

  function isValidEmail(email) {
    // This pattern checks for valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateForm() {
    if (!email.trim() || !password || !confirmPassword) {
      return 'Please fill in all fields';
    }

    if (!isValidEmail(email)) {
      return 'Please enter a valid email address';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    return null; // Everything is valid!
  }

  // ==================== SIGNUP FUNCTION ====================

  async function register() {
    error = '';

    const validationError = validateForm();
    if (validationError) {
      error = validationError;
      return;
    }

    loading = true;

    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
  
      console.log('Account created successfully!');

      await goto('/');

    } catch (err) {
      console.error('Signup error:', err);

      switch (err.code) {
        case 'auth/email-already-in-use':
          error = 'This email is already registered. Please login instead.';
          break;
        case 'auth/invalid-email':
          error = 'Invalid email address format.';
          break;
        case 'auth/weak-password':
          error = 'Password is too weak. Please use a stronger password.';
          break;
        default:
          error = 'Failed to create account. Please try again.';
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
      <h5 class="card-title">Create Account</h5>
      <p class="card-text text-muted">Sign up to start tracking your mood</p>

      {#if error}
        <div class="error-message">
          ⚠️ {error}
        </div>
      {/if}

      <!-- Signup Form -->
      <form on:submit|preventDefault={register}>
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
            placeholder="At least 6 characters"
            disabled={loading}
            required
          />
        </div>

        <!-- Confirm Password Input -->
        <div class="mb-3 text-left">
          <label for="confirmPasswordInput" class="form-label">Confirm Password</label>
          <input
            bind:value={confirmPassword}
            type="password"
            class="form-control"
            id="confirmPasswordInput"
            placeholder="Re-enter your password"
            disabled={loading}
            required
          />
        </div>

        <div class="form-text text-muted mb-3">
          Your password must be at least 6 characters long.
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="btn btn-dark btn-block mt-3"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  </div>

  <div class="text-center mt-3">
    <a href="/login" class="text-white" style="text-decoration: none;">
      Already have an account? <strong>Login here</strong>
    </a>
  </div>
</div>
