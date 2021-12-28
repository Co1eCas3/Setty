<script>
	import isEmail from 'validator/lib/isEmail';
	import { firebase } from '$lib/stores/firebase';

	export let waiting = false;

	let email = '';
	let thereWasAnError = false;
	let linkSent = false;
	let doValidate = false;

	$: formMessage = thereWasAnError
		? 'Uh-oh! Appears there was a problem, please try again'
		: 'Passwordless login!';

	$: validationError = (doValidate && isEmail(email) && "That email doesn't look right..") || '';

	async function sendLink() {
		if (!isEmail(email)) {
			doValidate = true;
			return;
		}

		doValidate = false;
		waiting = true;
		linkSent = await firebase.sendEmail(email);

		if (!linkSent) thereWasAnError = true;
		waiting = false;
	}
</script>

<form class:validationError on:submit|preventDefault={sendLink}>
	{#if linkSent}
		<h3>Link is on the way!</h3>
	{:else}
		<h3>{formMessage}</h3>
		<div class="validation-cont">
			<input type="email" placeholder="you@email.com" bind:value={email} />
			<small>{validationError}</small>
		</div>
		<button type="submit">SEND LINK</button>
	{/if}
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		place-items: center;
		gap: 1rem;
	}

	form * {
		width: 100%;
	}

	.validation-cont {
		margin-bottom: 0.5rem;
		display: flex;
		flex-direction: column;
	}

	input {
		padding: 0.5rem 1ch;
		border: none;
		border-radius: 7px;
		background-color: var(--txt__lt-dim);
		color: var(--txt__lt-main);
		font-size: 1.25rem;
	}

	small {
		margin: 0.25rem 0;
		font-size: 0.6rem;
	}

	button {
		position: relative;
		border: none;
		background-color: transparent;
		font-size: 1.25rem;
		color: inherit;
		cursor: pointer;
		transition: color 0.2s linear;
	}

	button::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(circle, rgba(221, 222, 238, 0.5) 50%, rgba(255, 255, 255, 0) 100%);
		opacity: 0;
		transition: opacity 0.2s linear;
	}

	button:hover {
		color: var(--clr__accent);
	}

	button::before:hover {
		opacity: 1;
	}
</style>
