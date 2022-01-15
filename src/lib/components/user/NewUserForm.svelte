<script>
	import { goto } from '$app/navigation';

	import { user } from '$lib/stores/auth';
	import * as validate from '$lib/utils/validate';
	import * as siteMap from '$lib/utils/siteMap';

	import Overlay from '$lib/components/utilities/Overlay.svelte';
	import ValidatedInput from '../utilities/ValidatedInput.svelte';
	import Loader from '../utilities/Loader.svelte';

	let newName = '',
		submitting = false,
		submitError = false,
		isErred;

	$: caption = submitError ? 'Oops! Something went wrong.. Try again?' : 'You look new here';

	async function updateUserName() {
		submitting = true;
		const res = await user.updateUserName(newName);
		if (res) return goto(siteMap.userBands);
		submitError = true;
		submitting = false;
	}
</script>

<Overlay>
	{#if !submitError}
		<h2>Welcome!</h2>
	{/if}
	<h3>{caption}</h3>

	{#if submitting}
		<Loader />
	{:else}
		<form class="flex stack" on:submit|preventDefault={updateUserName}>
			<ValidatedInput
				bind:value={newName}
				placeholder="Introduce yourself"
				validation={validate.name}
				bind:isErred
				autofocus
			/>
			<button
				type="submit"
				class="transit text-color bg-fill hover m-o__ver"
				disabled={isErred || !newName}
			>
				SET NAME
			</button>
		</form>
	{/if}
</Overlay>

<style>
	form :global(input) {
		text-align: center;
		background-color: var(--clr__dk-layer-low) !important;
		border-radius: 0.25em !important;
	}

	button {
		--text-start: var(--clr__lt-main);
		--text-end: var(--clr__dk-main);
	}
</style>
