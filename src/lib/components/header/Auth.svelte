<script>
	import { firebase } from '$lib/stores/firebase';
	import { user } from '$lib/stores/user';
	import { userReady } from '$lib/stores/userReady';

	import LoginForm from '../header/LoginForm.svelte';
	import Loader from '../utilities/Loader.svelte';
	import LogoutForm from './LogoutForm.svelte';

	$: waiting = !$firebase.statusKnown || !$userReady;
</script>

<div class="auth-cont">
	{#if waiting}
		<div class="loader-cont">
			<Loader />
		</div>
	{/if}

	{#if $user}
		<LogoutForm bind:waiting />
	{:else}
		<LoginForm bind:waiting />
	{/if}
</div>

<style>
	.auth-cont {
		margin: 1rem 0;
	}
</style>
