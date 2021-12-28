<script>
	import { goto } from '$app/navigation';

	import { user } from '$lib/stores/user';
	import { userReady } from '$lib/stores/userReady';
	import Loader from './Loader.svelte';

	$: if ($userReady && !$user) goto('/login');
</script>

<div class="auth-only-page">
	{#if !$userReady}
		<Loader />
	{:else}
		<slot />
	{/if}
</div>

<style>
	.auth-only-page {
		position: relative;
		min-width: 100%;
		min-height: calc(100vh - var(--header-height));
	}
</style>
