<script>
	import { getContext } from 'svelte';

	import * as validate from '$lib/utils/validate';
	import ctxKey from '../../utils/ctxKey';
	import bandRoleMap from '$lib/utils/bandRoleMap';
	import { makeBandNameWebSafe } from '$lib/utils/helpers';

	import ValidatedInput from '../utilities/ValidatedInput.svelte';
	import NewWebSafeNameInput from './NewWebSafeNameInput.svelte';
	import ContentEditableSelect from '../utilities/ContentEditableSelect.svelte';

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

<fieldset>
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

	<NewWebSafeNameInput bind:WSNIsErred bind:hasManuallyEditedWSN />

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
		display: flex;
		flex-direction: column;
		place-items: center;
		gap: 1rem;
	}
</style>
