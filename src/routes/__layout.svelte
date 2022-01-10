<script>
	import '../app.css';
	import { browser } from '$app/env';
	import { firebase } from '$lib/stores/firebase';
	import { user } from '$lib/stores/user';

	$: if (browser) console.log('firebase: ', $firebase);
	$: if (browser) console.log('user: ', $user);

	import Header from '$lib/components/header/Header.svelte';
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
