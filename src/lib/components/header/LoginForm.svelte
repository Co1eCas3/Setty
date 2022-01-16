<script>
	import { firebase } from '$lib/stores/auth';
	import * as validate from '$lib/utils/validate';

	import ValidatedInput from '$lib/components/utilities/ValidatedInput.svelte';

	let email = '';
	let emailIsErred = false;
	let sendError = false;
	let linkSent = false;
	let submitting = false;

	$: formHeaderMessage = '';
	$: {
		if (linkSent) formHeaderMessage = 'Link is on the way!';
		else if (sendError) formHeaderMessage = 'Oops! Appears there was an error... Try again?';
		else formHeaderMessage = 'Passwordless login!';
	}

	async function sendLink() {
		submitting = true;
		linkSent = await firebase.sendEmail(email);

		if (!linkSent) sendError = true;
		submitting = false;
	}
</script>

<form class="flex stack" on:submit|preventDefault={sendLink} class:wait={submitting}>
	<h3>{formHeaderMessage}</h3>

	{#if !linkSent || sendError}
		<ValidatedInput
			class="will-wait"
			type="email"
			placeholder="you@email.com"
			bind:value={email}
			validation={validate.email}
			transform={(val) => val.toLowerCase()}
			bind:isErred={emailIsErred}
			waitForBlur={true}
			on:focus
			on:blur
		/>

		<button type="submit" disabled={!email || emailIsErred} class="flex will-wait">
			SEND LINK
		</button>
	{/if}
</form>

<style>
	form {
		margin: 1rem;
		background-color: var(--clr__dk-main);
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
