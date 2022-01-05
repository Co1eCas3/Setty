<script>
	import { page } from '$app/stores';

	import { user } from '$lib/stores/user';
	import * as siteMap from '$lib/utils/siteMap';

	import UserBandsListItem from '$lib/components/user/UserBandsListItem.svelte';
	import Overlay from '$lib/components/utilities/Overlay.svelte';
	import NewBandSequence from '$lib/components/user/NewBandSequence.svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';

	// THIS IS NOT WORKING ($page.url.hash = '', not causing store updates on change)
	$: browser && console.log(window.location);
	$: console.log('logging $page.url: ', $page.url);
</script>

<main>
	<h2>Your bands</h2>

	<ul>
		<li>
			<a href={siteMap.newBand} on:click={({ target }) => console.log(target)}>Add a new band</a>
		</li>
		{#each $user.bands as band}
			<UserBandsListItem {...band} />
		{/each}
	</ul>

	{#if $page.url.hash}
		{console.log('have a hash')}
		<Overlay>
			<NewBandSequence />
		</Overlay>
	{/if}
</main>
