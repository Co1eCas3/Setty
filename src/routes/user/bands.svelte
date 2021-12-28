<script>
	import { user } from '$lib/stores/user';

	import UserBandsListItem from '$lib/components/user/UserBandsListItem.svelte';
	import Overlay from '$lib/components/utilities/Overlay.svelte';
	import NewBandSequence from '$lib/components/user/NewBandSequence.svelte';

	let addingBand = false;
	const cancelAddBand = () => (addingBand = false);
</script>

<main>
	<h2>Your bands</h2>

	<ul>
		<li><button on:click={() => (addingBand = true)}>Add a new band</button></li>
		{#each $user.bands as band}
			<UserBandsListItem {...band} />
		{/each}
	</ul>

	{#if addingBand}
		<Overlay cancelCb={cancelAddBand}>
			<NewBandSequence />
		</Overlay>
	{/if}
</main>
