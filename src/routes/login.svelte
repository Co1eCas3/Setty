<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { firebase, user, userReady } from '$lib/stores/auth';
	import * as validate from '$lib/utils/validate';
	import * as siteMap from '$lib/utils/siteMap';

	import ValidatedInput from '$lib/components/utilities/ValidatedInput.svelte';
	import Loader from '$lib/components/utilities/Loader.svelte';

	$: if ($user) {
		if (!$user.name) goto(siteMap.newUser);
		else if ($user.bands.length === 1) goto(siteMap.band($user.bands[0].band.webSafeName));
		else goto(siteMap.userBands);
	}

	let email,
		submitting = false,
		emailErr = false,
		submitErr = false,
		submitSuccess = false,
		headerMessage = 'Password-less login!';

	const submitActions = ['sendEmail', 'signIn'];
	const successMessages = ['Link is on the way!', 'Welcome!'];
	const btnTexts = ['GET LINK', 'SIGN IN'];

	$: {
		if (submitErr) headerMessage = 'Oops! Ran into an error.. Try again?';
		else if (submitSuccess) headerMessage = successMessages[+$firebase.needEmailAgain];
		else if ($firebase.needEmailAgain)
			headerMessage = 'Please enter your email to complete signin.';
	}

	async function submitAction() {
		submitting = true;
		submitSuccess = await firebase[submitActions[+$firebase.needEmailAgain]](email);
		submitErr = !submitSuccess;
		submitting = false;
	}

	onMount(() => firebase.signIn());
</script>

<main class="flex stack">
	<h3>{headerMessage}</h3>

	{#if !submitSuccess}
		<form
			novalidate
			class="flex stack"
			class:wait={!$userReady}
			on:submit|preventDefault={submitAction}
		>
			{#if submitting}
				<Loader />
			{:else}
				<ValidatedInput
					class="will-wait"
					type="email"
					placeholder="you@email.com"
					bind:value={email}
					validation={validate.email}
					bind:isErred={emailErr}
					showErrOnBlur={true}
				/>
				<button
					type="submit"
					class="will-wait transit bg-fill text-color hover m-o__ver"
					disabled={emailErr || !email}
				>
					{btnTexts[+$firebase.needEmailAgain]}
				</button>
			{/if}
		</form>
	{/if}
</main>

<style>
	main {
		min-height: calc(100vh - var(--header-height));
		justify-content: center;
	}

	h3 {
		font-size: var(--font-size-fluid-2);
	}

	form {
		min-width: 45ch;
		padding: 2.5rem 5rem;
		border-radius: 1em;
		background-color: var(--clr__dk-main);
		font-size: var(--font-size-fluid-1);
		color: var(--clr__lt-almost);
		gap: 0.65rem;
	}

	main :global(input) {
		text-align: center;
	}

	button {
		--transit__start: transparent;
		--transit__end: var(--clr__accent--);
		--text-start: var(--clr__lt-main);
		--text-end: var(--clr__dk-main);
	}
</style>
