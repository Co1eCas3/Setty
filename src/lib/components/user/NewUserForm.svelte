<script>
	import { goto } from '$app/navigation';
	import validator from 'validator';

	import { user } from '$lib/stores/auth';
	import * as siteMap from '$lib/utils/siteMap';
	import Overlay from '../utilities/Overlay.svelte';

	let name = '';
	let showMainHeader = true;
	let subHeaderTxt = 'How about you start by introducing yourself?';

	$: errMessage = validator.matches(name, /[^\s\w\d\-']/)
		? 'No special characters except dashes and/or apostrophes please.'
		: !validator.isLength(name, { max: 20 })
		? 'Woah, is your name really that long? Got a nickname maybe? Something less than 20 characters?'
		: '';

	async function updateUserName() {
		showMainHeader = false;

		if (validator.isEmpty(name)) {
			subHeaderTxt = "Don't want to tell us your name, eh?";
			return;
		}

		subHeaderTxt = 'Updating...';
		const updatedUser = await user.updateUserName(name);
		if (!updatedUser) {
			subHeaderTxt = "Oops! Wasn't able to update your name.. Try again?";
			return;
		}

		goto(siteMap.userBands);
	}
</script>

<Overlay>
	{#if showMainHeader}
		<h1>Welcome! You look new here</h1>
	{/if}
	<h3>{subHeaderTxt}</h3>

	<form on:submit|preventDefault={updateUserName}>
		<div class="validation-cont">
			<input type="text" placeholder="What's your name?" bind:value={name} />
			{#if errMessage}
				<small>{errMessage}</small>
			{/if}
		</div>
		<button type="submit" disabled={!!errMessage}>SET NAME</button>
	</form>
</Overlay>

<style>
	form {
		position: relative;
		width: 40ch;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	input {
		width: 100%;
		padding: 0.25em 0.8em;
		border-radius: 7px;
		background-color: var(--clr__lt-dim);
		text-align: center;
	}

	small {
		margin: 0 auto;
		font-size: 0.6em;
	}

	button {
		background-color: var(--clr__dk-main);
		padding: 0.25em 0;
		border-radius: 100vh;
		transition: color 0.1s linear;
	}

	button[disabled] {
		opacity: 0.5;
		cursor: default;
	}

	button:hover:not([disabled]) {
		color: var(--clr__accent);
	}
</style>
