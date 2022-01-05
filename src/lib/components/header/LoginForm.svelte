<script>
	import isEmail from 'validator/lib/isEmail';
	import { firebase } from '$lib/stores/firebase';

	import * as validate from '../../utils/validate';

	import ValidatedInput from '../utilities/ValidatedInput.svelte';
	import Loader from '../utilities/Loader.svelte';

	export let waiting = false;

	let email = '';
	let emailIsErred = false;
	let sendError = false;
	let linkSent = false;

	$: formHeaderMessage = '';
	$: {
		if (waiting) formHeaderMessage = 'Sending link...';
		else if (linkSent) formHeaderMessage = 'Link is on the way!';
		else if (sendError) formHeaderMessage = 'Oops! Appears there was an error... Try again?';
		else formHeaderMessage = 'Passwordless login!';
	}

	async function sendLink() {
		waiting = true;
		linkSent = await firebase.sendEmail(email);

		if (!linkSent) sendError = true;
		waiting = false;
	}
</script>

<form class="flex stack" on:submit|preventDefault={sendLink}>
	<h3>{formHeaderMessage}</h3>

	{#if waiting}
		<Loader />
	{:else if (!waiting && !linkSent) || sendError}
		<ValidatedInput
			type="email"
			placeholder="you@email.com"
			required={true}
			bind:value={email}
			validationFn={validate.email}
			bind:isErred={emailIsErred}
			validateOn={['change', 'input']}
		/>

		<button
			type="submit"
			disabled={!email || emailIsErred}
			class="flex trans text__dim-accent underline"
		>
			SEND LINK
		</button>
	{/if}
</form>

<style>
	form {
		margin: 1rem 0;
		gap: 1rem;
	}

	form * {
		width: 100%;
	}

	button {
		/* position: relative;
		border: none;
		background-color: transparent;
		font-size: 1.25rem;
		color: inherit;
		cursor: pointer;
		transition: color 0.2s linear; */
	}
</style>
