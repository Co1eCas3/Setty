<script>
	import { getContext } from 'svelte';
	import * as validator from 'validator';

	import ctxKey from '../../utils/ctxKey';
	import { makeBandNameWebSafe, urlMaker, debounceAsync } from '$lib/utils/helpers';

	import Loader from '../utilities/Loader.svelte';

	export let hasManuallyEditedWSN = false;
	export let WSNIsErred = false;

	const newBand = getContext(ctxKey);

	let attemptedToUseIllegalChar = false;
	let illegalCharUsedTimer = null;

	$: WSNIsTaken = false;
	$: waitingForWSNIsTaken = false;

	$: WSNValidationMessage = '';
	$: {
		if (validator.isEmpty($newBand.band.webSafeName)) {
			WSNValidationMessage = '';
			WSNIsErred = false;
		} else if (attemptedToUseIllegalChar) {
			WSNValidationMessage =
				"Only letters, digits, dashes ('-'), underscores ('_') and {exclamation points ('!') are allowed in the URL.";
			WSNIsErred = true;
		} else if (waitingForWSNIsTaken) {
			WSNValidationMessage = 'Checking availability...';
			WSNIsErred = false;
		} else if (WSNIsTaken) {
			WSNValidationMessage = "Sorry that URL is taken, you'll have to tweak it a bit";
			WSNIsErred = true;
		} else {
			WSNValidationMessage = 'URL is available!';
			WSNIsErred = false;
		}
	}

	// CHECK WEBSAFENAME IS UNIQUE FUNCS (USED IN INPUT ACTION)
	const checkWSNIsUnique = debounceAsync(async (wsn) => {
		if (!wsn) {
			waitingForWSNIsTaken = false;
			return (WSNIsTaken = false);
		}

		const url = urlMaker({ path: '/api/bands/check-wsn-is-unique', query: { wsn } });
		const res = await fetch(url);
		console.log(res);
		waitingForWSNIsTaken = false;

		if (res.status === 204) return (WSNIsTaken = false);
		WSNIsTaken = true;
	}, 250);

	// WEBSAFENAME INPUT ACTION (HANDLER)
	function WSNAction(WSNInput, _) {
		WSNInput.addEventListener('focus', disableAutoGenWSN);

		return {
			// store value passed in as action arg for purposes of detecting when
			// band name input updates it
			// only update func fired when value changed from band name input handler
			// update func fired after input handler updates $newBand.band.webSafeName
			update(WSNStore) {
				if (hasManuallyEditedWSN) return;

				WSNInput.value = WSNStore;
				waitingForWSNIsTaken = true;
				checkWSNIsUnique(WSNStore);
			},
			destroy() {
				WSNInput.removeEventListener('focus', disableAutoGenWSN);
				WSNInput.removeEventListener('input', handleWSNInput);
			}
		};
	}

	function disableAutoGenWSN({ target: WSNInput }) {
		hasManuallyEditedWSN = true;
		WSNInput.removeEventListener('focus', disableAutoGenWSN);
		WSNInput.addEventListener('input', handleWSNInput);
	}

	// no need to check hasManuallyEditedWSN
	// should = true if this listener is active
	function handleWSNInput({ target: WSNInput }) {
		if (!WSNInput.value) {
			WSNIsTaken = false;
			return updateWSN(WSNInput);
		}

		waitingForWSNIsTaken = true;
		checkWSNIsUnique(WSNInput.value);

		if (validator.matches(WSNInput.value, /[^\w\d\s\-_!]/)) {
			illegalCharUsedTimer && clearTimeout(illegalCharUsedTimer);

			attemptedToUseIllegalChar = true;
			illegalCharUsedTimer = setTimeout(() => {
				attemptedToUseIllegalChar = false;
				illegalCharUsedTimer = null;
			}, 3500);
		}

		updateWSN(WSNInput);
	}

	function updateWSN(inp) {
		inp.value = $newBand.band.webSafeName = makeBandNameWebSafe(inp.value);
	}
</script>

<div class="wsn-input__cont">
	<input
		type="text"
		placeholder="your-awesome-band-name"
		use:WSNAction={$newBand.band.webSafeName}
	/>

	<small>
		{#if !attemptedToUseIllegalChar && waitingForWSNIsTaken}
			<Loader />
		{/if}
		{WSNValidationMessage}
	</small>
</div>

<style>
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
		color: var(--clr__lt-half);
		font-size: 0.7em;
	}

	.wsn-input__cont::after {
		content: '/';
		top: 0.1em;
		left: 3.37em;
		font-size: 1em;
	}

	.wsn-input__cont input {
		background-color: var(--clr__lt-dim);
		padding-left: 3.82em;
	}

	.wsn-input__cont small {
		--height: 0.8rem;
		min-height: 1.25em;
		font-size: 0.8rem;
		display: flex;
	}
</style>
