<script>
	import { getContext } from 'svelte';
	import * as validator from 'validator';

	import * as validate from '$lib/utils/validate';
	import newBandKey from '../../utils/newBandContextKey';
	import bandRoleMap from '$lib/utils/bandRoleMap';
	import { makeBandNameWebSafe, urlMaker, debounceAsync } from '$lib/utils/helpers';

	import ValidatedInput from '../utilities/ValidatedInput.svelte';
	import ContentEditableSelect from '../utilities/ContentEditableSelect.svelte';
	import Loader from '../utilities/Loader.svelte';

	export let isReady = false;

	const newBand = getContext(newBandKey);

	let hasManuallyEdittedWSN = false;
	let attemptedToUseIllegalChar = false;
	let illegalCharUsedTimer = null;
	let nameIsErred, WSNIsErred;

	$: WSNIsTaken = false;
	$: waitingForWSNIsTaken = false;
	$: WSNValidationMessage = '';

	$: {
		if (validator.isEmpty($newBand.band.webSafeName)) WSNValidationMessage = '';
		else if (attemptedToUseIllegalChar)
			WSNValidationMessage =
				"Only letters, digits, dashes ('-'), underscores ('_') and exclamation points ('!') are allowed in the URL.";
		else if (waitingForWSNIsTaken) WSNValidationMessage = 'Checking availability...';
		else if (WSNIsTaken)
			WSNValidationMessage = "Sorry that URL is taken, you'll have to tweak it a bit";
		else WSNValidationMessage = 'URL is available!';
	}

	$: isReady = !!$newBand.band.name && !nameIsErred && !!$newBand.band.webSafeName && !WSNIsErred;

	function autoGenWSN(updatedBandName) {
		if (!hasManuallyEdittedWSN) $newBand.band.webSafeName = makeBandNameWebSafe(updatedBandName);
		return updatedBandName;
	}

	function handleWSNInput(WSNInput, WSNStore) {
		WSNInput.addEventListener('input', handleInput);
		WSNInput.addEventListener('focus', handleFocus);

		const WSNIsTakenFn = debounceAsync(async (wsn) => {
			if (!wsn) {
				return (WSNIsTaken = waitingForWSNIsTaken = false);
			}

			const url = urlMaker({ path: '/api/bands/check-wsn-is-unique', query: { wsn } });
			const res = await fetch(url);

			waitingForWSNIsTaken = false;

			if (res.status === 204) return (WSNIsTaken = false);
			WSNIsTaken = true;
		}, 300);

		function handleFocus() {
			WSNInput.addEventListener('input', disableAutoGenWSN);
			WSNInput.removeEventListener('focus', handleFocus);
		}

		function disableAutoGenWSN() {
			console.log('autogen disabled');
			hasManuallyEdittedWSN = true;
			WSNInput.removeEventListener('input', disableAutoGenWSN);
		}

		function handleInput() {
			if (!WSNInput.value)
				return (WSNInput.value = $newBand.band.webSafeName = makeBandNameWebSafe(WSNInput.value));
			waitingForWSNIsTaken = true;
			WSNIsTakenFn(WSNInput.value);

			if (!illegalCharUsedTimer && validator.matches(WSNInput.value, /[^\w\d\s\-_!]/)) {
				attemptedToUseIllegalChar = true;
				illegalCharUsedTimer = setTimeout(() => {
					attemptedToUseIllegalChar = false;
					illegalCharUsedTimer = null;
				}, 3500);
			}

			WSNInput.value = $newBand.band.webSafeName = makeBandNameWebSafe(WSNInput.value);
		}

		return {
			update(WSNStore) {
				if (!hasManuallyEdittedWSN) {
					WSNInput.value = WSNStore;
					waitingForWSNIsTaken = true;
					WSNIsTakenFn(WSNStore);
				}
			},
			destroy() {
				WSNInput.removeEventListener('input', handleInput);
				WSNInput.addEventListener('focus', handleFocus);
			}
		};
	}
</script>

<fieldset>
	<h3>Enter your band name</h3>

	<ValidatedInput
		type="text"
		placeholder="Enter you band's name"
		bind:value={$newBand.band.name}
		valueFn={autoGenWSN}
		validationFn={validate.bandName}
		bind:isErred={nameIsErred}
	/>

	<h3>Web Safe Name</h3>
	<h6>This will be your band's URL. It must be unique.</h6>

	<div class="wsn-input__cont">
		<input
			type="text"
			placeholder="your-awesome-band-name"
			use:handleWSNInput={$newBand.band.webSafeName}
		/>

		<small>
			{#if !attemptedToUseIllegalChar && waitingForWSNIsTaken}
				<Loader />
			{/if}
			{WSNValidationMessage}
		</small>
	</div>

	<!-- <ValidatedInput
		type="text"
		placeholder="your-awesome-band-name"
		bind:value={$newBand.band.webSafeName}
		valueFn={disableAutoGenWSN}
		validationFn={() => WSNValidationMessage}
		validateOn={['focus', 'input']}
		bind:isErred={WSNIsErred}
	/> -->

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

	.wsn-input__cont {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.wsn-input__cont::before,
	.wsn-input__cont::after {
		content: 'setty.com';
		position: absolute;
		top: 0.7em;
		left: 0.5em;
		color: var(--txt__lt-half);
		font-size: 0.7em;
	}

	.wsn-input__cont::after {
		content: '/';
		top: 0.1em;
		left: 3.37em;
		font-size: 1em;
	}

	.wsn-input__cont input {
		background-color: var(--txt__lt-dim);
		padding-left: 3.82em;
	}

	.wsn-input__cont small {
		--height: 0.8rem;
		min-height: 1.25em;
		font-size: 0.8rem;
		display: flex;
	}
</style>
