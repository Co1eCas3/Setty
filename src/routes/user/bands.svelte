<script>
	import { page } from '$app/stores';

	import { user } from '$lib/stores/auth';
	import * as siteMap from '$lib/utils/siteMap';

	import UserBandsListItem from '$lib/components/user/UserBandsListItem.svelte';
	import Overlay from '$lib/components/utilities/Overlay.svelte';
	import NewBandSequence from '$lib/components/user/NewBandSequence.svelte';
	import { browser } from '$app/env';

	// TODO: THIS IS NOT WORKING ($page.url.hash = '', not causing store updates on change)
	$: browser && console.log(window.location);
	$: console.log('logging $page.url: ', $page.url);
</script>

<h2>Your bands</h2>

<ul>
	<li class="add-new">
		<a href={siteMap.newBand} on:click={({ target }) => console.log(target)}>
			<h4>Add a new band</h4>
		</a>
	</li>
	{#each $user.bands as { band }}
		<UserBandsListItem {...band} />
	{/each}
</ul>

{#if $page.url.hash}
	{console.log('have a hash')}
	<Overlay>
		<NewBandSequence />
	</Overlay>
{/if}

<style>
	.add-new {
	}
</style>
