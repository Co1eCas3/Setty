<script>
	import isEmail from 'validator/lib/isEmail';
	import { firebase } from '$lib/stores/auth';

	import * as validate from '../../utils/validate';

	import ValidatedInput from '../utilities/ValidatedInput.svelte';
	import Loader from '../utilities/Loader.svelte';

	let email = '';
	let emailIsErred = false;
	let sendError = false;
	let linkSent = false;

	$: formHeaderMessage = '';
	$: {
		if (linkSent) formHeaderMessage = 'Link is on the way!';
		else if (sendError) formHeaderMessage = 'Oops! Appears there was an error... Try again?';
		else formHeaderMessage = 'Passwordless login!';
	}

	async function sendLink() {
		linkSent = await firebase.sendEmail(email);

		if (!linkSent) sendError = true;
	}
</script>

<form class="flex stack" on:submit|preventDefault={sendLink}>
	<h3>{formHeaderMessage}</h3>

	{#if !linkSent || sendError}
		<ValidatedInput
			type="email"
			placeholder="you@email.com"
			bind:value={email}
			validation={validate.email}
			bind:isErred={emailIsErred}
			waitForBlur={true}
		/>

		<button type="submit" disabled={!email || emailIsErred} class="flex"> SEND LINK </button>
	{/if}
</form>

<style>
	form {
		margin: 1rem;
		gap: 1rem;
	}

	form * {
		width: 100%;
	}

	button {
		position: relative;
		color: var(--clr__lt-half);
		transition: color 0.1s;
	}

	button::after {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-bottom: 0.125rem solid var(--clr__accent);
		transform-origin: center;
		transform: scaleX(0);
		transition: transform 0.1s ease-out;
	}

	button:not(:disabled):hover {
		color: var(--clr__lt-main);
	}

	button:not(:disabled):hover::after {
		transform: scaleX(1);
	}
</style>
