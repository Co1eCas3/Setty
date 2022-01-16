<script context="module">
	import { urlMaker } from '$lib/utils/helpers';
	import { useToken } from '$lib/utils/token';

	export async function load({ params }) {
		const url = urlMaker({ path: `api/lists/${params.band}` });
		const res = await useToken(url);

		if (!res.ok) {
			console.log('band page load error: ', res.data);
			return {
				status: res.status,
				error: 'Oops! Something went wrong.. Try again?'
			};
		}

		return {
			props: { band: res.data.band }
		};
	}
</script>

<script>
	import { setContext } from 'svelte';

	import ctxKey from '$lib/utils/ctxKey';

	export let band;

	setContext();
</script>

<main class="flex stack">
	<header class="flex stack">
		<h2>{band.name}</h2>
	</header>

	<slot />
</main>

<style>
	main {
		width: max(70ch, 100%);
		justify-content: flex-start;
	}

	header {
		width: 100%;
		height: var(--header-height);
		place-items: flex-start;
		box-shadow: var(--under-shadow);
	}
</style>
