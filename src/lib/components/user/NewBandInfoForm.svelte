<script>
	import { getContext } from 'svelte';

	import * as validate from '$lib/utils/validate';
	import ctxKey from '$lib/utils/ctxKey';
	import bandRoleMap from '$lib/utils/bandRoleMap';
	import { makeBandNameWebSafe } from '$lib/utils/helpers';

	import ValidatedInput from '$lib/components/utilities/ValidatedInput.svelte';
	import ContentEditableSelect from '$lib/components/utilities/ContentEditableSelect.svelte';
	import Loader from '$lib/components/utilities/Loader.svelte';

	export let isReady = false;

	const newBand = getContext(ctxKey);
	let hasManuallyEditedWSN, nameIsErred, WSNIsErred;

	$: isReady = !!$newBand.band.name && !nameIsErred && !!$newBand.band.webSafeName && !WSNIsErred;

	// BAND NAME INPUT LISTENER
	function autoGenWSN(updatedBandName) {
		if (!hasManuallyEditedWSN) $newBand.band.webSafeName = makeBandNameWebSafe(updatedBandName);
		return updatedBandName;
	}
</script>

<fieldset class="flex stack">
	<!-- - - - - - - - - - - - -- - - - - BAND NAME - - - - - - -->
	<h3>Enter your band name</h3>

	<ValidatedInput
		type="text"
		placeholder="Enter you band's name"
		bind:value={$newBand.band.name}
		transform={autoGenWSN}
		validation={validate.bandName}
		bind:isErred={nameIsErred}
	/>

	<!-- - - - - - - - - - - - -- - - - - WEB SAFE NAME - - - - - - -->
	<h3>Web Safe Name</h3>
	<h6>This will be your band's URL. It must be unique.</h6>

	<div class="wsn-input-cont flex stack">
		<ValidatedInput
			placeholder="band-name"
			bind:value={$newBand.band.webSafeName}
			bind:isErred={WSNIsErred}
			transform={makeBandNameWebSafe}
			validation={validate.webSafeName}
			on:keyup={() => (hasManuallyEditedWSN = true)}
		/>
		{#if !!$newBand.band.webSafeName && !WSNIsErred}
			<small class="flex">
				{#await validate.WSNIsTaken($newBand.band.webSafeName)}
					<Loader --height=".7rem" />
				{:then WSNIsTaken}
					{WSNIsTaken
						? "Sorry, that URL is taken, you'll have to tweak it a bit"
						: 'URL is available!'}
				{/await}
			</small>
		{/if}
	</div>

	<!-- - - - - - - - - - - - -- - - - - BAND ROLE SELECT - - - - - - -->
	<h3>What role do you take on in this band?</h3>

	<ContentEditableSelect
		bind:selectedValue={$newBand.bandRole}
		bind:customValue={$newBand.otherBandRoleDescription}
	>
		{#each bandRoleMap as role, val}
			<option value={val} selected={val == $newBand.bandRole} contenteditable={!val}>{role}</option>
		{/each}
	</ContentEditableSelect>
</fieldset>

<style>
	fieldset {
		padding: 1rem 2rem;
		font-size: var(--font-size-fluid-1);
		color: var(--clr__lt-main);
		gap: 0.4rem;
	}

	h3,
	h6 {
		color: var(--clr__lt-half);
	}

	.wsn-input-cont {
		position: relative;
	}

	.wsn-input-cont small {
		position: absolute;
		left: 0;
		bottom: 0.4em;
		width: 100%;
		font-size: 0.5em;
		text-align: center;
	}
</style>
