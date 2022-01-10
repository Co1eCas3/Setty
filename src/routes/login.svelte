<script>
	import isEmail from 'validator/lib/isEmail';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { firebase, user, userReady } from '$lib/stores/auth';
	import * as siteMap from '$lib/utils/siteMap';

	let email = '';
	let sendingLink = false,
		signingIn = false,
		linkSent = false,
		thereWasAnError = false;

	$: btnTxt = $firebase.needEmailAgain ? 'SIGN IN' : 'SEND LINK';
	$: neededMethod = $firebase.needEmailAgain ? signIn : sendLink;

	let doValidate = false;
	$: validationError = doValidate && !isEmail(email) ? "That email doesn't look right.." : '';

	onMount(() => firebase.signIn());

	async function sendLink() {
		if (!isEmail(email)) {
			doValidate = true;
			return;
		}

		sendingLink = true;
		doValidate = false;

		const success = await firebase.sendEmail(email);

		if (!success) thereWasAnError = true;
		else linkSent = true;
		sendingLink = false;
		thereWasAnError = false;
	}

	async function signIn() {
		if (!isEmail(email)) {
			doValidate = true;
			return;
		}

		signingIn = true;
		doValidate = false;

		const success = await firebase.signIn(email);

		if (!success) thereWasAnError = true;
		signingIn = false;
	}

	$: if ($user) {
		if (!$user.name) goto(siteMap.newUser);
		else if ($user.bands.length === 1) goto(siteMap.band($user.bands[0].band.webSafeName));
		else goto(siteMap.userBands);
	}
</script>

<main>
	{#if sendingLink}
		<h3>Sending Link...</h3>
	{:else if signingIn}
		<h3>Getting your stuff..</h3>
	{:else if linkSent}
		<h3>Link is on the way!</h3>
	{:else if !$firebase.statusKnown}
		<h3>Checking login status</h3>
	{:else if !$userReady}
		<h3>Getting user data</h3>
	{:else}
		{#if $firebase.needEmailAgain}
			<h3>Please enter your email to complete signin</h3>
		{:else if thereWasAnError}
			<h3>Uh-oh! Appears something went wrong, please try again</h3>
		{:else}
			<h3>Please enter your email to receive a login link</h3>
		{/if}

		<form on:submit|preventDefault={neededMethod} class:validationError={!!validationError}>
			<div class="error-cont">
				<input type="email" placeholder="you@email.com" bind:value={email} />
				<span>{validationError}</span>
			</div>
			<button type="submit">{btnTxt}</button>
		</form>
	{/if}
</main>

<style>
	main {
		min-width: 60ch;
		height: fit-content;
		margin-top: 5rem;
		padding: 3rem;
		background-color: var(--clr__dk-main);
		color: var(--clr__lt-main);
		font-size: 1.5rem;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1.5rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	input,
	span,
	button {
		width: 100%;
	}

	input {
		padding: 0.25em 0;
		border: none;
		border-radius: 7px;
		background: var(--clr__lt-dim);
		font-size: inherit;
		color: inherit;
		text-align: center;
	}

	span {
		min-height: 0.6em;
		font-size: 0.6em;
	}

	button {
		border: none;
		background: transparent;
		padding: 0.25em 0;
		font-size: inherit;
		color: inherit;
		cursor: pointer;
		transition: color 0.1s linear;
	}

	button:hover {
		color: var(--clr__accent);
	}
</style>
