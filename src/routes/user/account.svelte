<script context="module">
	import { browser } from '$app/env';

	export function load() {
		let hash = '';
		if (browser) hash = window.location.hash;

		return {
			props: { hash }
		};
	}
</script>

<script>
	import NewUserForm from '$lib/components/user/NewUserForm.svelte';

	export let hash;
</script>

<main>
	<h1>User Account</h1>

	{#if hash === '#new-user'}
		<NewUserForm />
	{/if}
</main>
