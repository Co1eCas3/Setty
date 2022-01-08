<script>
	import { goto } from '$app/navigation';

	import { user } from '$lib/stores/user';
	import { userReady } from '$lib/stores/userReady';
	import * as siteMap from '../../utils/siteMap';

	import Loader from './Loader.svelte';

	$: if ($userReady && !$user) goto(siteMap.login);
</script>

<div class="auth-only-page">
	{#if !$userReady}
		<div class="loader-cont flex">
			<Loader --color="var(--clr__dk-main)" />
		</div>
	{:else if $user}
		<slot />
	{/if}
</div>

<style>
	.auth-only-page {
		position: relative;
		min-width: 100%;
		min-height: calc(100vh - var(--header-height));
	}

	.loader-cont {
		width: 100%;
		height: 100%;
	}
</style>
