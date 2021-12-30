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

<div class="page-wrapper">
	<slot />
</div>

<style>
	.page-wrapper {
		width: min(90rem, 100%);
		min-height: calc(100vh - var(--header-height));
		margin: 0 auto;
		background: rgb(255, 255, 255);
		background: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0) 0%,
			var(--clr__lt-half) 10%,
			var(--clr__lt-half) 90%,
			rgba(255, 255, 255, 0) 100%
		);
		display: flex;
		justify-content: center;
	}
</style>
