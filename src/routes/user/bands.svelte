<script>
	import { page } from '$app/stores';

	import { user } from '$lib/stores/auth';
	import * as siteMap from '$lib/utils/siteMap';

	import UserBandsListItem from '$lib/components/user/UserBandsListItem.svelte';
	import Overlay from '$lib/components/utilities/Overlay.svelte';
	import NewBandSequence from '$lib/components/user/NewBandSequence.svelte';
	import { browser } from '$app/env';

	// TODO: THIS IS NOT WORKING ($page.url.hash = '', not causing store updates on change)
	// $: console.log('logging $page.url: ', $page.url);

	$: bands = $user?.bands || [];
</script>

<h2>Your bands</h2>

<ul class="flex stack">
	<li class="add-new will-wait transit text-color hover">
		<a href={siteMap.newBand} on:click={({ target }) => console.log(target)}>
			<h3>Add a new band</h3>
		</a>
	</li>
	{#each bands as { band }}
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
	ul {
		max-width: max-content;
		margin: 1rem 1.5rem;
		place-items: flex-start;
		gap: 0.65em;
	}

	.add-new {
	}
</style>
