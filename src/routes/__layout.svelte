<script>
	import { onMount } from 'svelte';

	import { firebase } from '$lib/stores/auth';

	import '../app.css';
	import Header from '$lib/components/header/Header.svelte';

	onMount(() => firebase.signIn());
</script>

<Header />

<div id="site-wrapper">
	<slot />
</div>

<style>
	#site-wrapper {
		width: min(90rem, 100%);
		min-height: calc(100vh - var(--header-height));
		margin: 0 auto;
	}
</style>
