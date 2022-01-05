<script>
	import { onMount } from 'svelte';
	import NewUserForm from '$lib/components/user/NewUserForm.svelte';

	let hash;

	onMount(() => (hash = window.location.hash));
</script>

<main>
	<h1>User Account</h1>

	{#if !!hash}
		<NewUserForm />
	{/if}
</main>
